import assert from "node:assert/strict";
import { test } from "node:test";
import { neutralWeights, presetWeights } from "./evaluate.ts";
import { solveHand } from "./kernel.ts";
import type { Prior, SearchConfig } from "./types.ts";

function prior(over: Partial<Prior> = {}): Prior {
  return {
    pRed: 0.4,
    pYellow: 0.2,
    pBlue: 0.4,
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
    ...over,
  };
}

function config(over: Partial<SearchConfig> = {}): SearchConfig {
  return {
    weights: neutralWeights(),
    prior: prior(),
    weaponId: "none",
    equipment: { blacktek: false, mask: false, flick: false },
    marked: false,
    incoming: 0,
    phaseMode: "action",
    nodeBudget: 8000,
    exhaustCap: 800,
    sampleSize: 400,
    seed: 1,
    contributionHands: 20,
    ...over,
  };
}

function lineText(steps: string[], split?: { options: { line: { steps: string[] } }[] }): string {
  return `${steps.join(" | ")} ${split?.options.map((o) => o.line.steps.join(" | ")).join(" || ") ?? ""}`;
}

test("Leave No Witnesses deals 4 and expects a partial contract on an open board", () => {
  const result = solveHand(["lnw-r", "sigil-b", "sigil-b", "fate-b"], config());
  assert.ok(result.outcome.damage >= 4);
  assert.ok(result.outcome.contractsCompleted > 0.4 && result.outcome.contractsCompleted < 0.7);
  assert.equal(result.partial, false);
});

test("a cost 2 attack is not played when the other card cannot pay", () => {
  const result = solveHand(["cnc-r", "fate-r"], config());
  assert.ok(result.outcome.damage < 1);
  const text = lineText(result.line.steps, result.line.split);
  assert.equal(text.includes("Command and Conquer"), false);
});

test("Codex before the attack is legal; Codex after a no-go-again attack is not both", () => {
  const weights = neutralWeights();
  weights.frailtyApplied = 5;
  weights.ponderCreated = 5;
  weights.cardsInArsenal = 2;
  const result = solveHand(["lnw-r", "codex-y", "sigil-b", "fate-b"], config({ weights, weaponId: "none" }));
  const text = lineText(result.line.steps, result.line.split);
  assert.match(text, /Codex of Frailty/);
  assert.match(text, /Leave No Witnesses/);
  assert.ok(result.outcome.damage >= 4);
  assert.ok(result.outcome.frailtyApplied >= 1);
  assert.ok(result.outcome.ponderCreated >= 1);
});

test("high-roll Coercive gives Leave No Witnesses go again so Codex can arsenal it", () => {
  const weights = neutralWeights();
  weights.cardsInArsenal = 30;
  weights.frailtyApplied = 4;
  weights.lifeGained = 0;
  weights.cardsInHand = 0.2;
  weights.damage = 1;
  const result = solveHand(
    ["lnw-r", "coercive-b", "codex-y", "sigil-b"],
    config({
      weights,
      prior: prior({ connect: "always", pRed: 0.4, pArsenal: 0.5 }),
    }),
  );
  const text = lineText(result.line.steps, result.line.split);
  assert.match(text, /Coercive/);
  assert.match(text, /Codex of Frailty/);
  assert.match(text, /Arsenal Leave No Witnesses/);
  assert.ok(result.outcome.cardsInArsenal >= 0.99);
  assert.equal(result.partial, false);
});

test("Shred is not required to deal Command and Conquer's 6 into an open board", () => {
  const weights = presetWeights("aggressive");
  const result = solveHand(["cnc-r", "shred-y", "sigil-b", "fate-b"], config({ weights, weaponId: "none" }));
  assert.ok(result.outcome.damage >= 6);
});

test("Mark of the Huntsman swings when a blue can pay and the attack still resolves", () => {
  const result = solveHand(
    ["lnw-r", "sigil-b", "fate-b", "cut-b"],
    config({ weaponId: "mark-of-the-huntsman", weights: presetWeights("aggressive") }),
  );
  assert.ok(result.outcome.damage >= 5);
  const text = lineText(result.line.steps, result.line.split);
  assert.match(text, /Mark of the Huntsman/);
});
