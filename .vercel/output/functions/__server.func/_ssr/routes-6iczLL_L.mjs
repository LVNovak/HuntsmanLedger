import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-6iczLL_L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEAPONS = [
	{
		id: "mark-of-the-huntsman",
		name: "Mark of the Huntsman",
		power: 1,
		cost: 2,
		piercing: 1,
		goAgain: true,
		powerIfMarked: 1,
		markOnHit: true,
		tax: 0,
		text: "Once per Turn Action — 2: Attack. Go again. When this hits a hero, you may destroy this and mark them. If this is attacking a marked hero, it gets +1."
	},
	{
		id: "nerve-scalpel",
		name: "Nerve Scalpel",
		power: 1,
		cost: 2,
		piercing: 1,
		goAgain: true,
		powerIfMarked: 0,
		markOnHit: false,
		tax: 1,
		text: "Once per Turn Action — 2: Attack. Go again. Piercing 1. When this hits a hero, the next time they defend with a reaction this turn, those cards get -1 defense."
	},
	{
		id: "spiders-bite",
		name: "Spider's Bite",
		power: 1,
		cost: 2,
		piercing: 1,
		goAgain: true,
		powerIfMarked: 0,
		markOnHit: false,
		tax: 1,
		text: "Once per Turn Action — 2: Attack. Go again. When this hits, the next time they defend with an attack action this turn, those cards get -1 defense. Piercing 1."
	},
	{
		id: "orbitoclast",
		name: "Orbitoclast",
		power: 1,
		cost: 2,
		piercing: 1,
		goAgain: true,
		powerIfMarked: 0,
		markOnHit: false,
		tax: 1,
		text: "Once per Turn Action — 2: Attack. Go again. Piercing 1. When this hits, the next time they defend with a non-attack action, those cards get -1 defense."
	},
	{
		id: "graven-call",
		name: "Graven Call",
		power: 1,
		cost: 2,
		piercing: 1,
		goAgain: true,
		powerIfMarked: 0,
		markOnHit: false,
		tax: 0,
		text: "Once per Turn Action — 2: Attack. Go again. Piercing 1. (Graveyard re-equip is a later turn and is not modeled.)"
	},
	{
		id: "none",
		name: "No weapon",
		power: 0,
		cost: 0,
		piercing: 0,
		goAgain: false,
		powerIfMarked: 0,
		markOnHit: false,
		tax: 0,
		text: "Empty weapon zone."
	}
];
function atk(partial) {
	return {
		kind: "attack",
		tags: partial.tags ?? [],
		...partial
	};
}
var CARDS = [
	atk({
		id: "lnw-r",
		name: "Leave No Witnesses",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 4,
		defense: 3,
		contract: {
			kind: "color",
			color: "red"
		},
		onHit: [{ type: "banish-top" }, { type: "banish-arsenal" }],
		text: "Contract — banish opponents' red cards. Whenever you complete this contract, create a Silver. When this hits a hero, banish the top card of their deck and up to 1 card in their arsenal.",
		tags: ["contract", "spine"]
	}),
	atk({
		id: "bloodloss-r",
		name: "Excessive Bloodloss",
		color: "red",
		pitch: 1,
		cost: 1,
		power: 5,
		defense: 3,
		contract: {
			kind: "color",
			color: "red"
		},
		onHit: [{
			type: "banish-top-repeat-color",
			color: "red"
		}],
		text: "Contract — banish opponents' red cards. Create a Silver when you complete it. When this hits, banish the top card of their deck. If it's red, repeat once.",
		tags: ["contract", "spine"]
	}),
	atk({
		id: "bloodloss-b",
		name: "Excessive Bloodloss",
		color: "blue",
		pitch: 3,
		cost: 1,
		power: 3,
		defense: 3,
		contract: {
			kind: "color",
			color: "red"
		},
		onHit: [{
			type: "banish-top-repeat-color",
			color: "red"
		}],
		text: "Blue pitch copy. Contract — red cards. On hit, banish top; if red, repeat once.",
		tags: ["contract"]
	}),
	atk({
		id: "surgical-b",
		name: "Surgical Extraction",
		color: "blue",
		pitch: 3,
		cost: 2,
		power: 4,
		defense: 3,
		contract: {
			kind: "color",
			color: "blue"
		},
		onHit: [{ type: "banish-top" }, { type: "banish-hand" }],
		text: "Contract — banish opponents' blue cards. Create a Silver when you complete it. When this hits, banish the top card of their deck, then look at their hand and banish a card.",
		tags: ["contract", "spine"]
	}),
	atk({
		id: "plunder-r",
		name: "Plunder the Poor",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 4,
		defense: 3,
		contract: { kind: "cost-le" },
		onHit: [{ type: "banish-top" }],
		text: "Contract — banish opponents' cards with cost 1 or less. Create a Silver when you complete it. When this hits, banish the top card of their deck.",
		tags: ["contract", "spine"]
	}),
	atk({
		id: "fleece-r",
		name: "Fleece the Frail",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 4,
		defense: 3,
		contract: { kind: "def-le" },
		onHit: [{ type: "banish-top" }],
		text: "Contract — banish opponents' cards with 2 or less defense. Create a Silver when you complete it. When this hits, banish the top card of their deck.",
		tags: ["contract"]
	}),
	atk({
		id: "sack-r",
		name: "Sack the Shifty",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 4,
		defense: 3,
		contract: { kind: "go-again" },
		onHit: [{ type: "banish-top" }],
		text: "Contract — banish opponents' cards with base go again. Create a Silver when you complete it. When this hits, banish the top card of their deck.",
		tags: ["contract"]
	}),
	atk({
		id: "slay-r",
		name: "Slay the Scholars",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 4,
		defense: 3,
		contract: { kind: "non-attack-action" },
		onHit: [{ type: "banish-top" }],
		text: "Contract — banish opponents' non-attack action cards. Create a Silver when you complete it. When this hits, banish the top card of their deck.",
		tags: ["contract"]
	}),
	atk({
		id: "annihilate-r",
		name: "Annihilate the Armed",
		color: "red",
		pitch: 1,
		cost: 1,
		power: 5,
		defense: 3,
		contract: { kind: "attack-action" },
		onHit: [{ type: "banish-top" }],
		text: "Contract — banish opponents' attack action cards. Create a Silver when you complete it. When this hits, banish the top card of their deck.",
		tags: ["contract"]
	}),
	atk({
		id: "eradicate-y",
		name: "Eradicate",
		color: "yellow",
		pitch: 2,
		cost: 1,
		power: 4,
		defense: 3,
		contract: {
			kind: "color",
			color: "yellow"
		},
		onHit: [{ type: "banish-top-damage" }],
		text: "Contract — banish opponents' yellow cards. Create a Silver when you complete it. When this hits, banish the top X cards of their deck, where X is the damage dealt this way.",
		tags: ["contract"]
	}),
	atk({
		id: "prognosis-b",
		name: "Persuasive Prognosis",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 1,
		defense: 3,
		stealth: true,
		onHit: [
			{ type: "banish-top" },
			{ type: "banish-hand-same-color" },
			{ type: "life-per-action-banished" }
		],
		text: "Stealth. When this hits, banish the top card of their deck, then banish a card of that color from their hand. Whenever this banishes an action card, gain 1 life.",
		tags: ["stealth"]
	}),
	atk({
		id: "widow-r",
		name: "Mark of the Black Widow",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 3,
		defense: 3,
		stealth: true,
		onHit: [{ type: "banish-hand-if-marked" }],
		text: "Stealth. When this hits a marked hero, they banish a card from their hand.",
		tags: ["stealth"]
	}),
	atk({
		id: "cnc-r",
		name: "Command and Conquer",
		color: "red",
		pitch: 1,
		cost: 2,
		power: 6,
		defense: 3,
		onHit: [{ type: "destroy-arsenal" }],
		text: "Defense reactions can't be played this chain link. When this hits a hero, destroy all cards in their arsenal.",
		tags: ["generic", "spine"]
	}),
	{
		id: "codex-y",
		name: "Codex of Frailty",
		color: "yellow",
		pitch: 2,
		cost: 0,
		power: 0,
		defense: 2,
		kind: "action",
		goAgain: true,
		action: "codex-frailty",
		text: "Each hero puts an attack action card from their graveyard face-down into their arsenal. Each hero that does, discards a card. Create a Ponder and a Frailty. Go again.",
		tags: ["setup", "spine"]
	},
	{
		id: "cut-r",
		name: "Cut to the Chase",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "cut",
		reactionAmount: 3,
		text: "Target Assassin attack action card with contract gets +3. Look at the top card of the defending hero's deck. You may put it on the bottom.",
		tags: ["reaction", "spine"]
	},
	{
		id: "cut-y",
		name: "Cut to the Chase",
		color: "yellow",
		pitch: 2,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "cut",
		reactionAmount: 2,
		text: "Target Assassin attack action card with contract gets +2. Look at the top of their deck. You may bottom it.",
		tags: ["reaction"]
	},
	{
		id: "cut-b",
		name: "Cut to the Chase",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "cut",
		reactionAmount: 1,
		text: "Target Assassin attack action card with contract gets +1. Look at the top of their deck. You may bottom it.",
		tags: ["reaction"]
	},
	{
		id: "coercive-b",
		name: "Coercive Tendency",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "coercive",
		text: "Arakni Specialization. Look at the top 3 cards of the defending hero's deck. Put them back in any order, then banish the top. If you complete a contract this way, your Assassin attacks get go again this combat chain.",
		tags: [
			"reaction",
			"spine",
			"specialization"
		]
	},
	{
		id: "shred-r",
		name: "Shred",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "shred",
		reactionAmount: 4,
		text: "Target card defending an Assassin attack gets -4 defense this combat chain.",
		tags: ["reaction"]
	},
	{
		id: "shred-y",
		name: "Shred",
		color: "yellow",
		pitch: 2,
		cost: 0,
		power: 0,
		defense: 3,
		kind: "attack-reaction",
		reaction: "shred",
		reactionAmount: 3,
		text: "Target card defending an Assassin attack gets -3 defense this combat chain.",
		tags: ["reaction", "spine"]
	},
	{
		id: "sink-r",
		name: "Sink Below",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 4,
		kind: "defense-reaction",
		defenseEffect: "sink",
		text: "You may put a card from your hand on the bottom of your deck. If you do, draw a card.",
		tags: [
			"defense",
			"generic",
			"spine"
		]
	},
	{
		id: "sink-b",
		name: "Sink Below",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 2,
		kind: "defense-reaction",
		defenseEffect: "sink",
		text: "Blue copy. Defense 2. You may bottom a card and draw.",
		tags: ["defense", "generic"]
	},
	{
		id: "fate-r",
		name: "Fate Foreseen",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 4,
		kind: "defense-reaction",
		defenseEffect: "opt",
		text: "Opt 1.",
		tags: ["defense", "generic"]
	},
	{
		id: "fate-b",
		name: "Fate Foreseen",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 2,
		kind: "defense-reaction",
		defenseEffect: "opt",
		text: "Blue copy. Defense 2. Opt 1.",
		tags: ["defense", "generic"]
	},
	{
		id: "shelter-r",
		name: "Shelter from the Storm",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 4,
		kind: "defense-reaction",
		defenseEffect: "shelter",
		prevent: 3,
		text: "Instant — Discard this: the next 3 times you would be dealt damage this turn, prevent 1.",
		tags: ["defense", "generic"]
	},
	{
		id: "sigil-r",
		name: "Sigil of Solace",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 0,
		kind: "instant",
		life: 3,
		text: "Gain 3 life.",
		tags: ["generic", "spine"]
	},
	{
		id: "sigil-b",
		name: "Sigil of Solace",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 0,
		kind: "instant",
		life: 1,
		text: "Gain 1 life.",
		tags: ["generic"]
	},
	{
		id: "fiddler-r",
		name: "Fiddler's Green",
		color: "red",
		pitch: 1,
		cost: 0,
		power: 0,
		defense: 1,
		kind: "block",
		graveLife: 3,
		text: "When this is put into your graveyard from anywhere, gain 3 life.",
		tags: ["block", "generic"]
	},
	{
		id: "fiddler-b",
		name: "Fiddler's Green",
		color: "blue",
		pitch: 3,
		cost: 0,
		power: 0,
		defense: 1,
		kind: "block",
		graveLife: 1,
		text: "When this is put into your graveyard from anywhere, gain 1 life.",
		tags: ["block", "generic"]
	},
	{
		id: "hunted-b",
		name: "Hunter or Hunted?",
		color: "blue",
		pitch: 3,
		cost: 3,
		power: 0,
		defense: 4,
		kind: "defense-reaction",
		defenseEffect: "named",
		text: "When this defends, name a card. If the top of their deck is that name, banish it and up to 3 more copies from hand, deck, and arsenal. Contract completes if the name hits. The chance of a hit is the prior pNamed, not a decklist.",
		tags: ["defense", "contract"]
	}
];
var CARD_MAP = Object.fromEntries(CARDS.map((c) => [c.id, c]));
var WEAPON_MAP = Object.fromEntries(WEAPONS.map((w) => [w.id, w]));
var SPINE_IDS = [
	"lnw-r",
	"bloodloss-r",
	"surgical-b",
	"plunder-r",
	"codex-y",
	"coercive-b",
	"cut-r",
	"cnc-r",
	"sink-r",
	"sigil-r"
];
function cardById(id) {
	const c = CARD_MAP[id];
	if (!c) throw new Error(`Unknown card ${id}`);
	return c;
}
function weaponById(id) {
	const w = WEAPON_MAP[id];
	if (!w) throw new Error(`Unknown weapon ${id}`);
	return w;
}
function pitchLabel(pitch, color) {
	if (color === "red" || pitch === 1) return "R";
	if (color === "yellow" || pitch === 2) return "Y";
	if (color === "blue" || pitch === 3) return "B";
	return "—";
}
var OUTCOME_KEYS = [
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
	"defenseTax"
];
var OUTCOME_LABELS = {
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
	defenseTax: "Defense tax applied"
};
function emptyOutcome() {
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
		defenseTax: 0
	};
}
function scoreOutcome(outcome, weights) {
	let total = 0;
	for (const key of OUTCOME_KEYS) total += (weights[key] ?? 0) * outcome[key];
	return total;
}
function mixOutcomes(a, b, p) {
	const out = emptyOutcome();
	for (const key of OUTCOME_KEYS) out[key] = a[key] * p + b[key] * (1 - p);
	return out;
}
function subtractOutcome(a, b) {
	const out = emptyOutcome();
	for (const key of OUTCOME_KEYS) out[key] = a[key] - b[key];
	return out;
}
function neutralWeights() {
	const w = emptyOutcome();
	for (const key of OUTCOME_KEYS) w[key] = 1;
	w.damageTaken = -1;
	w.resourcesGenerated = 0;
	w.resourcesSpent = 0;
	w.resourcesUnused = 0;
	return w;
}
function presetWeights(name) {
	const w = neutralWeights();
	if (name === "aggressive") {
		w.damage = 3;
		w.marksApplied = 2;
		w.contractsCompleted = 1;
		w.cardsBanished = .4;
		w.lifeGained = .2;
		w.cardsInHand = .3;
		w.cardsInArsenal = .4;
		w.deckPeeks = .2;
		w.heroAbility = .2;
		w.damageTaken = -.5;
		w.prevention = .3;
		w.silverCreated = .4;
		w.frailtyApplied = .4;
		w.ponderCreated = .3;
		w.cardsDrawn = .4;
	} else if (name === "midrange") {
		w.damage = 1.6;
		w.contractsCompleted = 1.6;
		w.cardsBanished = 1.2;
		w.cardsInHand = 1;
		w.cardsInArsenal = 1.3;
		w.marksApplied = 1.2;
		w.lifeGained = .8;
		w.silverCreated = .8;
		w.frailtyApplied = 1;
		w.deckPeeks = .6;
	} else if (name === "control") {
		w.damage = .6;
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
		w.damage = .3;
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
var PRESETS = [
	{
		id: "neutral",
		label: "Neutral",
		note: "Each raw count weighs 1. Damage taken weighs −1. Resource totals weigh 0 so they are recorded, not scored."
	},
	{
		id: "aggressive",
		label: "Aggressive",
		note: "A hypothesis that favors damage and marks over disruption."
	},
	{
		id: "midrange",
		label: "Midrange",
		note: "A hypothesis that balances damage, contracts, and cards kept."
	},
	{
		id: "control",
		label: "Control",
		note: "A hypothesis that favors banishes, peeks, and frailty over raw damage."
	},
	{
		id: "fatigue",
		label: "Fatigue",
		note: "A hypothesis that favors deck stripping and a full hand over racing."
	}
];
var USAGES = [
	"played",
	"pitched",
	"blocked",
	"arsenaled",
	"retained",
	"discarded"
];
function zeroMix() {
	return {
		played: 0,
		pitched: 0,
		blocked: 0,
		arsenaled: 0,
		retained: 0,
		discarded: 0
	};
}
function fmt$1(n) {
	const r = Math.round(n * 100) / 100;
	return Math.abs(r - Math.round(r)) < .001 ? String(Math.round(r)) : r.toFixed(2);
}
function clamp01(n) {
	return Math.max(0, Math.min(1, n));
}
function card(inst) {
	return cardById(inst.cardId);
}
function sumPitch(list) {
	return list.reduce((n, inst) => n + card(inst).pitch, 0);
}
function subsets(list) {
	const out = [[]];
	for (const inst of list) {
		const n = out.length;
		for (let i = 0; i < n; i++) out.push(out[i].concat(inst));
	}
	return out;
}
function minimalPitches(pool, deficit) {
	const viable = subsets(pool).filter((s) => sumPitch(s) >= deficit);
	return viable.filter((s) => !viable.some((o) => o.length < s.length && o.every((x) => s.some((y) => y.iid === x.iid))));
}
function names(list) {
	if (!list.length) return "nothing";
	return list.map((inst) => `${card(inst).name} (${card(inst).pitch})`).join(", ");
}
function condBase(contract, prior) {
	switch (contract.kind) {
		case "color": return contract.color === "red" ? prior.pRed : contract.color === "yellow" ? prior.pYellow : prior.pBlue;
		case "attack-action": return prior.pAttackAction;
		case "non-attack-action": return prior.pNonAttackAction;
		case "non-action": return clamp01(1 - prior.pAttackAction - prior.pNonAttackAction);
		case "cost-le": return prior.pCostLe1;
		case "def-le": return prior.pDefLe2;
		case "go-again": return prior.pGoAgain;
	}
}
function connectP(pEvent, prior) {
	if (prior.connect === "always") return pEvent > 1e-9 ? 1 : 0;
	if (prior.connect === "never") return 0;
	return clamp01(pEvent);
}
function clone(s) {
	return {
		...s,
		hand: s.hand.slice(),
		graveyard: s.graveyard.slice(),
		pitch: s.pitch.slice(),
		chain: s.chain.map((link) => ({
			...link,
			onHit: link.onHit.slice()
		})),
		stats: { ...s.stats },
		usage: { ...s.usage }
	};
}
function removeFrom(list, iid) {
	return list.filter((inst) => inst.iid !== iid);
}
function take(state, inst) {
	state.hand = removeFrom(state.hand, inst.iid);
	if (state.arsenal?.iid === inst.iid) state.arsenal = null;
}
function pay(state, pitches, cost) {
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
function mintContract(state, link, pMatch) {
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
function strike(power, piercing, block, shred) {
	const blocked = Math.max(0, block - shred);
	const pierce = Math.min(power, Math.max(0, piercing));
	return Math.min(power, pierce + Math.max(0, power - pierce - blocked));
}
function applyOnHits(state, link, damage, prior) {
	let actionBanishP = 0;
	const pAction = clamp01(prior.pAttackAction + prior.pNonAttackAction);
	for (const hit of link.onHit) if (hit.type === "banish-top") {
		const n = hit.n ?? 1;
		state.stats.cardsBanished += n;
		actionBanishP += n * pAction;
		if (link.contract) mintContract(state, link, connectP(1 - (1 - condBase(link.contract, prior)) ** n, prior));
	} else if (hit.type === "banish-top-repeat-color") {
		const pColor = hit.color === "red" ? prior.pRed : hit.color === "yellow" ? prior.pYellow : prior.pBlue;
		state.stats.cardsBanished += 1 + pColor;
		actionBanishP += (1 + pColor) * pAction;
		mintContract(state, link, connectP(pColor, prior));
	} else if (hit.type === "banish-top-damage") {
		const n = Math.max(0, Math.round(damage));
		state.stats.cardsBanished += n;
		actionBanishP += n * pAction;
		if (link.contract && n > 0) mintContract(state, link, connectP(1 - (1 - condBase(link.contract, prior)) ** n, prior));
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
		if (link.contract) mintContract(state, link, connectP(1 - (1 - condBase(link.contract, prior)) ** Math.max(0, prior.oppHand), prior));
	} else if (hit.type === "banish-hand-same-color") {
		const colors = [
			prior.pRed,
			prior.pYellow,
			prior.pBlue
		];
		let pSecond = 0;
		for (const p of colors) pSecond += p * (1 - (1 - p) ** Math.max(0, prior.oppHand));
		state.stats.cardsBanished += pSecond;
		actionBanishP += pSecond * pAction;
	} else if (hit.type === "banish-hand-if-marked") {
		if (state.marked) {
			state.stats.cardsBanished += 1;
			actionBanishP += pAction;
		}
	} else if (hit.type === "destroy-arsenal") state.stats.opponentArsenalDestroyed += prior.pArsenal;
	else if (hit.type === "mark") {
		if (!state.marked) {
			state.marked = true;
			state.stats.marksApplied += 1;
		}
	} else if (hit.type === "tax") {
		state.pendingTax += hit.amount;
		state.stats.defenseTax += hit.amount;
	} else if (hit.type === "life-per-action-banished") state.stats.lifeGained += actionBanishP;
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
function unresolved(state) {
	const link = state.chain[state.chain.length - 1];
	if (!link || link.resolved) return null;
	return link;
}
function chainOpen(state) {
	return state.chain.length > 0;
}
function isAttackAction(def) {
	return def.kind === "attack";
}
function zoneKey(s) {
	const ids = (list) => list.map((i) => i.iid).sort((a, b) => a - b).join(",");
	const chain = s.chain.map((l) => `${l.inst?.iid ?? "w"}:${l.resolved ? 1 : 0}:${l.power}:${l.piercing}:${l.goAgain ? 1 : 0}:${l.onHitGoAgain ? 1 : 0}:${l.shred}:${l.weaponMark ? 1 : 0}:${l.contractOpen.toFixed(3)}:${l.onHit.length}`).join("/");
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
		s.phase
	].join("#");
}
function numeric(s) {
	return [
		...Object.values(s.stats),
		s.resources,
		s.ap,
		s.silver,
		s.ponder,
		s.marked ? 1 : 0,
		s.weaponReady ? 1 : 0,
		s.pendingTax
	];
}
function dominates(a, b) {
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
function memoKey(s) {
	const nums = numeric(s).map((n) => (Math.round(n * 1e3) / 1e3).toFixed(3)).join(",");
	return `${zoneKey(s)}|${s.resources}|${s.ap}|${nums}`;
}
function diffText(before, after) {
	const bits = [];
	for (const [key, label] of [
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
		["damageTaken", "taken"]
	]) {
		const d = after[key] - before[key];
		if (d > .01) bits.push(`${fmt$1(d)} ${label}`);
	}
	return bits.join(", ") || "no tracked change";
}
function finish(state) {
	const s = clone(state);
	for (const link of s.chain) if (link.inst) s.graveyard.push(link.inst);
	s.chain = [];
	for (const inst of s.hand) if (!s.usage[inst.iid]) s.usage[inst.iid] = "retained";
	if (s.arsenal && !s.usage[s.arsenal.iid]) s.usage[s.arsenal.iid] = "arsenaled";
	return {
		outcome: {
			...s.stats,
			cardsInHand: s.hand.length,
			cardsInArsenal: s.arsenal ? 1 : 0,
			resourcesUnused: s.resources,
			cardsDrawn: s.stats.cardsDrawn + s.ponder
		},
		usage: s.usage
	};
}
function toMix(usage) {
	const mix = {};
	for (const [iid, u] of Object.entries(usage)) {
		const row = zeroMix();
		row[u] = 1;
		mix[Number(iid)] = row;
	}
	return mix;
}
function mixUsage(a, b, p) {
	const ids = new Set([...Object.keys(a), ...Object.keys(b)].map(Number));
	const out = {};
	for (const iid of ids) {
		const row = zeroMix();
		for (const key of USAGES) row[key] = (a[iid]?.[key] ?? 0) * p + (b[iid]?.[key] ?? 0) * (1 - p);
		out[iid] = row;
	}
	return out;
}
function prepend(step, line) {
	return {
		steps: [step, ...line.steps],
		split: line.split
	};
}
function terminal(state, weights) {
	const done = finish(state);
	return {
		score: scoreOutcome(done.outcome, weights),
		outcome: done.outcome,
		line: { steps: ["End turn."] },
		usage: toMix(done.usage)
	};
}
function declareAttack(state, inst, pitches, prior) {
	const next = clone(state);
	const def = card(inst);
	pay(next, pitches, def.cost);
	take(next, inst);
	next.ap -= 1;
	next.usage[inst.iid] = "played";
	const link = {
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
		weaponTax: 0
	};
	next.chain.push(link);
	if (def.contract) {
		next.stats.heroAbility += 1;
		next.stats.deckPeeks += 1;
	}
	return next;
}
function resolveLink(state, prior) {
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
function applyCodex(state, inst, pitches, arsenalIid, discardIid) {
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
function legal(state, ctx) {
	const prior = ctx.config.prior;
	const out = [];
	if (state.phase !== "action") return out;
	const open = unresolved(state);
	if (open) {
		const link = open;
		const attackers = state.hand.filter((inst) => {
			return card(inst).kind === "attack-reaction";
		});
		const arsenalRx = state.arsenal && card(state.arsenal).kind === "attack-reaction" ? [state.arsenal] : [];
		for (const inst of [...attackers, ...arsenalRx]) {
			const def = card(inst);
			const pool = state.hand.filter((h) => h.iid !== inst.iid);
			for (const pitches of minimalPitches(pool, Math.max(0, def.cost - state.resources))) if (def.reaction === "cut") {
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
					label: `React — ${def.name}. Contract attack gets +${def.reactionAmount}. Peek 1.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
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
					label: `React — ${def.name}. Defending card gets -${def.reactionAmount} defense.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
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
				const p = connectP(live.contract ? 1 - (1 - base) ** 3 : 0, prior);
				const pitchNote = pitches.length ? ` Pitch ${names(pitches)}.` : "";
				if (p >= 1 - 1e-9) {
					mintContract(next, live, 1);
					next.assassinGoAgain = true;
					out.push({
						kind: "sure",
						state: next,
						label: `React — Coercive Tendency. Banish the best of the top 3. Contract completes. Assassin attacks gain go again.${pitchNote}`
					});
				} else if (p <= 1e-9) out.push({
					kind: "sure",
					state: next,
					label: `React — Coercive Tendency. Banish the top of 3. Contract does not complete.${pitchNote}`
				});
				else {
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
						reason: `Contract completion from that banish is ${fmt$1(p * 100)}% under the prior. Go again is granted only on that branch.`
					});
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
				label: "Equipment — destroy Blacktek Whisperers. This attack gets go again when it hits."
			});
		}
		if (ctx.config.equipment.mask && !state.maskUsed && link.source === "card") {
			const next = clone(state);
			next.maskUsed = true;
			next.chain[next.chain.length - 1].onHit.push({ type: "banish-top" });
			out.push({
				kind: "sure",
				state: next,
				label: "Equipment — destroy Mask of Perdition. This attack banishes an extra card when it hits."
			});
		}
		if (ctx.config.equipment.flick && !state.flickUsed && !state.weaponDestroyed && ctx.weapon.id !== "none" && link.source === "card") {
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
				label: `Equipment — Flick Knives. ${ctx.weapon.name} deals 1 and is destroyed${ctx.weapon.markOnHit ? ", marking" : ""}.`
			});
		}
		const resolved = resolveLink(state, prior);
		out.push({
			kind: "sure",
			state: resolved,
			label: `Resolve ${link.source === "weapon" ? ctx.weapon.name : cardById(link.cardId).name} — ${diffText(state.stats, resolved.stats)}.${resolved.ap > state.ap ? " Go again." : ""}`
		});
		return out;
	}
	const playable = [...state.hand, ...state.arsenal ? [state.arsenal] : []];
	for (const inst of playable) {
		const def = card(inst);
		const pitchesList = minimalPitches(state.hand.filter((h) => h.iid !== inst.iid), Math.max(0, def.cost - state.resources));
		if (def.kind === "attack") {
			if (state.ap < 1) continue;
			for (const pitches of pitchesList) {
				const next = declareAttack(state, inst, pitches, prior);
				const from = state.arsenal?.iid === inst.iid ? " from arsenal" : "";
				out.push({
					kind: "sure",
					state: next,
					label: `Play ${def.name}${from} for ${def.power}.${def.contract ? " Hero ability peeks." : ""}${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
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
						label: `Play Codex of Frailty. Ponder, Frailty, go again.${attacks.length === 0 ? " No attack in graveyard to arsenal." : " Arsenal occupied."}${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
					});
				} else {
					const discards = preview.hand.length ? preview.hand : [null];
					for (const atk of attacks) for (const dump of discards) {
						const next = applyCodex(state, inst, pitches, atk.iid, dump?.iid ?? null);
						out.push({
							kind: "sure",
							state: next,
							label: `Play Codex of Frailty. Arsenal ${card(atk).name}${dump ? `, discard ${card(dump).name}` : ""}. Ponder, Frailty, go again.`
						});
					}
				}
			}
		} else if (def.kind === "instant" && def.life) for (const pitches of pitchesList) {
			const next = clone(state);
			pay(next, pitches, def.cost);
			take(next, inst);
			next.graveyard.push(inst);
			next.usage[inst.iid] = "played";
			next.stats.lifeGained += def.life;
			out.push({
				kind: "sure",
				state: next,
				label: `Play ${def.name}. Gain ${def.life} life.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
			});
		}
	}
	if (!chainOpen(state) && state.ap >= 1 && !state.arsenaled && state.hand.length && !state.arsenal) for (const inst of state.hand) {
		const next = clone(state);
		take(next, inst);
		next.arsenal = inst;
		next.ap -= 1;
		next.arsenaled = true;
		next.usage[inst.iid] = "arsenaled";
		out.push({
			kind: "sure",
			state: next,
			label: `Arsenal ${card(inst).name}.`
		});
	}
	if (chainOpen(state)) {
		const next = clone(state);
		for (const link of next.chain) if (link.inst) next.graveyard.push(link.inst);
		next.chain = [];
		next.assassinGoAgain = false;
		out.push({
			kind: "sure",
			state: next,
			label: "Close the combat chain."
		});
	}
	if (state.weaponReady && !state.weaponDestroyed && ctx.weapon.id !== "none" && state.ap >= 1) {
		const options = minimalPitches(state.hand.slice(), Math.max(0, ctx.weapon.cost - state.resources));
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
					weaponTax: ctx.weapon.tax
				});
				out.push({
					kind: "sure",
					state: next,
					label: `Attack with ${ctx.weapon.name} for ${power}${doMark ? ", and mark on hit" : ""}.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
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
				label: `Cash a Silver for a draw. Go again.${pitches.length ? ` Pitch ${names(pitches)}.` : ""}`
			});
		}
	}
	return out;
}
function defensePlans(state, ctx) {
	const prior = ctx.config.prior;
	const incoming = ctx.config.incoming;
	const hand = state.hand.slice();
	const passive = hand.filter((inst) => card(inst).kind !== "defense-reaction" && card(inst).defense > 0);
	const drs = hand.filter((inst) => card(inst).kind === "defense-reaction");
	const plans = [];
	const passiveSubs = subsets(passive);
	const consider = (blockers, dr, shelterMode, pitches, cycle) => {
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
			dr ? shelterMode ? `discard ${card(dr).name} to prevent ${prevention}` : `play ${card(dr).name}` : "",
			cycle ? `bottom ${card(cycle).name} and draw` : "",
			pitches.length ? `pitch ${names(pitches)}` : ""
		].filter(Boolean);
		plans.push({
			kind: "sure",
			state: next,
			label: `Defense — ${bits.join("; ")}. Take ${fmt$1(taken)} of ${incoming}.`
		});
	};
	for (const blockers of passiveSubs) {
		const blocked = new Set(blockers.map((b) => b.iid));
		const drChoices = [{
			dr: null,
			shelter: false
		}];
		for (const dr of drs) {
			if (blocked.has(dr.iid)) continue;
			drChoices.push({
				dr,
				shelter: false
			});
			if (card(dr).defenseEffect === "shelter") drChoices.push({
				dr,
				shelter: true
			});
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
					for (const cycle of cyclePool) consider(blockers, choice.dr, choice.shelter, pitches, cycle);
				}
			}
		}
	}
	if (!plans.length) {
		const next = clone(state);
		next.stats.damageTaken += incoming;
		next.phase = ctx.config.phaseMode === "defense" ? "over" : "action";
		plans.push({
			kind: "sure",
			state: next,
			label: `Defense — take ${incoming}.`
		});
	}
	return plans;
}
function prune(applied) {
	const sures = applied.filter((a) => a.kind === "sure");
	const splits = applied.filter((a) => a.kind === "split");
	const keep = [];
	for (const item of sures) {
		if (sures.some((other) => other !== item && dominates(other.state, item.state))) continue;
		keep.push(item);
	}
	return [...splits, ...keep];
}
function search(state, ctx, depth) {
	if (state.phase === "over") return terminal(state, ctx.config.weights);
	const key = memoKey(state);
	const cached = ctx.memo.get(key);
	if (cached) return cached;
	ctx.nodes += 1;
	if (ctx.nodes > ctx.budget || depth > 14) {
		ctx.partial = true;
		return terminal(state, ctx.config.weights);
	}
	let best = state.phase === "action" && !unresolved(state) ? terminal(state, ctx.config.weights) : null;
	const applied = prune(state.phase === "defense" ? defensePlans(state, ctx) : legal(state, ctx));
	const ranked = [];
	for (const item of applied) {
		let val;
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
						options: [{
							p: item.p,
							line: success.line
						}, {
							p: 1 - item.p,
							line: fail.line
						}]
					}
				},
				usage: mixUsage(success.usage, fail.usage, item.p)
			};
		} else {
			const child = search(item.state, ctx, depth + 1);
			val = {
				score: child.score,
				outcome: child.outcome,
				line: prepend(item.label, child.line),
				usage: child.usage
			};
		}
		ranked.push(val);
		if (!best || val.score > best.score + 1e-6) best = val;
	}
	if (!best) best = terminal(state, ctx.config.weights);
	if (depth === 0) ctx.rootAlts = ranked.filter((v) => v !== best).sort((a, b) => b.score - a.score).slice(0, 3).map((v) => ({
		score: v.score,
		outcome: v.outcome,
		line: v.line
	}));
	if (!ctx.partial) ctx.memo.set(key, best);
	return best;
}
function solveHand(ids, config) {
	const ctx = {
		config,
		weapon: weaponById(config.weaponId),
		budget: config.nodeBudget,
		nodes: 0,
		partial: false,
		memo: /* @__PURE__ */ new Map(),
		rootAlts: []
	};
	const best = search({
		hand: ids.map((id, iid) => ({
			iid,
			cardId: id
		})),
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
		usage: {}
	}, ctx, 0);
	return {
		score: best.score,
		outcome: best.outcome,
		line: best.line,
		alts: ctx.rootAlts,
		usage: best.usage,
		partial: ctx.partial,
		nodes: ctx.nodes
	};
}
function combinationCount(n, k) {
	if (k < 0 || n < 0 || k > n) return 0;
	let c = 1;
	for (let i = 0; i < k; i++) c = c * (n - i) / (i + 1);
	return Math.round(c);
}
function defaultPrior() {
	return {
		pRed: .5,
		pYellow: .2,
		pBlue: .3,
		pAttackAction: .55,
		pNonAttackAction: .2,
		pGoAgain: .3,
		pCostLe1: .7,
		pDefLe2: .4,
		pArsenal: .5,
		oppHand: 4,
		pNamed: .08,
		blockPerAttack: 0,
		connect: "prior"
	};
}
function defaultConfig() {
	return {
		weights: neutralWeights(),
		prior: defaultPrior(),
		weaponId: "mark-of-the-huntsman",
		equipment: {
			blacktek: false,
			mask: false,
			flick: false
		},
		marked: false,
		incoming: 0,
		phaseMode: "action",
		nodeBudget: 5e3,
		exhaustCap: 700,
		sampleSize: 400,
		seed: 1,
		contributionHands: 24
	};
}
var ROLE_RULES = [
	"Block — blocked in at least 35% of best lines.",
	"Resource — pitched in at least 55% and played in at most 25%.",
	"Enabler — an attack reaction played in at least 30%.",
	"Contract — played in at least 40% and contract contribution leads.",
	"Pressure — played in at least 40% and damage contribution is at least 1.",
	"Arsenal — arsenaled in at least 30%.",
	"Kept — retained in at least 45%.",
	"Flex — no threshold won."
];
function roleRules() {
	return ROLE_RULES;
}
function withScores(hands, weights) {
	return hands.map((hand) => ({
		...hand,
		score: scoreOutcome(hand.outcome, weights),
		contribution: hand.contribution?.map((row) => ({
			...row,
			score: scoreOutcome(row.delta, weights)
		}))
	})).sort((a, b) => b.score - a.score);
}
function emptyRates() {
	return {
		played: 0,
		pitched: 0,
		blocked: 0,
		arsenaled: 0,
		retained: 0,
		discarded: 0,
		hands: 0,
		contribution: 0,
		contributionN: 0
	};
}
function cardRows(hands) {
	const acc = /* @__PURE__ */ new Map();
	for (const hand of hands) {
		const seen = /* @__PURE__ */ new Set();
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
		}
	}
	const rows = [];
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
		if (blocked >= .35) {
			role = "Block";
			because = `Blocked in ${pct$1(blocked)} of best lines.`;
		} else if (pitched >= .55 && played <= .25) {
			role = "Resource";
			because = `Pitched in ${pct$1(pitched)}; played in ${pct$1(played)}.`;
		} else if (def?.kind === "attack-reaction" && played >= .3) {
			role = "Enabler";
			because = `Played as a reaction in ${pct$1(played)} of best lines.`;
		} else if (played >= .4 && def?.contract) {
			role = "Contract";
			because = `Played in ${pct$1(played)} and it is a contract card.`;
		} else if (played >= .4) {
			role = "Pressure";
			because = `Played in ${pct$1(played)} of best lines.`;
		} else if (arsenaled >= .3) {
			role = "Arsenal";
			because = `Arsenaled in ${pct$1(arsenaled)} of best lines.`;
		} else if (retained >= .45) {
			role = "Kept";
			because = `Still in hand in ${pct$1(retained)} of best lines.`;
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
			because
		});
	}
	rows.sort((a, b) => b.contribution - a.contribution || b.played - a.played);
	return rows;
}
function pct$1(n) {
	return `${Math.round(n * 100)}%`;
}
function mean(list) {
	if (!list.length) return 0;
	return list.reduce((a, b) => a + b, 0) / list.length;
}
function synergies(hands) {
	const overall = mean(hands.map((h) => h.score));
	const pairBuckets = /* @__PURE__ */ new Map();
	const ids = [...new Set(hands.flatMap((h) => h.ids))].sort();
	for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) pairBuckets.set(`${ids[i]}|${ids[j]}`, {
		ids: [ids[i], ids[j]],
		both: [],
		onlyA: [],
		onlyB: [],
		neither: []
	});
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
	const pairs = [];
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
			note: `Together ${fmt(mean(bucket.both))} vs ${fmt(overall)} overall. Interaction ${fmt(interaction)}.`
		});
	}
	pairs.sort((a, b) => b.interaction - a.interaction);
	const triples = [];
	for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) for (let k = j + 1; k < ids.length; k++) {
		const trip = [
			ids[i],
			ids[j],
			ids[k]
		];
		const both = [];
		for (const hand of hands) if (trip.every((id) => hand.ids.includes(id))) both.push(hand.score);
		if (both.length < 4) continue;
		const lift = mean(both) - overall;
		triples.push({
			ids: trip,
			names: trip.map((id) => CARD_MAP[id]?.name ?? id).join(" + "),
			n: both.length,
			mean: mean(both),
			interaction: lift,
			note: `Mean ${fmt(mean(both))} against ${fmt(overall)} for every searched hand. Lift ${fmt(lift)}.`
		});
	}
	triples.sort((a, b) => b.interaction - a.interaction);
	return {
		pairs: pairs.slice(0, 12),
		triples: triples.slice(0, 8)
	};
}
function fmt(n) {
	const r = Math.round(n * 100) / 100;
	return Math.abs(r - Math.round(r)) < .05 ? String(Math.round(r)) : r.toFixed(2);
}
function patterns(hands) {
	if (!hands.length) return {
		sentences: ["Run a search to read structure off the results."],
		means: []
	};
	const eliteN = Math.max(8, Math.ceil(hands.length * .1));
	const elite = hands.slice(0, Math.min(hands.length, eliteN));
	const avg = (pick) => mean(elite.map((h) => pick(h.outcome)));
	const pitchAvg = mean(elite.map((h) => h.ids.reduce((n, id) => n + (CARD_MAP[id]?.pitch ?? 0), 0) / h.ids.length));
	const contractAvg = mean(elite.map((h) => h.ids.filter((id) => CARD_MAP[id]?.contract).length));
	const blueAvg = mean(elite.map((h) => h.ids.filter((id) => CARD_MAP[id]?.color === "blue").length));
	const counts = /* @__PURE__ */ new Map();
	const pairCounts = /* @__PURE__ */ new Map();
	for (const hand of elite) {
		for (const id of hand.ids) counts.set(id, (counts.get(id) ?? 0) + 1);
		const uniq = [...new Set(hand.ids)].sort();
		for (let i = 0; i < uniq.length; i++) for (let j = i + 1; j < uniq.length; j++) {
			const key = `${uniq[i]}|${uniq[j]}`;
			pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
		}
	}
	const topCard = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
	const topPair = [...pairCounts.entries()].sort((a, b) => b[1] - a[1])[0];
	const cardName = topCard ? CARD_MAP[topCard[0]]?.name ?? topCard[0] : "—";
	const pairName = topPair ? topPair[0].split("|").map((id) => CARD_MAP[id]?.name ?? id).join(" + ") : "—";
	return {
		sentences: [
			`The top ${elite.length} hands average ${fmt(avg((o) => o.damage))} damage, ${fmt(avg((o) => o.contractsCompleted))} contracts, and ${fmt(avg((o) => o.cardsBanished))} cards banished.`,
			`They finish with ${fmt(avg((o) => o.cardsInHand))} cards in hand and ${fmt(avg((o) => o.cardsInArsenal))} in arsenal. Average pitch value in the hand is ${fmt(pitchAvg)}.`,
			`Elite hands hold ${fmt(contractAvg)} contract cards and ${fmt(blueAvg)} blue cards on average.`,
			topCard ? `${cardName} appears in ${topCard[1]} of these ${elite.length} hands. The most common pair is ${pairName} (${topPair?.[1] ?? 0}).` : "No card repeated."
		],
		means: [
			{
				label: OUTCOME_LABELS.damage,
				value: fmt(avg((o) => o.damage))
			},
			{
				label: OUTCOME_LABELS.contractsCompleted,
				value: fmt(avg((o) => o.contractsCompleted))
			},
			{
				label: OUTCOME_LABELS.cardsBanished,
				value: fmt(avg((o) => o.cardsBanished))
			},
			{
				label: OUTCOME_LABELS.cardsInHand,
				value: fmt(avg((o) => o.cardsInHand))
			},
			{
				label: OUTCOME_LABELS.cardsInArsenal,
				value: fmt(avg((o) => o.cardsInArsenal))
			},
			{
				label: OUTCOME_LABELS.lifeGained,
				value: fmt(avg((o) => o.lifeGained))
			},
			{
				label: "Avg pitch",
				value: fmt(pitchAvg)
			}
		]
	};
}
var TABS = [
	{
		id: "hands",
		label: "Hands"
	},
	{
		id: "line",
		label: "Line"
	},
	{
		id: "cards",
		label: "Cards"
	},
	{
		id: "synergy",
		label: "Synergy"
	},
	{
		id: "patterns",
		label: "Patterns"
	}
];
function num(n) {
	if (!Number.isFinite(n)) return "—";
	const rounded = Math.round(n * 100) / 100;
	if (Math.abs(rounded - Math.round(rounded)) < .001) return String(Math.round(rounded));
	return rounded.toFixed(2);
}
function pct(n) {
	return `${Math.round(n * 100)}%`;
}
function normalizePrior(prior) {
	const sum = prior.pRed + prior.pYellow + prior.pBlue;
	if (sum <= 0) return {
		...prior,
		pRed: 1 / 3,
		pYellow: 1 / 3,
		pBlue: 1 / 3
	};
	return {
		...prior,
		pRed: prior.pRed / sum,
		pYellow: prior.pYellow / sum,
		pBlue: prior.pBlue / sum
	};
}
function Pitch({ id }) {
	const card = cardById(id);
	const tone = card.color === "red" ? "text-pitch-r" : card.color === "yellow" ? "text-pitch-y" : card.color === "blue" ? "text-pitch-b" : "text-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `tabular w-4 text-sm font-medium ${tone}`,
		children: pitchLabel(card.pitch, card.color)
	});
}
function Chip({ id }) {
	const card = cardById(id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex min-h-8 items-center gap-2 rounded-md border border-border bg-bg-subtle px-2 py-1 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pitch, { id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: card.name })]
	});
}
function LineList({ line, depth = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: depth ? "mt-3 border-l border-border pl-4" : "",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-2",
			children: line.steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-sm leading-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mr-2 tabular text-subtle",
					children: index + 1
				}), step]
			}, `${depth}-${index}`))
		}), line.split ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 flex flex-col gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: line.split.reason
			}), line.split.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md bg-bg-subtle p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-sm font-medium tabular",
					children: [pct(option.p), " branch"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineList, {
					line: option.line,
					depth: depth + 1
				})]
			}, option.p))]
		}) : null]
	});
}
function OutcomeGrid({ outcome }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
		className: "grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3",
		children: OUTCOME_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: OUTCOME_LABELS[key]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `tabular text-sm ${outcome[key] === 0 ? "text-subtle" : "text-fg"}`,
			children: num(outcome[key])
		})] }, key))
	});
}
function LedgerApp() {
	const initial = defaultConfig();
	const [weights, setWeights] = (0, import_react.useState)(initial.weights);
	const [preset, setPreset] = (0, import_react.useState)("neutral");
	const [prior, setPrior] = (0, import_react.useState)(initial.prior);
	const [weaponId, setWeaponId] = (0, import_react.useState)(initial.weaponId);
	const [blacktek, setBlacktek] = (0, import_react.useState)(false);
	const [mask, setMask] = (0, import_react.useState)(false);
	const [flick, setFlick] = (0, import_react.useState)(false);
	const [marked, setMarked] = (0, import_react.useState)(false);
	const [incoming, setIncoming] = (0, import_react.useState)(0);
	const [phaseMode, setPhaseMode] = (0, import_react.useState)("action");
	const [pool, setPool] = (0, import_react.useState)(SPINE_IDS);
	const [openCard, setOpenCard] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("hands");
	const [running, setRunning] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [picked, setPicked] = (0, import_react.useState)(0);
	const [staleWeights, setStaleWeights] = (0, import_react.useState)(false);
	const [probeSlots, setProbeSlots] = (0, import_react.useState)([
		"lnw-r",
		"coercive-b",
		"codex-y",
		"sigil-b"
	]);
	const [probe, setProbe] = (0, import_react.useState)(null);
	const workerRef = (0, import_react.useRef)(null);
	const config = (0, import_react.useMemo)(() => ({
		...defaultConfig(),
		weights,
		prior: normalizePrior(prior),
		weaponId,
		equipment: {
			blacktek,
			mask,
			flick
		},
		marked,
		incoming,
		phaseMode
	}), [
		weights,
		prior,
		weaponId,
		blacktek,
		mask,
		flick,
		marked,
		incoming,
		phaseMode
	]);
	const ranked = (0, import_react.useMemo)(() => result ? withScores(result.hands, weights) : [], [result, weights]);
	const rows = (0, import_react.useMemo)(() => cardRows(ranked), [ranked]);
	const synergy = (0, import_react.useMemo)(() => synergies(ranked), [ranked]);
	const pattern = (0, import_react.useMemo)(() => patterns(ranked), [ranked]);
	const possible = combinationCount(pool.length, 4);
	const selected = ranked[picked] ?? ranked[0];
	function runSearch(nextPool = pool, nextConfig = config) {
		if (nextPool.length < 4) {
			setError("Check at least four cards. The discovery search builds 4-card hands from the checked pool.");
			return;
		}
		setError(null);
		setRunning(true);
		setProgress({
			done: 0,
			total: Math.min(possible, nextConfig.exhaustCap)
		});
		setStaleWeights(false);
		workerRef.current?.terminate();
		const worker = new Worker(new URL("../../engine/worker.ts", import.meta.url), { type: "module" });
		workerRef.current = worker;
		worker.onmessage = (event) => {
			const data = event.data;
			if (data.type === "progress" && data.done != null && data.total != null) setProgress({
				done: data.done,
				total: data.total
			});
			else if (data.type === "done" && data.result) {
				setResult(data.result);
				setPicked(0);
				setProbe(null);
				setRunning(false);
				setTab("hands");
				worker.terminate();
			} else if (data.type === "error") {
				setError(data.message ?? "Search failed");
				setRunning(false);
				worker.terminate();
			}
		};
		worker.onerror = () => {
			setError("The search worker failed to start.");
			setRunning(false);
		};
		worker.postMessage({
			cardIds: nextPool,
			config: nextConfig
		});
	}
	(0, import_react.useEffect)(() => {
		runSearch(SPINE_IDS, {
			...defaultConfig(),
			weights: neutralWeights()
		});
		return () => workerRef.current?.terminate();
	}, []);
	function applyPreset(id) {
		setPreset(id);
		setWeights(id === "neutral" ? neutralWeights() : presetWeights(id));
		if (result) setStaleWeights(true);
	}
	function updateWeight(key, value) {
		setPreset("custom");
		setWeights((current) => ({
			...current,
			[key]: value
		}));
		if (result) setStaleWeights(true);
	}
	function togglePool(id) {
		setPool((current) => current.includes(id) ? current.filter((card) => card !== id) : [...current, id]);
	}
	function readProbe() {
		const ids = probeSlots.filter(Boolean);
		if (!ids.length) return;
		const full = solveHand(ids, config);
		const contribution = ids.map((id, index) => {
			const ablated = solveHand(ids.filter((_, slot) => slot !== index), config);
			const delta = subtractOutcome(full.outcome, ablated.outcome);
			return {
				id,
				delta,
				score: scoreOutcome(delta, config.weights)
			};
		});
		const report = {
			ids,
			iids: ids.map((_, index) => index),
			score: full.score,
			outcome: full.outcome,
			line: full.line,
			alts: full.alts,
			uses: [],
			partial: full.partial,
			contribution
		};
		setProbe({
			ids,
			report
		});
		setTab("line");
	}
	const lineReport = probe?.report ?? selected;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-subtle",
						children: "ARAKNI, HUNTSMAN"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-medium tracking-tight text-fg",
						children: "Huntsman Ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-6 text-muted",
						children: "Four-card hands, legal lines, and raw outcomes. The search records what happened. The weights below decide what that is worth."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => runSearch(),
				disabled: running,
				className: "inline-flex h-11 items-center justify-center rounded-md bg-fg px-5 text-sm font-medium text-bg disabled:opacity-60",
				children: running ? `Searching ${progress?.done ?? 0} / ${progress?.total ?? "…"}` : "Run discovery"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "order-2 flex flex-col gap-3 lg:order-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: "Evaluator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "A hypothesis applied after the line is found. It also breaks ties inside the search."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: PRESETS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-pressed": preset === item.id,
									onClick: () => applyPreset(item.id),
									className: `h-10 rounded-md px-3 text-sm ${preset === item.id ? "bg-fg text-bg" : "border border-border text-fg"}`,
									children: item.label
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted",
								children: PRESETS.find((item) => item.id === preset)?.note ?? "Custom weights. Re-run so the search follows them."
							}),
							staleWeights ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-accent",
								children: "Ranks updated from stored lines. Run again to search under these weights."
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "text-lg font-medium",
							children: "Weights"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-col gap-3",
							children: OUTCOME_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex flex-col gap-1 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center justify-between text-muted",
									children: [OUTCOME_LABELS[key], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular text-fg",
										children: num(weights[key])
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: -2,
									max: 5,
									step: .1,
									value: weights[key],
									onChange: (event) => updateWeight(key, Number(event.target.value)),
									className: "h-11 accent-accent"
								})]
							}, key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: "Board"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex flex-col gap-1 text-sm text-muted",
								children: ["Weapon", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: weaponId,
									onChange: (event) => setWeaponId(event.target.value),
									className: "h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg",
									children: WEAPONS.map((weapon) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: weapon.id,
										children: weapon.name
									}, weapon.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: weaponById(weaponId).text
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: blacktek,
											onChange: (event) => setBlacktek(event.target.checked)
										}), "Blacktek Whisperers ready"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: mask,
											onChange: (event) => setMask(event.target.checked)
										}), "Mask of Perdition ready"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: flick,
											onChange: (event) => setFlick(event.target.checked)
										}), "Flick Knives ready"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex min-h-11 items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: marked,
											onChange: (event) => setMarked(event.target.checked)
										}), "Opponent starts marked"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 flex flex-col gap-1 text-sm text-muted",
								children: ["Phase", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: phaseMode,
									onChange: (event) => setPhaseMode(event.target.value),
									className: "h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "action",
											children: "Your action phase"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "defense",
											children: "Defense step only"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cycle",
											children: "Defend, then act"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex flex-col gap-1 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex justify-between",
									children: ["Incoming attack ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular text-fg",
										children: incoming
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 12,
									step: 1,
									value: incoming,
									onChange: (event) => setIncoming(Number(event.target.value)),
									className: "h-11 accent-accent"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
								className: "text-lg font-medium",
								children: "Opponent prior"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Expected banishes use this mix. It is not a point value."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-col gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Red cards",
										value: prior.pRed,
										onChange: (value) => setPrior({
											...prior,
											pRed: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Yellow cards",
										value: prior.pYellow,
										onChange: (value) => setPrior({
											...prior,
											pYellow: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Blue cards",
										value: prior.pBlue,
										onChange: (value) => setPrior({
											...prior,
											pBlue: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Attack actions",
										value: prior.pAttackAction,
										onChange: (value) => setPrior({
											...prior,
											pAttackAction: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Non-attack actions",
										value: prior.pNonAttackAction,
										onChange: (value) => setPrior({
											...prior,
											pNonAttackAction: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Base go again",
										value: prior.pGoAgain,
										onChange: (value) => setPrior({
											...prior,
											pGoAgain: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Cost 1 or less",
										value: prior.pCostLe1,
										onChange: (value) => setPrior({
											...prior,
											pCostLe1: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Defense 2 or less",
										value: prior.pDefLe2,
										onChange: (value) => setPrior({
											...prior,
											pDefLe2: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Has an arsenal",
										value: prior.pArsenal,
										onChange: (value) => setPrior({
											...prior,
											pArsenal: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriorSlider, {
										label: "Named card on top",
										value: prior.pNamed,
										onChange: (value) => setPrior({
											...prior,
											pNamed: value
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-1 text-sm text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex justify-between",
											children: ["Block per attack ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular text-fg",
												children: prior.blockPerAttack
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: 0,
											max: 8,
											step: 1,
											value: prior.blockPerAttack,
											onChange: (event) => setPrior({
												...prior,
												blockPerAttack: Number(event.target.value)
											}),
											className: "h-11 accent-accent"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex flex-col gap-1 text-sm text-muted",
										children: ["Contract resolution", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: prior.connect,
											onChange: (event) => setPrior({
												...prior,
												connect: event.target.value
											}),
											className: "h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "prior",
													children: "Use the prior"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "always",
													children: "Always connect"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "never",
													children: "Never connect"
												})
											]
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: "Pool"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular text-xs text-subtle",
									children: [
										pool.length,
										" cards · ",
										possible.toLocaleString(),
										" hands"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: possible > config.exhaustCap ? `Above ${config.exhaustCap} hands, a seeded sample of ${config.sampleSize} is searched.` : "Every 4-card combination of the checked cards is searched."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col",
								children: CARDS.map((card) => {
									const on = pool.includes(card.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border first:border-t-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex min-h-11 flex-1 items-center gap-3 text-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "checkbox",
														checked: on,
														onChange: () => togglePool(card.id)
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pitch, { id: card.id }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "flex-1",
														children: card.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "tabular text-subtle",
														children: [
															card.cost,
															"/",
															card.power || "–"
														]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "h-10 px-2 text-xs text-muted",
												onClick: () => setOpenCard(openCard === card.id ? null : card.id),
												children: openCard === card.id ? "Hide" : "Text"
											})]
										}), openCard === card.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "pb-3 text-sm leading-6 text-muted",
											children: card.text
										}) : null]
									}, card.id);
								})
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "order-1 min-w-0 lg:order-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto pb-3",
						role: "tablist",
						"aria-label": "Results",
						children: TABS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === item.id,
							onClick: () => setTab(item.id),
							className: `h-11 shrink-0 rounded-md px-4 text-sm ${tab === item.id ? "bg-fg text-bg" : "border border-border text-fg"}`,
							children: item.label
						}, item.id))
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 rounded-md border border-border bg-bg-subtle p-3 text-sm",
						children: error
					}) : null,
					result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-4 text-sm text-muted",
						children: [
							result.meta.exhaustive ? "Exhaustive" : "Sampled",
							" ",
							result.meta.handsSearched.toLocaleString(),
							" of ",
							result.meta.handsPossible.toLocaleString(),
							" hands",
							" · ",
							weaponById(result.meta.weaponId).name,
							" · ",
							result.meta.connect,
							" · ",
							(result.meta.ms / 1e3).toFixed(1),
							"s",
							result.meta.partialHands ? ` · ${result.meta.partialHands} hands hit the node budget` : ""
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-4 text-sm text-muted",
						children: running ? "Walking legal lines…" : "The first pass starts on its own."
					}),
					tab === "hands" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [ranked.slice(0, 40).map((hand, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setPicked(index);
								setProbe(null);
								setTab("line");
							},
							className: `rounded-xl border p-4 text-left ${picked === index && !probe ? "border-accent bg-bg-elevated" : "border-border bg-bg-elevated"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "display text-2xl font-medium tabular",
										children: index + 1
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular text-sm text-muted",
										children: num(hand.score)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: hand.ids.map((id, slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { id }, `${id}-${slot}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted tabular",
									children: [
										num(hand.outcome.damage),
										" damage · ",
										num(hand.outcome.contractsCompleted),
										" contracts · ",
										num(hand.outcome.cardsBanished),
										" banished · ",
										num(hand.outcome.cardsInHand),
										" in hand · ",
										num(hand.outcome.cardsInArsenal),
										" arsenal"
									]
								})
							]
						}, hand.ids.join("-") + index)), !ranked.length && !running ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No hands yet."
						}) : null]
					}) : null,
					tab === "line" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: probe ? "Probed hand" : `Hand ${picked + 1}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 grid gap-2 sm:grid-cols-4",
									children: probeSlots.map((id, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: id,
										onChange: (event) => {
											const next = probeSlots.slice();
											next[index] = event.target.value;
											setProbeSlots(next);
										},
										className: "h-11 rounded-md border border-border bg-bg-subtle px-2 text-sm text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Empty"
										}), CARDS.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: card.id,
											children: [
												pitchLabel(card.pitch, card.color),
												" ",
												card.name
											]
										}, card.id))]
									}, index))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: readProbe,
									className: "mt-3 h-11 rounded-md border border-border px-4 text-sm",
									children: "Read this hand"
								})
							]
						}), lineReport ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-bg-elevated p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: lineReport.ids.map((id, slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, { id }, `${id}-${slot}`))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 tabular text-sm text-muted",
										children: [
											"Score ",
											num(lineReport.score),
											lineReport.partial ? " · partial search" : ""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineList, { line: lineReport.line })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-bg-elevated p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: "Raw outcome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutcomeGrid, { outcome: lineReport.outcome })
								})]
							}),
							lineReport.contribution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-bg-elevated p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-medium",
										children: "Leave-one-out"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: "Score with the card, minus the best line of the hand without it. Positive means the card raised the evaluated outcome."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-3 flex flex-col gap-3",
										children: lineReport.contribution.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-baseline justify-between gap-3 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cardById(row.id).name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular",
												children: num(row.score)
											})]
										}, row.id))
									})
								]
							}) : null,
							lineReport.alts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-bg-elevated p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: "Other lines"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-col gap-4",
									children: lineReport.alts.map((alt, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "tabular text-sm text-muted",
										children: ["Score ", num(alt.score)]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineList, { line: alt.line })] }, index))
								})]
							}) : null
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Run a search or read a hand."
						})]
					}) : null,
					tab === "cards" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-bg-elevated p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-medium",
										children: "Contribution"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: "Mean leave-one-out on the highest-ranked hands. Usage rates cover every searched hand’s best line."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 h-72",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: rows.slice(0, 8),
												layout: "vertical",
												margin: {
													left: 8,
													right: 8
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														type: "number",
														stroke: "var(--color-subtle)",
														tick: {
															fill: "var(--color-muted)",
															fontSize: 12
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
														type: "category",
														dataKey: "name",
														width: 128,
														stroke: "var(--color-subtle)",
														tick: {
															fill: "var(--color-muted)",
															fontSize: 12
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
														cursor: { fill: "transparent" },
														contentStyle: {
															background: "var(--color-bg-elevated)",
															border: "1px solid var(--color-border)",
															color: "var(--color-fg)"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "contribution",
														fill: "var(--color-accent)",
														radius: 4
													})
												]
											})
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-3",
								children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-xl border border-border bg-bg-elevated p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-baseline justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-medium",
												children: row.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-accent",
												children: row.role
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted",
											children: row.because
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 text-sm tabular text-muted",
											children: [
												"Played ",
												pct(row.played),
												" · Pitched ",
												pct(row.pitched),
												" · Blocked ",
												pct(row.blocked),
												" · Arsenal ",
												pct(row.arsenaled),
												" · Kept ",
												pct(row.retained),
												row.discarded ? ` · Discarded ${pct(row.discarded)}` : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-sm tabular",
											children: [
												"Contribution ",
												num(row.contribution),
												" across ",
												row.hands,
												" hands"
											]
										})
									]
								}, row.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-medium",
									children: "How roles are assigned"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 flex flex-col gap-1 text-sm text-muted",
									children: roleRules().map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rule }, rule))
								})]
							})
						]
					}) : null,
					tab === "synergy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynergyList, {
							title: "Pairs",
							note: "Interaction is mean(both) − mean(only A) − mean(only B) + mean(neither). Buckets under 4 hands are omitted.",
							rows: synergy.pairs
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SynergyList, {
							title: "Triples",
							note: "Lift is the triple’s mean score minus the mean of every searched hand.",
							rows: synergy.triples
						})]
					}) : null,
					tab === "patterns" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-medium",
								children: "What the elite hands share"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-col gap-3",
								children: pattern.sentences.map((sentence) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-6",
									children: sentence
								}, sentence))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-4 grid grid-cols-2 gap-3",
								children: pattern.means.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-subtle",
									children: item.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular text-sm",
									children: item.value
								})] }, item.label))
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-6 rounded-xl border border-border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "text-sm font-medium",
							children: "What this does not pretend to be"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-3 text-sm leading-6 text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Talishar is the fan-made PHP rules engine. It does not run in this preview. The ledger uses its own action-phase kernel for the listed Huntsman cards: costs, pitch, action points, the combat chain, go again, contracts, on-hit banishes, arsenal, equipment reactions, and the hero peek." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Search stores raw counts. Nothing in the kernel converts a contract into points. The evaluator is the only place numbers become a score, and every weight is on the controls." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Contract and banish figures are expected values under the prior, unless you force always or never. There is no opponent policy, no decklist, and no multi-turn plan beyond arsenal and ponder. Silver can be cashed only when a whole token was created, not from a fractional expectation." })
							]
						})]
					})
				]
			})]
		})]
	});
}
function PriorSlider({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1 text-sm text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex justify-between",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular text-fg",
				children: [Math.round(value * 100), "%"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min: 0,
			max: 1,
			step: .01,
			value,
			onChange: (event) => onChange(Number(event.target.value)),
			className: "h-11 accent-accent"
		})]
	});
}
function SynergyList({ title, note, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-medium",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: note
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 flex flex-col gap-3",
			children: rows.length ? rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl border border-border bg-bg-elevated p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: row.names
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular text-sm",
						children: num(row.interaction)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						row.note,
						" n=",
						row.n,
						", mean ",
						num(row.mean),
						"."
					]
				})]
			}, row.names)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "text-sm text-muted",
				children: "Not enough hands in each bucket yet."
			})
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerApp, {});
}
//#endregion
export { Home as component };
