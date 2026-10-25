import { neutralWeights } from "./evaluate.ts";
import type { Prior, SearchConfig } from "./types.ts";

export function defaultPrior(): Prior {
  return {
    pRed: 0.5,
    pYellow: 0.2,
    pBlue: 0.3,
    pAttackAction: 0.55,
    pNonAttackAction: 0.2,
    pGoAgain: 0.3,
    pCostLe1: 0.7,
    pDefLe2: 0.4,
    pArsenal: 0.5,
    oppHand: 4,
    pNamed: 0.08,
    blockPerAttack: 0,
    connect: "prior",
  };
}

export function defaultConfig(): SearchConfig {
  return {
    weights: neutralWeights(),
    prior: defaultPrior(),
    weaponId: "mark-of-the-huntsman",
    equipment: { blacktek: false, mask: false, flick: false },
    marked: false,
    incoming: 0,
    phaseMode: "action",
    nodeBudget: 5000,
    exhaustCap: 700,
    sampleSize: 400,
    seed: 1,
    contributionHands: 24,
  };
}
