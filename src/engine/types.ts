export type Color = "red" | "yellow" | "blue";

export type ContractKind =
  | { kind: "color"; color: Color }
  | { kind: "attack-action" }
  | { kind: "non-attack-action" }
  | { kind: "non-action" }
  | { kind: "cost-le" }
  | { kind: "def-le" }
  | { kind: "go-again" };

export type OnHit =
  | { type: "banish-top"; n?: number }
  | { type: "banish-top-damage" }
  | { type: "banish-top-repeat-color"; color: Color }
  | { type: "banish-arsenal" }
  | { type: "banish-hand" }
  | { type: "banish-hand-same-color" }
  | { type: "destroy-arsenal" }
  | { type: "mark" }
  | { type: "tax"; amount: number }
  | { type: "life-per-action-banished" }
  | { type: "banish-hand-if-marked" };

export type CardKind =
  | "attack"
  | "action"
  | "instant"
  | "attack-reaction"
  | "defense-reaction"
  | "block";

export type CardDef = {
  id: string;
  name: string;
  color: Color | "none";
  pitch: number;
  cost: number;
  power: number;
  defense: number;
  kind: CardKind;
  contract?: ContractKind;
  stealth?: boolean;
  goAgain?: boolean;
  piercing?: number;
  onHit?: OnHit[];
  /** Non-attack action payload. */
  action?: "codex-frailty";
  /** Instant payload. */
  life?: number;
  /** Attack reaction payload. */
  reaction?: "cut" | "coercive" | "shred";
  reactionAmount?: number;
  /** Defense reaction payload. */
  defenseEffect?: "opt" | "sink" | "shelter" | "named";
  prevent?: number;
  /** Life gained when the card hits the graveyard (Fiddler's). */
  graveLife?: number;
  text: string;
  tags: string[];
};

export type WeaponDef = {
  id: string;
  name: string;
  power: number;
  cost: number;
  piercing: number;
  goAgain: boolean;
  /** Extra power if the hero is already marked when the attack is declared. */
  powerIfMarked: number;
  /** On hit, may destroy the dagger to mark. */
  markOnHit: boolean;
  /** On hit, apply a defense tax for later opposing blocks. */
  tax: number;
  text: string;
};

export type Outcome = {
  damage: number;
  damageTaken: number;
  contractsCompleted: number;
  silverCreated: number;
  cardsBanished: number;
  marksApplied: number;
  deckPeeks: number;
  heroAbility: number;
  lifeGained: number;
  cardsDrawn: number;
  cardsInHand: number;
  cardsInArsenal: number;
  resourcesGenerated: number;
  resourcesSpent: number;
  resourcesUnused: number;
  frailtyApplied: number;
  ponderCreated: number;
  opponentArsenalDestroyed: number;
  prevention: number;
  defenseTax: number;
};

export const OUTCOME_KEYS: (keyof Outcome)[] = [
  "damage",
  "damageTaken",
  "contractsCompleted",
  "silverCreated",
  "cardsBanished",
  "marksApplied",
  "deckPeeks",
  "heroAbility",
  "lifeGained",
  "cardsDrawn",
  "cardsInHand",
  "cardsInArsenal",
  "resourcesGenerated",
  "resourcesSpent",
  "resourcesUnused",
  "frailtyApplied",
  "ponderCreated",
  "opponentArsenalDestroyed",
  "prevention",
  "defenseTax",
];

export type Weights = Record<keyof Outcome, number>;

export type Prior = {
  pRed: number;
  pYellow: number;
  pBlue: number;
  pAttackAction: number;
  pNonAttackAction: number;
  pGoAgain: number;
  pCostLe1: number;
  pDefLe2: number;
  pArsenal: number;
  oppHand: number;
  /** Chance the named card is on top, for Hunter or Hunted. */
  pNamed: number;
  /** Defense in front of each of our attacks. 0 is an open board. */
  blockPerAttack: number;
  /** How contract matches are resolved. */
  connect: "prior" | "always" | "never";
};

export type PhaseMode = "action" | "defense" | "cycle";

export type EquipmentFlags = {
  blacktek: boolean;
  mask: boolean;
  flick: boolean;
};

export type SearchConfig = {
  weights: Weights;
  prior: Prior;
  weaponId: string;
  equipment: EquipmentFlags;
  marked: boolean;
  incoming: number;
  phaseMode: PhaseMode;
  /** Talishar format id, once the local engine is the rules source. */
  format?: string;
  /** Talishar hero card id. */
  heroId?: string;
  nodeBudget: number;
  /** When combination count exceeds this, sample. */
  exhaustCap: number;
  sampleSize: number;
  seed: number;
  contributionHands: number;
};

export type Usage = "played" | "pitched" | "blocked" | "arsenaled" | "retained" | "discarded";

export type UsageMix = Record<Usage, number>;

export type Line = {
  steps: string[];
  split?: { reason: string; options: { p: number; line: Line }[] };
};

export type SolveResult = {
  score: number;
  outcome: Outcome;
  line: Line;
  alts: { score: number; outcome: Outcome; line: Line }[];
  /** Probability each instance ended in each usage. Keyed by iid. */
  usage: Record<number, UsageMix>;
  partial: boolean;
  nodes: number;
};

export type HandReport = {
  ids: string[];
  iids: number[];
  score: number;
  outcome: Outcome;
  line: Line;
  alts: { score: number; outcome: Outcome; line: Line }[];
  /** Usage of each card id in the best line. Duplicate ids get separate entries. */
  uses: { id: string; usage: Usage }[];
  partial: boolean;
  contribution?: { id: string; delta: Outcome; score: number }[];
};

export type DiscoverMeta = {
  handsSearched: number;
  handsPossible: number;
  exhaustive: boolean;
  ms: number;
  partialHands: number;
  nodes: number;
  weaponId: string;
  connect: Prior["connect"];
};

export type DiscoverResult = {
  hands: HandReport[];
  meta: DiscoverMeta;
};
