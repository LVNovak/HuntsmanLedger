import { CARD_MAP } from "./cards.ts";
import { OUTCOME_LABELS, scoreOutcome } from "./evaluate.ts";
import type { HandReport, Outcome, Usage, Weights } from "./types.ts";

export type CardRow = {
  id: string;
  name: string;
  hands: number;
  played: number;
  pitched: number;
  blocked: number;
  arsenaled: number;
  retained: number;
  discarded: number;
  contribution: number;
  role: string;
  because: string;
};

export type SynergyRow = {
  ids: string[];
  names: string;
  n: number;
  mean: number;
  interaction: number;
  note: string;
};

const ROLE_RULES = [
  "Block — blocked in at least 35% of best lines.",
  "Resource — pitched in at least 55% and played in at most 25%.",
  "Enabler — an attack reaction played in at least 30%.",
  "Contract — played in at least 40% and contract contribution leads.",
  "Pressure — played in at least 40% and damage contribution is at least 1.",
  "Arsenal — arsenaled in at least 30%.",
  "Kept — retained in at least 45%.",
  "Flex — no threshold won.",
];

export function roleRules(): string[] {
  return ROLE_RULES;
}

export function withScores(hands: HandReport[], weights: Weights): HandReport[] {
  return hands
    .map((hand) => ({
      ...hand,
      score: scoreOutcome(hand.outcome, weights),
      contribution: hand.contribution?.map((row) => ({
        ...row,
        score: scoreOutcome(row.delta, weights),
      })),
    }))
    .sort((a, b) => b.score - a.score);
}

function emptyRates() {
  return { played: 0, pitched: 0, blocked: 0, arsenaled: 0, retained: 0, discarded: 0, hands: 0, contribution: 0, contributionN: 0 };
}

export function cardRows(hands: HandReport[]): CardRow[] {
  const acc = new Map<string, ReturnType<typeof emptyRates>>();
  for (const hand of hands) {
    const seen = new Set<string>();
    for (const use of hand.uses) {
      const row = acc.get(use.id) ?? emptyRates();
      row.hands += 1;
      row[use.usage] += 1;
      acc.set(use.id, row);
      seen.add(use.id);
    }
    if (!hand.contribution) continue;
    for (const part of hand.contribution) {
      const row = acc.get(part.id) ?? emptyRates();
      row.contribution += part.score;
      row.contributionN += 1;
      acc.set(part.id, row);
      void seen;
    }
  }
  const rows: CardRow[] = [];
  for (const [id, row] of acc) {
    const n = Math.max(1, row.hands);
    const played = row.played / n;
    const pitched = row.pitched / n;
    const blocked = row.blocked / n;
    const arsenaled = row.arsenaled / n;
    const retained = row.retained / n;
    const discarded = row.discarded / n;
    const contribution = row.contributionN ? row.contribution / row.contributionN : 0;
    const def = CARD_MAP[id];
    let role = "Flex";
    let because = "No usage threshold won.";
    if (blocked >= 0.35) {
      role = "Block";
      because = `Blocked in ${pct(blocked)} of best lines.`;
    } else if (pitched >= 0.55 && played <= 0.25) {
      role = "Resource";
      because = `Pitched in ${pct(pitched)}; played in ${pct(played)}.`;
    } else if (def?.kind === "attack-reaction" && played >= 0.3) {
      role = "Enabler";
      because = `Played as a reaction in ${pct(played)} of best lines.`;
    } else if (played >= 0.4 && def?.contract) {
      role = "Contract";
      because = `Played in ${pct(played)} and it is a contract card.`;
    } else if (played >= 0.4) {
      role = "Pressure";
      because = `Played in ${pct(played)} of best lines.`;
    } else if (arsenaled >= 0.3) {
      role = "Arsenal";
      because = `Arsenaled in ${pct(arsenaled)} of best lines.`;
    } else if (retained >= 0.45) {
      role = "Kept";
      because = `Still in hand in ${pct(retained)} of best lines.`;
    }
    rows.push({
      id,
      name: def?.name ?? id,
      hands: row.hands,
      played,
      pitched,
      blocked,
      arsenaled,
      retained,
      discarded,
      contribution,
      role,
      because,
    });
  }
  rows.sort((a, b) => b.contribution - a.contribution || b.played - a.played);
  return rows;
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function mean(list: number[]): number {
  if (!list.length) return 0;
  return list.reduce((a, b) => a + b, 0) / list.length;
}

export function synergies(hands: HandReport[]): { pairs: SynergyRow[]; triples: SynergyRow[] } {
  const scores = hands.map((h) => h.score);
  const overall = mean(scores);
  const pairBuckets = new Map<string, { ids: [string, string]; both: number[]; onlyA: number[]; onlyB: number[]; neither: number[] }>();
  const ids = [...new Set(hands.flatMap((h) => h.ids))].sort();
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      pairBuckets.set(`${ids[i]}|${ids[j]}`, {
        ids: [ids[i], ids[j]],
        both: [],
        onlyA: [],
        onlyB: [],
        neither: [],
      });
    }
  }
  for (const hand of hands) {
    const set = new Set(hand.ids);
    for (const bucket of pairBuckets.values()) {
      const [a, b] = bucket.ids;
      const ha = set.has(a);
      const hb = set.has(b);
      if (ha && hb) bucket.both.push(hand.score);
      else if (ha) bucket.onlyA.push(hand.score);
      else if (hb) bucket.onlyB.push(hand.score);
      else bucket.neither.push(hand.score);
    }
  }
  const pairs: SynergyRow[] = [];
  for (const bucket of pairBuckets.values()) {
    if (bucket.both.length < 4 || bucket.onlyA.length < 4 || bucket.onlyB.length < 4 || bucket.neither.length < 4) continue;
    const interaction = mean(bucket.both) - mean(bucket.onlyA) - mean(bucket.onlyB) + mean(bucket.neither);
    const [a, b] = bucket.ids;
    pairs.push({
      ids: [a, b],
      names: `${CARD_MAP[a]?.name ?? a} + ${CARD_MAP[b]?.name ?? b}`,
      n: bucket.both.length,
      mean: mean(bucket.both),
      interaction,
      note: `Together ${fmt(mean(bucket.both))} vs ${fmt(overall)} overall. Interaction ${fmt(interaction)}.`,
    });
  }
  pairs.sort((a, b) => b.interaction - a.interaction);

  const triples: SynergyRow[] = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      for (let k = j + 1; k < ids.length; k++) {
        const trip = [ids[i], ids[j], ids[k]];
        const both: number[] = [];
        for (const hand of hands) {
          if (trip.every((id) => hand.ids.includes(id))) both.push(hand.score);
        }
        if (both.length < 4) continue;
        const lift = mean(both) - overall;
        triples.push({
          ids: trip,
          names: trip.map((id) => CARD_MAP[id]?.name ?? id).join(" + "),
          n: both.length,
          mean: mean(both),
          interaction: lift,
          note: `Mean ${fmt(mean(both))} against ${fmt(overall)} for every searched hand. Lift ${fmt(lift)}.`,
        });
      }
    }
  }
  triples.sort((a, b) => b.interaction - a.interaction);
  return { pairs: pairs.slice(0, 12), triples: triples.slice(0, 8) };
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Math.abs(r - Math.round(r)) < 0.05 ? String(Math.round(r)) : r.toFixed(2);
}

