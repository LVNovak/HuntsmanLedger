import { cardById, weaponById } from "./cards.ts";
import { emptyOutcome, mixOutcomes, scoreOutcome } from "./evaluate.ts";
import type {
  CardDef,
  ContractKind,
  Line,
  OnHit,
  Outcome,
  Prior,
  SearchConfig,
  SolveResult,
  Usage,
  UsageMix,
  WeaponDef,
} from "./types.ts";

type Inst = { iid: number; cardId: string };

type Link = {
  inst: Inst | null;
  cardId: string;
  power: number;
  piercing: number;
  contract: ContractKind | null;
  contractOpen: number;
  goAgain: boolean;
  onHitGoAgain: boolean;
  onHit: OnHit[];
  resolved: boolean;
  shred: number;
  source: "card" | "weapon";
  weaponMark: boolean;
  weaponTax: number;
};

type Phase = "defense" | "action" | "over";

type State = {
  hand: Inst[];
  arsenal: Inst | null;
  graveyard: Inst[];
  pitch: Inst[];
  chain: Link[];
  resources: number;
  ap: number;
  weaponReady: boolean;
  weaponDestroyed: boolean;
  marked: boolean;
  silver: number;
  ponder: number;
  assassinGoAgain: boolean;
  blacktekUsed: boolean;
  maskUsed: boolean;
  flickUsed: boolean;
  arsenaled: boolean;
  pendingTax: number;
  phase: Phase;
  stats: Outcome;
  usage: Record<number, Usage>;
};

type Ctx = {
  config: SearchConfig;
  weapon: WeaponDef;
  budget: number;
  nodes: number;
  partial: boolean;
  memo: Map<string, Val>;
  rootAlts: { score: number; outcome: Outcome; line: Line }[];
};

type Val = {
  score: number;
  outcome: Outcome;
  line: Line;
  usage: Record<number, UsageMix>;
};

const USAGES: Usage[] = ["played", "pitched", "blocked", "arsenaled", "retained", "discarded"];

