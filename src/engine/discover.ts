import { CARD_MAP } from "./cards.ts";
import { scoreOutcome, subtractOutcome } from "./evaluate.ts";
import { solveHand } from "./kernel.ts";
import type { DiscoverResult, HandReport, Outcome, SearchConfig, Usage, UsageMix } from "./types.ts";

export function combinationCount(n: number, k: number): number {
  if (k < 0 || n < 0 || k > n) return 0;
  let c = 1;
  for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1);
  return Math.round(c);
}

function combinations(ids: string[], k: number): string[][] {
  const out: string[][] = [];
  const combo: string[] = [];
  const walk = (start: number) => {
    if (combo.length === k) {
      out.push(combo.slice());
      return;
    }
    for (let i = start; i < ids.length; i++) {
      combo.push(ids[i]);
      walk(i + 1);
      combo.pop();
    }
  };
  walk(0);
  return out;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleCombos(ids: string[], k: number, size: number, seed: number): string[][] {
  const rand = mulberry32(seed);
  const seen = new Set<string>();
  const out: string[][] = [];
  const guard = size * 30;
  let tries = 0;
  while (out.length < size && tries < guard) {
    tries += 1;
    const pool = ids.slice();
    const hand: string[] = [];
    for (let i = 0; i < k && pool.length; i++) {
      const idx = Math.floor(rand() * pool.length);
      hand.push(pool.splice(idx, 1)[0]);
    }
    hand.sort();
    const key = hand.join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hand);
  }
  return out;
}

function dominantUsage(mix: UsageMix): Usage {
  let best: Usage = "retained";
  let n = -1;
  for (const [key, value] of Object.entries(mix) as [Usage, number][]) {
    if (value > n) {
      best = key;
      n = value;
    }
  }
  return best;
}

function reportFrom(ids: string[], config: SearchConfig): HandReport {
  const solved = solveHand(ids, config);
  const uses = ids.map((id, iid) => ({
    id,
    mix: solved.usage[iid] ?? {
      played: 0,
      pitched: 0,
      blocked: 0,
      arsenaled: 0,
      retained: 1,
      discarded: 0,
    },
    usage: dominantUsage(
      solved.usage[iid] ?? {
        played: 0,
        pitched: 0,
        blocked: 0,
        arsenaled: 0,
        retained: 1,
        discarded: 0,
      },
    ),
  }));
  return {
    ids,
    iids: ids.map((_, i) => i),
    score: solved.score,
    outcome: solved.outcome,
    line: solved.line,
    alts: solved.alts,
    uses: uses.map((u) => ({ id: u.id, usage: u.usage })),
    partial: solved.partial,
  };
}

export function discover(
  cardIds: string[],
  config: SearchConfig,
  onProgress?: (done: number, total: number) => void,
): DiscoverResult {
  const started = Date.now();
  const unique = [...new Set(cardIds)].filter((id) => CARD_MAP[id]);
  const possible = combinationCount(unique.length, 4);
  const exhaustive = possible <= config.exhaustCap;
  const hands = exhaustive
    ? combinations(unique, 4)
    : sampleCombos(unique, 4, Math.min(config.sampleSize, possible), config.seed);
  const reports: HandReport[] = [];
  let partialHands = 0;
  hands.forEach((ids, index) => {
    const report = reportFrom(ids, config);
    if (report.partial) partialHands += 1;
    reports.push(report);
    if (onProgress && (index % 5 === 0 || index === hands.length - 1)) onProgress(index + 1, hands.length);
  });
  reports.sort((a, b) => b.score - a.score);
  const top = reports.slice(0, config.contributionHands);
  for (const hand of top) {
    hand.contribution = hand.ids.map((id, index) => {
      const rest = hand.ids.filter((_, i) => i !== index);
      const ablated = solveHand(rest, config);
      if (ablated.partial) hand.partial = true;
      const delta = subtractOutcome(hand.outcome, ablated.outcome);
      return { id, delta, score: scoreOutcome(delta, config.weights) };
    });
  }
  return {
    hands: reports,
    meta: {
      handsSearched: reports.length,
      handsPossible: possible,
      exhaustive,
      ms: Date.now() - started,
      partialHands,
      nodes: reports.length,
      weaponId: config.weaponId,
      connect: config.prior.connect,
    },
  };
}

export function rescore(outcome: Outcome, config: SearchConfig): number {
  return scoreOutcome(outcome, config.weights);
}