export type PatternReport = {
  sentences: string[];
  means: { label: string; value: string }[];
};

export function patterns(hands: HandReport[]): PatternReport {
  if (!hands.length) return { sentences: ["Run a search to read structure off the results."], means: [] };
  const eliteN = Math.max(8, Math.ceil(hands.length * 0.1));
  const elite = hands.slice(0, Math.min(hands.length, eliteN));
  const avg = (pick: (o: Outcome) => number) => mean(elite.map((h) => pick(h.outcome)));
  const pitchAvg = mean(elite.map((h) => h.ids.reduce((n, id) => n + (CARD_MAP[id]?.pitch ?? 0), 0) / h.ids.length));
  const contractAvg = mean(
    elite.map((h) => h.ids.filter((id) => CARD_MAP[id]?.contract).length),
  );
  const blueAvg = mean(elite.map((h) => h.ids.filter((id) => CARD_MAP[id]?.color === "blue").length));
  const counts = new Map<string, number>();
  const pairCounts = new Map<string, number>();
  for (const hand of elite) {
    for (const id of hand.ids) counts.set(id, (counts.get(id) ?? 0) + 1);
    const uniq = [...new Set(hand.ids)].sort();
    for (let i = 0; i < uniq.length; i++) {
      for (let j = i + 1; j < uniq.length; j++) {
        const key = `${uniq[i]}|${uniq[j]}`;
        pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
      }
    }
  }
  const topCard = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const topPair = [...pairCounts.entries()].sort((a, b) => b[1] - a[1])[0];
  const cardName = topCard ? CARD_MAP[topCard[0]]?.name ?? topCard[0] : "—";
  const pairName = topPair
    ? topPair[0]
        .split("|")
        .map((id) => CARD_MAP[id]?.name ?? id)
        .join(" + ")
    : "—";
  const sentences = [
    `The top ${elite.length} hands average ${fmt(avg((o) => o.damage))} damage, ${fmt(avg((o) => o.contractsCompleted))} contracts, and ${fmt(avg((o) => o.cardsBanished))} cards banished.`,
    `They finish with ${fmt(avg((o) => o.cardsInHand))} cards in hand and ${fmt(avg((o) => o.cardsInArsenal))} in arsenal. Average pitch value in the hand is ${fmt(pitchAvg)}.`,
    `Elite hands hold ${fmt(contractAvg)} contract cards and ${fmt(blueAvg)} blue cards on average.`,
    topCard
      ? `${cardName} appears in ${topCard[1]} of these ${elite.length} hands. The most common pair is ${pairName} (${topPair?.[1] ?? 0}).`
      : "No card repeated.",
  ];
  const means = [
    { label: OUTCOME_LABELS.damage, value: fmt(avg((o) => o.damage)) },
    { label: OUTCOME_LABELS.contractsCompleted, value: fmt(avg((o) => o.contractsCompleted)) },
    { label: OUTCOME_LABELS.cardsBanished, value: fmt(avg((o) => o.cardsBanished)) },
    { label: OUTCOME_LABELS.cardsInHand, value: fmt(avg((o) => o.cardsInHand)) },
    { label: OUTCOME_LABELS.cardsInArsenal, value: fmt(avg((o) => o.cardsInArsenal)) },
    { label: OUTCOME_LABELS.lifeGained, value: fmt(avg((o) => o.lifeGained)) },
    { label: "Avg pitch", value: fmt(pitchAvg) },
  ];
  return { sentences, means };
}
