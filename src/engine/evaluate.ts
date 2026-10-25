import { OUTCOME_KEYS, type Outcome, type Weights } from "./types.ts";

export const OUTCOME_LABELS: Record<keyof Outcome, string> = {
  damage: "Damage dealt",
  damageTaken: "Damage taken",
  contractsCompleted: "Contracts completed",
  silverCreated: "Silver created",
  cardsBanished: "Cards banished",
  marksApplied: "Marks applied",
  deckPeeks: "Deck peeks",
  heroAbility: "Hero ability",
  lifeGained: "Life gained",
  cardsDrawn: "Cards drawn",
  cardsInHand: "Cards left in hand",
  cardsInArsenal: "Cards in arsenal",
  resourcesGenerated: "Resources generated",
  resourcesSpent: "Resources spent",
  resourcesUnused: "Resources unused",
  frailtyApplied: "Frailty applied",
  ponderCreated: "Ponder created",
  opponentArsenalDestroyed: "Opp. arsenal destroyed",
  prevention: "Damage prevented",
  defenseTax: "Defense tax applied",
};

export function emptyOutcome(): Outcome {
  return {
    damage: 0,
    damageTaken: 0,
    contractsCompleted: 0,
    silverCreated: 0,
    cardsBanished: 0,
    marksApplied: 0,
    deckPeeks: 0,
    heroAbility: 0,
    lifeGained: 0,
    cardsDrawn: 0,
    cardsInHand: 0,
    cardsInArsenal: 0,
    resourcesGenerated: 0,
    resourcesSpent: 0,
    resourcesUnused: 0,
    frailtyApplied: 0,
    ponderCreated: 0,
    opponentArsenalDestroyed: 0,
    prevention: 0,
    defenseTax: 0,
  };
}

export function scoreOutcome(outcome: Outcome, weights: Weights): number {
  let total = 0;
  for (const key of OUTCOME_KEYS) total += (weights[key] ?? 0) * outcome[key];
  return total;
}

export function mixOutcomes(a: Outcome, b: Outcome, p: number): Outcome {
  const out = emptyOutcome();
  for (const key of OUTCOME_KEYS) out[key] = a[key] * p + b[key] * (1 - p);
  return out;
}

export function subtractOutcome(a: Outcome, b: Outcome): Outcome {
  const out = emptyOutcome();
  for (const key of OUTCOME_KEYS) out[key] = a[key] - b[key];
  return out;
}

export function neutralWeights(): Weights {
  const w = emptyOutcome() as Weights;
  for (const key of OUTCOME_KEYS) w[key] = 1;
  w.damageTaken = -1;
  w.resourcesGenerated = 0;
  w.resourcesSpent = 0;
  w.resourcesUnused = 0;
  return w;
}

export function presetWeights(name: string): Weights {
  const w = neutralWeights();
  if (name === "aggressive") {
    w.damage = 3;
    w.marksApplied = 2;
    w.contractsCompleted = 1;
    w.cardsBanished = 0.4;
    w.lifeGained = 0.2;
    w.cardsInHand = 0.3;
    w.cardsInArsenal = 0.4;
    w.deckPeeks = 0.2;
    w.heroAbility = 0.2;
    w.damageTaken = -0.5;
    w.prevention = 0.3;
    w.silverCreated = 0.4;
    w.frailtyApplied = 0.4;
    w.ponderCreated = 0.3;
    w.cardsDrawn = 0.4;
  } else if (name === "midrange") {
    w.damage = 1.6;
    w.contractsCompleted = 1.6;
    w.cardsBanished = 1.2;
    w.cardsInHand = 1;
    w.cardsInArsenal = 1.3;
    w.marksApplied = 1.2;
    w.lifeGained = 0.8;
    w.silverCreated = 0.8;
    w.frailtyApplied = 1;
    w.deckPeeks = 0.6;
  } else if (name === "control") {
    w.damage = 0.6;
    w.cardsBanished = 2;
    w.deckPeeks = 1.6;
    w.heroAbility = 1.4;
    w.contractsCompleted = 1.6;
    w.frailtyApplied = 1.6;
    w.opponentArsenalDestroyed = 1.8;
    w.cardsInHand = 1.2;
    w.cardsInArsenal = 1.2;
    w.marksApplied = 1;
    w.lifeGained = 1;
    w.prevention = 1.2;
    w.damageTaken = -1.4;
  } else if (name === "fatigue") {
    w.damage = 0.3;
    w.cardsBanished = 2.4;
    w.deckPeeks = 2;
    w.heroAbility = 1.6;
    w.opponentArsenalDestroyed = 2;
    w.cardsInHand = 1.6;
    w.cardsInArsenal = 1.4;
    w.contractsCompleted = 1.2;
    w.lifeGained = 1.2;
    w.prevention = 1.4;
    w.damageTaken = -1.6;
    w.ponderCreated = 1.2;
    w.cardsDrawn = 1;
  }
  return w;
}

export const PRESETS: { id: string; label: string; note: string }[] = [
  { id: "neutral", label: "Neutral", note: "Each raw count weighs 1. Damage taken weighs −1. Resource totals weigh 0 so they are recorded, not scored." },
  { id: "aggressive", label: "Aggressive", note: "A hypothesis that favors damage and marks over disruption." },
  { id: "midrange", label: "Midrange", note: "A hypothesis that balances damage, contracts, and cards kept." },
  { id: "control", label: "Control", note: "A hypothesis that favors banishes, peeks, and frailty over raw damage." },
  { id: "fatigue", label: "Fatigue", note: "A hypothesis that favors deck stripping and a full hand over racing." },
];