function zeroMix(): UsageMix {
  return { played: 0, pitched: 0, blocked: 0, arsenaled: 0, retained: 0, discarded: 0 };
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Math.abs(r - Math.round(r)) < 0.001 ? String(Math.round(r)) : r.toFixed(2);
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function card(inst: Inst): CardDef {
  return cardById(inst.cardId);
}

function sumPitch(list: Inst[]): number {
  return list.reduce((n, inst) => n + card(inst).pitch, 0);
}

function subsets(list: Inst[]): Inst[][] {
  const out: Inst[][] = [[]];
  for (const inst of list) {
    const n = out.length;
    for (let i = 0; i < n; i++) out.push(out[i].concat(inst));
  }
  return out;
}

function minimalPitches(pool: Inst[], deficit: number): Inst[][] {
  const viable = subsets(pool).filter((s) => sumPitch(s) >= deficit);
  return viable.filter(
    (s) =>
      !viable.some(
        (o) =>
          o.length < s.length && o.every((x) => s.some((y) => y.iid === x.iid)),
      ),
  );
}

function names(list: Inst[]): string {
  if (!list.length) return "nothing";
  return list.map((inst) => `${card(inst).name} (${card(inst).pitch})`).join(", ");
}

function condBase(contract: ContractKind, prior: Prior): number {
  switch (contract.kind) {
    case "color":
      return contract.color === "red" ? prior.pRed : contract.color === "yellow" ? prior.pYellow : prior.pBlue;
    case "attack-action":
      return prior.pAttackAction;
    case "non-attack-action":
      return prior.pNonAttackAction;
    case "non-action":
      return clamp01(1 - prior.pAttackAction - prior.pNonAttackAction);
    case "cost-le":
      return prior.pCostLe1;
    case "def-le":
      return prior.pDefLe2;
    case "go-again":
      return prior.pGoAgain;
  }
}

function connectP(pEvent: number, prior: Prior): number {
  if (prior.connect === "always") return pEvent > 1e-9 ? 1 : 0;
  if (prior.connect === "never") return 0;
  return clamp01(pEvent);
}

function clone(s: State): State {
  return {
    ...s,
    hand: s.hand.slice(),
    graveyard: s.graveyard.slice(),
    pitch: s.pitch.slice(),
    chain: s.chain.map((link) => ({ ...link, onHit: link.onHit.slice() })),
    stats: { ...s.stats },
    usage: { ...s.usage },
  };
}

function removeFrom(list: Inst[], iid: number): Inst[] {
  return list.filter((inst) => inst.iid !== iid);
}

function take(state: State, inst: Inst) {
  state.hand = removeFrom(state.hand, inst.iid);
  if (state.arsenal?.iid === inst.iid) state.arsenal = null;
}

function pay(state: State, pitches: Inst[], cost: number) {
  const gained = sumPitch(pitches);
  for (const inst of pitches) {
    take(state, inst);
    state.pitch.push(inst);
    state.usage[inst.iid] = "pitched";
  }
  state.resources += gained;
  state.stats.resourcesGenerated += gained;
  state.resources -= cost;
  state.stats.resourcesSpent += cost;
}

function mintContract(state: State, link: Link | null, pMatch: number) {
  if (!link?.contract || link.contractOpen <= 1e-9 || pMatch <= 1e-9) return;
  const open = link.contractOpen;
  const pNew = Math.min(1, open * pMatch);
  if (pNew >= 1 - 1e-9) {
    state.stats.contractsCompleted += open;
    state.stats.silverCreated += open;
    state.silver += 1;
    link.contractOpen = 0;
    return;
  }
  state.stats.contractsCompleted += pNew;
  state.stats.silverCreated += pNew;
  link.contractOpen = open * (1 - pMatch);
}

function strike(power: number, piercing: number, block: number, shred: number): number {
  const blocked = Math.max(0, block - shred);
  const pierce = Math.min(power, Math.max(0, piercing));
  return Math.min(power, pierce + Math.max(0, power - pierce - blocked));
}

function applyOnHits(state: State, link: Link, damage: number, prior: Prior) {
  let actionBanishP = 0;
  const pAction = clamp01(prior.pAttackAction + prior.pNonAttackAction);
  for (const hit of link.onHit) {
    if (hit.type === "banish-top") {
      const n = hit.n ?? 1;
      state.stats.cardsBanished += n;
      actionBanishP += n * pAction;
      if (link.contract) {
        const base = condBase(link.contract, prior);
        const pEvent = 1 - (1 - base) ** n;
        mintContract(state, link, connectP(pEvent, prior));
      }
    } else if (hit.type === "banish-top-repeat-color") {
      const pColor = hit.color === "red" ? prior.pRed : hit.color === "yellow" ? prior.pYellow : prior.pBlue;
      state.stats.cardsBanished += 1 + pColor;
      actionBanishP += (1 + pColor) * pAction;
      const pEvent = pColor;
      mintContract(state, link, connectP(pEvent, prior));
    } else if (hit.type === "banish-top-damage") {
      const n = Math.max(0, Math.round(damage));
      state.stats.cardsBanished += n;
      actionBanishP += n * pAction;
      if (link.contract && n > 0) {
        const base = condBase(link.contract, prior);
        mintContract(state, link, connectP(1 - (1 - base) ** n, prior));
      }
    } else if (hit.type === "banish-arsenal") {
      state.stats.cardsBanished += prior.pArsenal;
      actionBanishP += prior.pArsenal * pAction;
      if (link.contract) {
        const base = condBase(link.contract, prior);
        mintContract(state, link, connectP(prior.pArsenal * base, prior));
      }
    } else if (hit.type === "banish-hand") {
      state.stats.cardsBanished += 1;
      actionBanishP += pAction;
      if (link.contract) {
        const base = condBase(link.contract, prior);
        const pHas = 1 - (1 - base) ** Math.max(0, prior.oppHand);
        mintContract(state, link, connectP(pHas, prior));
      }
    } else if (hit.type === "banish-hand-same-color") {
      const colors = [prior.pRed, prior.pYellow, prior.pBlue];
      let pSecond = 0;
      for (const p of colors) pSecond += p * (1 - (1 - p) ** Math.max(0, prior.oppHand));
      state.stats.cardsBanished += pSecond;
      actionBanishP += pSecond * pAction;
    } else if (hit.type === "banish-hand-if-marked") {
      if (state.marked) {
        state.stats.cardsBanished += 1;
        actionBanishP += pAction;
      }
    } else if (hit.type === "destroy-arsenal") {
      state.stats.opponentArsenalDestroyed += prior.pArsenal;
    } else if (hit.type === "mark") {
      if (!state.marked) {
        state.marked = true;
        state.stats.marksApplied += 1;
      }
    } else if (hit.type === "tax") {
      state.pendingTax += hit.amount;
      state.stats.defenseTax += hit.amount;
    } else if (hit.type === "life-per-action-banished") {
      state.stats.lifeGained += actionBanishP;
    }
  }
  if (link.weaponTax) {
    state.pendingTax += link.weaponTax;
    state.stats.defenseTax += link.weaponTax;
  }
  if (link.weaponMark && !state.marked) {
    state.marked = true;
    state.stats.marksApplied += 1;
    state.weaponDestroyed = true;
    state.weaponReady = false;
  } else if (link.weaponMark) {
    state.weaponDestroyed = true;
    state.weaponReady = false;
  }
}

function unresolved(state: State): Link | null {
  const link = state.chain[state.chain.length - 1];
  if (!link || link.resolved) return null;
  return link;
}

function chainOpen(state: State): boolean {
  return state.chain.length > 0;
}

function isAttackAction(def: CardDef): boolean {
  return def.kind === "attack";
}

function zoneKey(s: State): string {
  const ids = (list: Inst[]) =>
    list
      .map((i) => i.iid)
      .sort((a, b) => a - b)
      .join(",");
  const chain = s.chain
    .map(
      (l) =>
        `${l.inst?.iid ?? "w"}:${l.resolved ? 1 : 0}:${l.power}:${l.piercing}:${l.goAgain ? 1 : 0}:${l.onHitGoAgain ? 1 : 0}:${l.shred}:${l.weaponMark ? 1 : 0}:${l.contractOpen.toFixed(3)}:${l.onHit.length}`,
    )
    .join("/");
  return [
    ids(s.hand),
    s.arsenal?.iid ?? "-",
    ids(s.graveyard),
    ids(s.pitch),
    chain,
    s.weaponDestroyed ? 1 : 0,
    s.assassinGoAgain ? 1 : 0,
    s.blacktekUsed ? 1 : 0,
    s.maskUsed ? 1 : 0,
    s.flickUsed ? 1 : 0,
    s.arsenaled ? 1 : 0,
    s.phase,
  ].join("#");
}

function numeric(s: State): number[] {
  return [
    ...Object.values(s.stats),
    s.resources,
    s.ap,
    s.silver,
    s.ponder,
    s.marked ? 1 : 0,
    s.weaponReady ? 1 : 0,
    s.pendingTax,
  ];
}

function dominates(a: State, b: State): boolean {
  if (zoneKey(a) !== zoneKey(b)) return false;
  const na = numeric(a);
  const nb = numeric(b);
  let better = false;
  for (let i = 0; i < na.length; i++) {
    if (na[i] < nb[i] - 1e-6) return false;
    if (na[i] > nb[i] + 1e-6) better = true;
  }
  return better;
}

function memoKey(s: State): string {
  const nums = numeric(s)
    .map((n) => (Math.round(n * 1000) / 1000).toFixed(3))
    .join(",");
  return `${zoneKey(s)}|${s.resources}|${s.ap}|${nums}`;
}

function diffText(before: Outcome, after: Outcome): string {
  const bits: string[] = [];
  const pairs: [keyof Outcome, string][] = [
    ["damage", "damage"],
    ["contractsCompleted", "contracts"],
    ["cardsBanished", "banished"],
    ["silverCreated", "silver"],
    ["marksApplied", "marks"],
    ["lifeGained", "life"],
    ["deckPeeks", "peeks"],
    ["frailtyApplied", "frailty"],
    ["ponderCreated", "ponder"],
    ["opponentArsenalDestroyed", "opp arsenal removed"],
    ["cardsDrawn", "draws"],
    ["prevention", "prevent"],
    ["damageTaken", "taken"],
  ];
  for (const [key, label] of pairs) {
    const d = after[key] - before[key];
    if (d > 0.01) bits.push(`${fmt(d)} ${label}`);
  }
  return bits.join(", ") || "no tracked change";
}

function finish(state: State): { outcome: Outcome; usage: Record<number, Usage> } {
  const s = clone(state);
  for (const link of s.chain) {
    if (link.inst) s.graveyard.push(link.inst);
  }
  s.chain = [];
  for (const inst of s.hand) if (!s.usage[inst.iid]) s.usage[inst.iid] = "retained";
  if (s.arsenal && !s.usage[s.arsenal.iid]) s.usage[s.arsenal.iid] = "arsenaled";
  const outcome: Outcome = {
    ...s.stats,
    cardsInHand: s.hand.length,
    cardsInArsenal: s.arsenal ? 1 : 0,
    resourcesUnused: s.resources,
    cardsDrawn: s.stats.cardsDrawn + s.ponder,
  };
  return { outcome, usage: s.usage };
}

function toMix(usage: Record<number, Usage>): Record<number, UsageMix> {
  const mix: Record<number, UsageMix> = {};
  for (const [iid, u] of Object.entries(usage)) {
    const row = zeroMix();
    row[u] = 1;
    mix[Number(iid)] = row;
  }
  return mix;
}

function mixUsage(
  a: Record<number, UsageMix>,
  b: Record<number, UsageMix>,
  p: number,
): Record<number, UsageMix> {
  const ids = new Set<number>([...Object.keys(a), ...Object.keys(b)].map(Number));
  const out: Record<number, UsageMix> = {};
  for (const iid of ids) {
    const row = zeroMix();
    for (const key of USAGES) {
      row[key] = (a[iid]?.[key] ?? 0) * p + (b[iid]?.[key] ?? 0) * (1 - p);
    }
    out[iid] = row;
  }
  return out;
}

function prepend(step: string, line: Line): Line {
  return { steps: [step, ...line.steps], split: line.split };
}

function terminal(state: State, weights: SearchConfig["weights"]): Val {
  const done = finish(state);
  return {
    score: scoreOutcome(done.outcome, weights),
    outcome: done.outcome,
    line: { steps: ["End turn."] },
    usage: toMix(done.usage),
  };
}

type Sure = { kind: "sure"; state: State; label: string };
type Split = { kind: "split"; p: number; success: State; fail: State; label: string; reason: string };
type Applied = Sure | Split;

function declareAttack(state: State, inst: Inst, pitches: Inst[], prior: Prior): State {
  const next = clone(state);
  const def = card(inst);
  pay(next, pitches, def.cost);
  take(next, inst);
  next.ap -= 1;
  next.usage[inst.iid] = "played";
  const link: Link = {
    inst,
    cardId: def.id,
    power: def.power,
    piercing: def.piercing ?? 0,
    contract: def.contract ?? null,
    contractOpen: def.contract ? 1 : 0,
    goAgain: !!def.goAgain || next.assassinGoAgain,
    onHitGoAgain: false,
    onHit: def.onHit ? def.onHit.slice() : [],
    resolved: false,
    shred: 0,
    source: "card",
    weaponMark: false,
    weaponTax: 0,
  };
  next.chain.push(link);
  if (def.contract) {
    next.stats.heroAbility += 1;
    next.stats.deckPeeks += 1;
  }
  void prior;
  return next;
}

function resolveLink(state: State, prior: Prior): State {
  const next = clone(state);
  const link = next.chain[next.chain.length - 1];
  const block = prior.blockPerAttack;
  const tax = block > 0 ? next.pendingTax : 0;
  if (tax) next.pendingTax = 0;
  const damage = strike(link.power, link.piercing, block, link.shred + tax);
  next.stats.damage += damage;
  if (link.onHitGoAgain || next.assassinGoAgain) link.goAgain = true;
  applyOnHits(next, link, damage, prior);
  if (link.goAgain) next.ap += 1;
  link.resolved = true;
  return next;
}

function applyCodex(state: State, inst: Inst, pitches: Inst[], arsenalIid: number | null, discardIid: number | null): State {
  const next = clone(state);
  pay(next, pitches, 0);
  take(next, inst);
  next.ap -= 1;
  next.usage[inst.iid] = "played";
  next.graveyard.push(inst);
  if (arsenalIid != null && !next.arsenal) {
    const fromGy = next.graveyard.find((g) => g.iid === arsenalIid);
    if (fromGy) {
      next.graveyard = removeFrom(next.graveyard, arsenalIid);
      next.arsenal = fromGy;
      next.usage[arsenalIid] = "arsenaled";
      if (discardIid != null) {
        const discarded = next.hand.find((h) => h.iid === discardIid);
        if (discarded) {
          take(next, discarded);
          next.graveyard.push(discarded);
          next.usage[discarded.iid] = "discarded";
          const dumped = card(discarded);
          if (dumped.graveLife) next.stats.lifeGained += dumped.graveLife;
        }
      }
    }
  }
  next.ponder += 1;
  next.stats.ponderCreated += 1;
  next.stats.frailtyApplied += 1;
  next.ap += 1;
  return next;
}

function legal(state: State, ctx: Ctx): Applied[] {
  const prior = ctx.config.prior;
  const out: Applied[] = [];
  if (state.phase !== "action") return out;
  const open = unresolved(state);

  if (open) {
    const link = open;
    const attackers = state.hand.filter((inst) => {
      const def = card(inst);
      return def.kind === "attack-reaction";
    });
    const arsenalRx = state.arsenal && card(state.arsenal).kind === "attack-reaction" ? [state.arsenal] : [];
    for (const inst of [...attackers, ...arsenalRx]) {
      const def = card(inst);
      const pool = state.hand.filter((h) => h.iid !== inst.iid);
      for (const pitches of minimalPitches(pool, Math.max(0, def.cost - state.resources))) {
        if (def.reaction === "cut") {
          if (!link.contract || link.source !== "card") continue;
          const next = clone(state);
          pay(next, pitches, def.cost);
          take(next, inst);
          next.graveyard.push(inst);
          next.usage[inst.iid] = "played";
          const live = next.chain[next.chain.length - 1];
          live.power += def.reactionAmount ?? 0;
          next.stats.deckPeeks += 1;
          out.push({
            kind: "sure",
            state: next,
            label: `React — ${def.name}. Contract attack gets +${def.reactionAmount}. Peek 1.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
          });
        } else if (def.reaction === "shred") {
          const next = clone(state);
          pay(next, pitches, def.cost);
          take(next, inst);
          next.graveyard.push(inst);
          next.usage[inst.iid] = "played";
          next.chain[next.chain.length - 1].shred += def.reactionAmount ?? 0;
          out.push({
            kind: "sure",
            state: next,
            label: `React — ${def.name}. Defending card gets -${def.reactionAmount} defense.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
          });
        } else if (def.reaction === "coercive") {
          const next = clone(state);
          pay(next, pitches, def.cost);
          take(next, inst);
          next.graveyard.push(inst);
          next.usage[inst.iid] = "played";
          next.stats.deckPeeks += 3;
          next.stats.cardsBanished += 1;
          const live = next.chain[next.chain.length - 1];
          const base = live.contract ? condBase(live.contract, prior) : 0;
          const pEvent = live.contract ? 1 - (1 - base) ** 3 : 0;
          const p = connectP(pEvent, prior);
          const pitchNote = pitches.length ? ` Pitch ${names(pitches)}.` : "";
          if (p >= 1 - 1e-9) {
            mintContract(next, live, 1);
            next.assassinGoAgain = true;
            out.push({
              kind: "sure",
              state: next,
              label: `React — Coercive Tendency. Banish the best of the top 3. Contract completes. Assassin attacks gain go again.${pitchNote}`,
            });
          } else if (p <= 1e-9) {
            out.push({
              kind: "sure",
              state: next,
              label: `React — Coercive Tendency. Banish the top of 3. Contract does not complete.${pitchNote}`,
            });
          } else {
            const success = clone(next);
            const ok = success.chain[success.chain.length - 1];
            mintContract(success, ok, 1);
            success.assassinGoAgain = true;
            out.push({
              kind: "split",
              p,
              success,
              fail: next,
              label: `React — Coercive Tendency. Look at the top 3, banish the best match.${pitchNote}`,
              reason: `Contract completion from that banish is ${fmt(p * 100)}% under the prior. Go again is granted only on that branch.`,
            });
          }
        }
      }
    }

    if (ctx.config.equipment.blacktek && !state.blacktekUsed && link.source === "card") {
      const next = clone(state);
      next.blacktekUsed = true;
      next.chain[next.chain.length - 1].onHitGoAgain = true;
      out.push({
        kind: "sure",
        state: next,
        label: "Equipment — destroy Blacktek Whisperers. This attack gets go again when it hits.",
      });
    }
    if (ctx.config.equipment.mask && !state.maskUsed && link.source === "card") {
      const next = clone(state);
      next.maskUsed = true;
      next.chain[next.chain.length - 1].onHit.push({ type: "banish-top" });
      out.push({
        kind: "sure",
        state: next,
        label: "Equipment — destroy Mask of Perdition. This attack banishes an extra card when it hits.",
      });
    }
    if (
      ctx.config.equipment.flick &&
      !state.flickUsed &&
      !state.weaponDestroyed &&
      ctx.weapon.id !== "none" &&
      link.source === "card"
    ) {
      const next = clone(state);
      next.flickUsed = true;
      next.stats.damage += 1;
      next.weaponDestroyed = true;
      next.weaponReady = false;
      if (ctx.weapon.markOnHit && !next.marked) {
        next.marked = true;
        next.stats.marksApplied += 1;
      }
      if (ctx.weapon.tax) {
        next.pendingTax += ctx.weapon.tax;
        next.stats.defenseTax += ctx.weapon.tax;
      }
      out.push({
        kind: "sure",
        state: next,
        label: `Equipment — Flick Knives. ${ctx.weapon.name} deals 1 and is destroyed${ctx.weapon.markOnHit ? ", marking" : ""}.`,
      });
    }

    const resolved = resolveLink(state, prior);
    out.push({
      kind: "sure",
      state: resolved,
      label: `Resolve ${link.source === "weapon" ? ctx.weapon.name : cardById(link.cardId).name} — ${diffText(state.stats, resolved.stats)}.${resolved.ap > state.ap ? " Go again." : ""}`,
    });
    return out;
  }

  const playable = [
    ...state.hand,
    ...(state.arsenal ? [state.arsenal] : []),
  ];
  for (const inst of playable) {
    const def = card(inst);
    const pool = state.hand.filter((h) => h.iid !== inst.iid);
    const pitchesList = minimalPitches(pool, Math.max(0, def.cost - state.resources));
    if (def.kind === "attack") {
      if (state.ap < 1) continue;
      for (const pitches of pitchesList) {
        const next = declareAttack(state, inst, pitches, prior);
        const from = state.arsenal?.iid === inst.iid ? " from arsenal" : "";
        out.push({
          kind: "sure",
          state: next,
          label: `Play ${def.name}${from} for ${def.power}.${def.contract ? " Hero ability peeks." : ""}${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
        });
      }
    } else if (def.kind === "action" && def.action === "codex-frailty") {
      if (state.ap < 1 || chainOpen(state)) continue;
      for (const pitches of pitchesList) {
        const preview = clone(state);
        pay(preview, pitches, 0);
        take(preview, inst);
        const attacks = preview.graveyard.filter((g) => isAttackAction(card(g)));
        if (preview.arsenal || attacks.length === 0) {
          const next = applyCodex(state, inst, pitches, null, null);
          out.push({
            kind: "sure",
            state: next,
            label: `Play Codex of Frailty. Ponder, Frailty, go again.${attacks.length === 0 ? " No attack in graveyard to arsenal." : " Arsenal occupied."}${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
          });
        } else {
          const discards = preview.hand.length ? preview.hand : [null];
          for (const atk of attacks) {
            for (const dump of discards) {
              const next = applyCodex(state, inst, pitches, atk.iid, dump?.iid ?? null);
              out.push({
                kind: "sure",
                state: next,
                label: `Play Codex of Frailty. Arsenal ${card(atk).name}${dump ? `, discard ${card(dump).name}` : ""}. Ponder, Frailty, go again.`,
              });
            }
          }
        }
      }
    } else if (def.kind === "instant" && def.life) {
      for (const pitches of pitchesList) {
        const next = clone(state);
        pay(next, pitches, def.cost);
        take(next, inst);
        next.graveyard.push(inst);
        next.usage[inst.iid] = "played";
        next.stats.lifeGained += def.life;
        out.push({
          kind: "sure",
          state: next,
          label: `Play ${def.name}. Gain ${def.life} life.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
        });
      }
    }
  }

  if (!chainOpen(state) && state.ap >= 1 && !state.arsenaled && state.hand.length && !state.arsenal) {
    for (const inst of state.hand) {
      const next = clone(state);
      take(next, inst);
      next.arsenal = inst;
      next.ap -= 1;
      next.arsenaled = true;
      next.usage[inst.iid] = "arsenaled";
      out.push({ kind: "sure", state: next, label: `Arsenal ${card(inst).name}.` });
    }
  }

  if (chainOpen(state)) {
    const next = clone(state);
    for (const link of next.chain) if (link.inst) next.graveyard.push(link.inst);
    next.chain = [];
    next.assassinGoAgain = false;
    out.push({ kind: "sure", state: next, label: "Close the combat chain." });
  }

  if (
    state.weaponReady &&
    !state.weaponDestroyed &&
    ctx.weapon.id !== "none" &&
    state.ap >= 1
  ) {
    const pool = state.hand.slice();
    const options = minimalPitches(pool, Math.max(0, ctx.weapon.cost - state.resources));
    for (const pitches of options) {
      const choices = ctx.weapon.markOnHit && !state.marked ? [false, true] : [false];
      for (const doMark of choices) {
        const next = clone(state);
        pay(next, pitches, ctx.weapon.cost);
        next.ap -= 1;
        next.weaponReady = false;
        const power = ctx.weapon.power + (next.marked ? ctx.weapon.powerIfMarked : 0);
        next.chain.push({
          inst: null,
          cardId: ctx.weapon.id,
          power,
          piercing: ctx.weapon.piercing,
          contract: null,
          contractOpen: 0,
          goAgain: ctx.weapon.goAgain || next.assassinGoAgain,
          onHitGoAgain: false,
          onHit: [],
          resolved: false,
          shred: 0,
          source: "weapon",
          weaponMark: doMark,
          weaponTax: ctx.weapon.tax,
        });
        out.push({
          kind: "sure",
          state: next,
          label: `Attack with ${ctx.weapon.name} for ${power}${doMark ? ", and mark on hit" : ""}.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
        });
      }
    }
  }

  if (!chainOpen(state) && state.silver >= 1 && state.ap >= 1) {
    const options = minimalPitches(state.hand, Math.max(0, 3 - state.resources));
    for (const pitches of options) {
      const next = clone(state);
      pay(next, pitches, 3);
      next.ap -= 1;
      next.silver -= 1;
      next.stats.cardsDrawn += 1;
      next.ap += 1;
      out.push({
        kind: "sure",
        state: next,
        label: `Cash a Silver for a draw. Go again.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`,
      });
    }
  }

  return out;
}

function defensePlans(state: State, ctx: Ctx): Applied[] {
  const prior = ctx.config.prior;
  const incoming = ctx.config.incoming;
  const hand = state.hand.slice();
  const passive = hand.filter((inst) => card(inst).kind !== "defense-reaction" && card(inst).defense > 0);
  const drs = hand.filter((inst) => card(inst).kind === "defense-reaction");
  const plans: Applied[] = [];
  const passiveSubs = subsets(passive);

  const consider = (
    blockers: Inst[],
    dr: Inst | null,
    shelterMode: boolean,
    pitches: Inst[],
    cycle: Inst | null,
  ) => {
    const next = clone(state);
    pay(next, pitches, dr && !shelterMode ? card(dr).cost : 0);
    let defense = 0;
    for (const inst of blockers) {
      if (pitches.some((p) => p.iid === inst.iid)) continue;
      const def = card(inst);
      take(next, inst);
      next.graveyard.push(inst);
      next.usage[inst.iid] = "blocked";
      defense += def.defense;
      if (def.graveLife) next.stats.lifeGained += def.graveLife;
    }
    let prevention = 0;
    if (dr) {
      const def = card(dr);
      take(next, dr);
      next.graveyard.push(dr);
      next.usage[dr.iid] = shelterMode ? "discarded" : "played";
      if (!shelterMode) defense += def.defense;
      if (def.defenseEffect === "opt") next.stats.deckPeeks += 1;
      if (def.defenseEffect === "shelter" && shelterMode) {
        prevention += def.prevent ?? 0;
        next.stats.prevention += def.prevent ?? 0;
      }
      if (def.defenseEffect === "named") {
        const p = connectP(prior.pNamed, prior);
        next.stats.cardsBanished += p * 3;
        next.stats.contractsCompleted += p;
        next.stats.silverCreated += p;
        if (p >= 1 - 1e-9) next.silver += 1;
        next.stats.heroAbility += 1;
        next.stats.deckPeeks += 1;
      }
      if (def.graveLife) next.stats.lifeGained += def.graveLife;
    }
    if (cycle) {
      take(next, cycle);
      next.usage[cycle.iid] = "discarded";
      next.stats.cardsDrawn += 1;
    }
    const taken = Math.max(0, incoming - defense - prevention);
    next.stats.damageTaken += taken;
    next.phase = ctx.config.phaseMode === "defense" ? "over" : "action";
    const bits = [
      blockers.length ? `block with ${names(blockers)} (${defense} defense)` : "no block",
      dr ? (shelterMode ? `discard ${card(dr).name} to prevent ${prevention}` : `play ${card(dr).name}`) : "",
      cycle ? `bottom ${card(cycle).name} and draw` : "",
      pitches.length ? `pitch ${names(pitches)}` : "",
    ].filter(Boolean);
    plans.push({
      kind: "sure",
      state: next,
      label: `Defense — ${bits.join("; ")}. Take ${fmt(taken)} of ${incoming}.`,
    });
  };

  for (const blockers of passiveSubs) {
    const blocked = new Set(blockers.map((b) => b.iid));
    const drChoices: { dr: Inst | null; shelter: boolean }[] = [{ dr: null, shelter: false }];
    for (const dr of drs) {
      if (blocked.has(dr.iid)) continue;
      drChoices.push({ dr, shelter: false });
      if (card(dr).defenseEffect === "shelter") drChoices.push({ dr, shelter: true });
    }
    for (const choice of drChoices) {
      const busy = new Set(blocked);
      if (choice.dr) busy.add(choice.dr.iid);
      const pool = hand.filter((h) => !busy.has(h.iid));
      const cost = choice.dr && !choice.shelter ? card(choice.dr).cost : 0;
      for (const pitches of minimalPitches(pool, Math.max(0, cost - state.resources))) {
        const pitched = new Set(pitches.map((p) => p.iid));
        consider(blockers, choice.dr, choice.shelter, pitches, null);
        const sinkBlocking = blockers.some((b) => card(b).defenseEffect === "sink");
        const sinkPlayed = choice.dr && card(choice.dr).defenseEffect === "sink" && !choice.shelter;
        if (sinkBlocking || sinkPlayed) {
          const cyclePool = pool.filter((h) => !pitched.has(h.iid));
          for (const cycle of cyclePool) {
            consider(blockers, choice.dr, choice.shelter, pitches, cycle);
          }
        }
      }
    }
  }
  if (!plans.length) {
    const next = clone(state);
    next.stats.damageTaken += incoming;
    next.phase = ctx.config.phaseMode === "defense" ? "over" : "action";
    plans.push({ kind: "sure", state: next, label: `Defense — take ${incoming}.` });
  }
  return plans;
}

function prune(applied: Applied[]): Applied[] {
  const sures = applied.filter((a): a is Sure => a.kind === "sure");
  const splits = applied.filter((a) => a.kind === "split");
  const keep: Sure[] = [];
  for (const item of sures) {
    if (sures.some((other) => other !== item && dominates(other.state, item.state))) continue;
    keep.push(item);
  }
  return [...splits, ...keep];
}

function search(state: State, ctx: Ctx, depth: number): Val {
  if (state.phase === "over") return terminal(state, ctx.config.weights);
  const key = memoKey(state);
  const cached = ctx.memo.get(key);
  if (cached) return cached;
  ctx.nodes += 1;
  if (ctx.nodes > ctx.budget || depth > 14) {
    ctx.partial = true;
    const done = terminal(state, ctx.config.weights);
    return done;
  }

  let best = state.phase === "action" && !unresolved(state) ? terminal(state, ctx.config.weights) : null;
  const applied = prune(state.phase === "defense" ? defensePlans(state, ctx) : legal(state, ctx));
  const ranked: Val[] = [];
  for (const item of applied) {
    let val: Val;
    if (item.kind === "split") {
      const success = search(item.success, ctx, depth + 1);
      const fail = search(item.fail, ctx, depth + 1);
      const outcome = mixOutcomes(success.outcome, fail.outcome, item.p);
      val = {
        score: scoreOutcome(outcome, ctx.config.weights),
        outcome,
        line: {
          steps: [item.label],
          split: {
            reason: item.reason,
            options: [
              { p: item.p, line: success.line },
              { p: 1 - item.p, line: fail.line },
            ],
          },
        },
        usage: mixUsage(success.usage, fail.usage, item.p),
      };
    } else {
      const child = search(item.state, ctx, depth + 1);
      val = {
        score: child.score,
        outcome: child.outcome,
        line: prepend(item.label, child.line),
        usage: child.usage,
      };
    }
    ranked.push(val);
    if (!best || val.score > best.score + 1e-6) best = val;
  }
  if (!best) best = terminal(state, ctx.config.weights);
  if (depth === 0) {
    ctx.rootAlts = ranked
      .filter((v) => v !== best)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((v) => ({ score: v.score, outcome: v.outcome, line: v.line }));
  }
  if (!ctx.partial) ctx.memo.set(key, best);
  return best;
}

export function solveHand(ids: string[], config: SearchConfig): SolveResult {
  const ctx: Ctx = {
    config,
    weapon: weaponById(config.weaponId),
    budget: config.nodeBudget,
    nodes: 0,
    partial: false,
    memo: new Map(),
    rootAlts: [],
  };
  const state: State = {
    hand: ids.map((id, iid) => ({ iid, cardId: id })),
    arsenal: null,
    graveyard: [],
    pitch: [],
    chain: [],
    resources: 0,
    ap: 1,
    weaponReady: config.weaponId !== "none",
    weaponDestroyed: false,
    marked: config.marked,
    silver: 0,
    ponder: 0,
    assassinGoAgain: false,
    blacktekUsed: !config.equipment.blacktek,
    maskUsed: !config.equipment.mask,
    flickUsed: !config.equipment.flick,
    arsenaled: false,
    pendingTax: 0,
    phase: config.phaseMode !== "action" && config.incoming > 0 ? "defense" : "action",
    stats: emptyOutcome(),
    usage: {},
  };
  const best = search(state, ctx, 0);
  return {
    score: best.score,
    outcome: best.outcome,
    line: best.line,
    alts: ctx.rootAlts,
    usage: best.usage,
    partial: ctx.partial,
    nodes: ctx.nodes,
  };
}
