import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CARDS, SPINE_IDS, WEAPONS, cardById, pitchLabel, weaponById } from "@/engine/cards";
import { combinationCount } from "@/engine/discover";
import { defaultConfig } from "@/engine/defaults";
import { OUTCOME_LABELS, neutralWeights, presetWeights, scoreOutcome, subtractOutcome, PRESETS } from "@/engine/evaluate";
import { solveHand } from "@/engine/kernel";
import { cardRows, patterns, roleRules, synergies, withScores } from "@/engine/analyze";
import type { DiscoverResult, HandReport, Line, Outcome, Prior, SearchConfig, Weights } from "@/engine/types";
import { OUTCOME_KEYS } from "@/engine/types";

type Tab = "hands" | "line" | "cards" | "synergy" | "patterns";
type Probe = { ids: string[]; report: HandReport };

const TABS: { id: Tab; label: string }[] = [
  { id: "hands", label: "Hands" },
  { id: "line", label: "Line" },
  { id: "cards", label: "Cards" },
  { id: "synergy", label: "Synergy" },
  { id: "patterns", label: "Patterns" },
];

function num(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const rounded = Math.round(n * 100) / 100;
  if (Math.abs(rounded - Math.round(rounded)) < 0.001) return String(Math.round(rounded));
  return rounded.toFixed(2);
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

function normalizePrior(prior: Prior): Prior {
  const sum = prior.pRed + prior.pYellow + prior.pBlue;
  if (sum <= 0) return { ...prior, pRed: 1 / 3, pYellow: 1 / 3, pBlue: 1 / 3 };
  return { ...prior, pRed: prior.pRed / sum, pYellow: prior.pYellow / sum, pBlue: prior.pBlue / sum };
}

function Pitch({ id }: { id: string }) {
  const card = cardById(id);
  const tone = card.color === "red" ? "text-pitch-r" : card.color === "yellow" ? "text-pitch-y" : card.color === "blue" ? "text-pitch-b" : "text-muted";
  return <span className={`tabular w-4 text-sm font-medium ${tone}`}>{pitchLabel(card.pitch, card.color)}</span>;
}

function Chip({ id }: { id: string }) {
  const card = cardById(id);
  return (
    <span className="inline-flex min-h-8 items-center gap-2 rounded-md border border-border bg-bg-subtle px-2 py-1 text-sm">
      <Pitch id={id} />
      <span>{card.name}</span>
    </span>
  );
}

function LineList({ line, depth = 0 }: { line: Line; depth?: number }) {
  return (
    <div className={depth ? "mt-3 border-l border-border pl-4" : ""}>
      <ol className="flex flex-col gap-2">
        {line.steps.map((step, index) => (
          <li key={`${depth}-${index}`} className="text-sm leading-6">
            <span className="mr-2 tabular text-subtle">{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
      {line.split ? (
        <div className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-muted">{line.split.reason}</p>
          {line.split.options.map((option) => (
            <div key={option.p} className="rounded-md bg-bg-subtle p-3">
              <p className="mb-2 text-sm font-medium tabular">{pct(option.p)} branch</p>
              <LineList line={option.line} depth={depth + 1} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function OutcomeGrid({ outcome }: { outcome: Outcome }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
      {OUTCOME_KEYS.map((key) => (
        <div key={key}>
          <dt className="text-xs text-subtle">{OUTCOME_LABELS[key]}</dt>
          <dd className={`tabular text-sm ${outcome[key] === 0 ? "text-subtle" : "text-fg"}`}>{num(outcome[key])}</dd>
        </div>
      ))}
    </dl>
  );
}

export function LedgerApp() {
  const initial = defaultConfig();
  const [weights, setWeights] = useState<Weights>(initial.weights);
  const [preset, setPreset] = useState("neutral");
  const [prior, setPrior] = useState<Prior>(initial.prior);
  const [weaponId, setWeaponId] = useState(initial.weaponId);
  const [blacktek, setBlacktek] = useState(false);
  const [mask, setMask] = useState(false);
  const [flick, setFlick] = useState(false);
  const [marked, setMarked] = useState(false);
  const [incoming, setIncoming] = useState(0);
  const [phaseMode, setPhaseMode] = useState<SearchConfig["phaseMode"]>("action");
  const [pool, setPool] = useState<string[]>(SPINE_IDS);
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("hands");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [picked, setPicked] = useState(0);
  const [staleWeights, setStaleWeights] = useState(false);
  const [probeSlots, setProbeSlots] = useState<string[]>(["lnw-r", "coercive-b", "codex-y", "sigil-b"]);
  const [probe, setProbe] = useState<Probe | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const config = useMemo<SearchConfig>(
    () => ({
      ...defaultConfig(),
      weights,
      prior: normalizePrior(prior),
      weaponId,
      equipment: { blacktek, mask, flick },
      marked,
      incoming,
      phaseMode,
    }),
    [weights, prior, weaponId, blacktek, mask, flick, marked, incoming, phaseMode],
  );

  const ranked = useMemo(() => (result ? withScores(result.hands, weights) : []), [result, weights]);
  const rows = useMemo(() => cardRows(ranked), [ranked]);
  const synergy = useMemo(() => synergies(ranked), [ranked]);
  const pattern = useMemo(() => patterns(ranked), [ranked]);
  const possible = combinationCount(pool.length, 4);
  const selected = ranked[picked] ?? ranked[0];

  function runSearch(nextPool = pool, nextConfig = config) {
    if (nextPool.length < 4) {
      setError("Check at least four cards. The discovery search builds 4-card hands from the checked pool.");
      return;
    }
    setError(null);
    setRunning(true);
    setProgress({ done: 0, total: Math.min(possible, nextConfig.exhaustCap) });
    setStaleWeights(false);
    workerRef.current?.terminate();
    const worker = new Worker(new URL("../../engine/worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<{ type: string; done?: number; total?: number; result?: DiscoverResult; message?: string }>) => {
      const data = event.data;
      if (data.type === "progress" && data.done != null && data.total != null) {
        setProgress({ done: data.done, total: data.total });
      } else if (data.type === "done" && data.result) {
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
    worker.postMessage({ cardIds: nextPool, config: nextConfig });
  }

  useEffect(() => {
    runSearch(SPINE_IDS, { ...defaultConfig(), weights: neutralWeights() });
    return () => workerRef.current?.terminate();
    // Mount-only. A second strict-mode pass starts a fresh worker after cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyPreset(id: string) {
    setPreset(id);
    setWeights(id === "neutral" ? neutralWeights() : presetWeights(id));
    if (result) setStaleWeights(true);
  }

  function updateWeight(key: keyof Weights, value: number) {
    setPreset("custom");
    setWeights((current) => ({ ...current, [key]: value }));
    if (result) setStaleWeights(true);
  }

  function togglePool(id: string) {
    setPool((current) => (current.includes(id) ? current.filter((card) => card !== id) : [...current, id]));
  }

  function readProbe() {
    const ids = probeSlots.filter(Boolean);
    if (!ids.length) return;
    const full = solveHand(ids, config);
    const contribution = ids.map((id, index) => {
      const rest = ids.filter((_, slot) => slot !== index);
      const ablated = solveHand(rest, config);
      const delta = subtractOutcome(full.outcome, ablated.outcome);
      return { id, delta, score: scoreOutcome(delta, config.weights) };
    });
    const report: HandReport = {
      ids,
      iids: ids.map((_, index) => index),
      score: full.score,
      outcome: full.outcome,
      line: full.line,
      alts: full.alts,
      uses: [],
      partial: full.partial,
      contribution,
    };
    setProbe({ ids, report });
    setTab("line");
  }

  const lineReport = probe?.report ?? selected;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-subtle">ARAKNI, HUNTSMAN</p>
          <h1 className="mt-1 text-4xl font-medium tracking-tight text-fg">Huntsman Ledger</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            Four-card hands, legal lines, and raw outcomes. The search records what happened. The weights below decide what that is worth.
          </p>
        </div>
        <button
          type="button"
          onClick={() => runSearch()}
          disabled={running}
          className="inline-flex h-11 items-center justify-center rounded-md bg-fg px-5 text-sm font-medium text-bg disabled:opacity-60"
        >
          {running ? `Searching ${progress?.done ?? 0} / ${progress?.total ?? "…"}` : "Run discovery"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="order-2 flex flex-col gap-3 lg:order-1">
          <section className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="text-lg font-medium">Evaluator</h2>
            <p className="mt-1 text-sm text-muted">A hypothesis applied after the line is found. It also breaks ties inside the search.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={preset === item.id}
                  onClick={() => applyPreset(item.id)}
                  className={`h-10 rounded-md px-3 text-sm ${preset === item.id ? "bg-fg text-bg" : "border border-border text-fg"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted">{PRESETS.find((item) => item.id === preset)?.note ?? "Custom weights. Re-run so the search follows them."}</p>
            {staleWeights ? <p className="mt-2 text-sm text-accent">Ranks updated from stored lines. Run again to search under these weights.</p> : null}
          </section>

          <details className="rounded-xl border border-border bg-bg-elevated p-4">
            <summary className="text-lg font-medium">Weights</summary>
            <div className="mt-3 flex flex-col gap-3">
              {OUTCOME_KEYS.map((key) => (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span className="flex items-center justify-between text-muted">
                    {OUTCOME_LABELS[key]}
                    <span className="tabular text-fg">{num(weights[key])}</span>
                  </span>
                  <input
                    type="range"
                    min={-2}
                    max={5}
                    step={0.1}
                    value={weights[key]}
                    onChange={(event) => updateWeight(key, Number(event.target.value))}
                    className="h-11 accent-accent"
                  />
                </label>
              ))}
            </div>
          </details>

          <section className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="text-lg font-medium">Board</h2>
            <label className="mt-3 flex flex-col gap-1 text-sm text-muted">
              Weapon
              <select
                value={weaponId}
                onChange={(event) => setWeaponId(event.target.value)}
                className="h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg"
              >
                {WEAPONS.map((weapon) => (
                  <option key={weapon.id} value={weapon.id}>
                    {weapon.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="mt-2 text-sm text-muted">{weaponById(weaponId).text}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" checked={blacktek} onChange={(event) => setBlacktek(event.target.checked)} />
                Blacktek Whisperers ready
              </label>
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" checked={mask} onChange={(event) => setMask(event.target.checked)} />
                Mask of Perdition ready
              </label>
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" checked={flick} onChange={(event) => setFlick(event.target.checked)} />
                Flick Knives ready
              </label>
              <label className="flex min-h-11 items-center gap-3">
                <input type="checkbox" checked={marked} onChange={(event) => setMarked(event.target.checked)} />
                Opponent starts marked
              </label>
            </div>
            <label className="mt-2 flex flex-col gap-1 text-sm text-muted">
              Phase
              <select
                value={phaseMode}
                onChange={(event) => setPhaseMode(event.target.value as SearchConfig["phaseMode"])}
                className="h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg"
              >
                <option value="action">Your action phase</option>
                <option value="defense">Defense step only</option>
                <option value="cycle">Defend, then act</option>
              </select>
            </label>
            <label className="mt-3 flex flex-col gap-1 text-sm text-muted">
              <span className="flex justify-between">Incoming attack <span className="tabular text-fg">{incoming}</span></span>
              <input type="range" min={0} max={12} step={1} value={incoming} onChange={(event) => setIncoming(Number(event.target.value))} className="h-11 accent-accent" />
            </label>
          </section>

          <details className="rounded-xl border border-border bg-bg-elevated p-4">
            <summary className="text-lg font-medium">Opponent prior</summary>
            <p className="mt-2 text-sm text-muted">Expected banishes use this mix. It is not a point value.</p>
            <div className="mt-3 flex flex-col gap-3">
              <PriorSlider label="Red cards" value={prior.pRed} onChange={(value) => setPrior({ ...prior, pRed: value })} />
              <PriorSlider label="Yellow cards" value={prior.pYellow} onChange={(value) => setPrior({ ...prior, pYellow: value })} />
              <PriorSlider label="Blue cards" value={prior.pBlue} onChange={(value) => setPrior({ ...prior, pBlue: value })} />
              <PriorSlider label="Attack actions" value={prior.pAttackAction} onChange={(value) => setPrior({ ...prior, pAttackAction: value })} />
              <PriorSlider label="Non-attack actions" value={prior.pNonAttackAction} onChange={(value) => setPrior({ ...prior, pNonAttackAction: value })} />
              <PriorSlider label="Base go again" value={prior.pGoAgain} onChange={(value) => setPrior({ ...prior, pGoAgain: value })} />
              <PriorSlider label="Cost 1 or less" value={prior.pCostLe1} onChange={(value) => setPrior({ ...prior, pCostLe1: value })} />
              <PriorSlider label="Defense 2 or less" value={prior.pDefLe2} onChange={(value) => setPrior({ ...prior, pDefLe2: value })} />
              <PriorSlider label="Has an arsenal" value={prior.pArsenal} onChange={(value) => setPrior({ ...prior, pArsenal: value })} />
              <PriorSlider label="Named card on top" value={prior.pNamed} onChange={(value) => setPrior({ ...prior, pNamed: value })} />
              <label className="flex flex-col gap-1 text-sm text-muted">
                <span className="flex justify-between">Block per attack <span className="tabular text-fg">{prior.blockPerAttack}</span></span>
                <input type="range" min={0} max={8} step={1} value={prior.blockPerAttack} onChange={(event) => setPrior({ ...prior, blockPerAttack: Number(event.target.value) })} className="h-11 accent-accent" />
              </label>
              <label className="flex flex-col gap-1 text-sm text-muted">
                Contract resolution
                <select
                  value={prior.connect}
                  onChange={(event) => setPrior({ ...prior, connect: event.target.value as Prior["connect"] })}
                  className="h-11 rounded-md border border-border bg-bg-subtle px-3 text-fg"
                >
                  <option value="prior">Use the prior</option>
                  <option value="always">Always connect</option>
                  <option value="never">Never connect</option>
                </select>
              </label>
            </div>
          </details>

          <section className="rounded-xl border border-border bg-bg-elevated p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-medium">Pool</h2>
              <p className="tabular text-xs text-subtle">{pool.length} cards · {possible.toLocaleString()} hands</p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {possible > config.exhaustCap
                ? `Above ${config.exhaustCap} hands, a seeded sample of ${config.sampleSize} is searched.`
                : "Every 4-card combination of the checked cards is searched."}
            </p>
            <div className="mt-3 flex flex-col">
              {CARDS.map((card) => {
                const on = pool.includes(card.id);
                return (
                  <div key={card.id} className="border-t border-border first:border-t-0">
                    <div className="flex items-center gap-2">
                      <label className="flex min-h-11 flex-1 items-center gap-3 text-sm">
                        <input type="checkbox" checked={on} onChange={() => togglePool(card.id)} />
                        <Pitch id={card.id} />
                        <span className="flex-1">{card.name}</span>
                        <span className="tabular text-subtle">{card.cost}/{card.power || "–"}</span>
                      </label>
                      <button type="button" className="h-10 px-2 text-xs text-muted" onClick={() => setOpenCard(openCard === card.id ? null : card.id)}>
                        {openCard === card.id ? "Hide" : "Text"}
                      </button>
                    </div>
                    {openCard === card.id ? <p className="pb-3 text-sm leading-6 text-muted">{card.text}</p> : null}
                  </div>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          <div className="flex gap-2 overflow-x-auto pb-3" role="tablist" aria-label="Results">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                onClick={() => setTab(item.id)}
                className={`h-11 shrink-0 rounded-md px-4 text-sm ${tab === item.id ? "bg-fg text-bg" : "border border-border text-fg"}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error ? <p className="mb-4 rounded-md border border-border bg-bg-subtle p-3 text-sm">{error}</p> : null}

          {result ? (
            <p className="mb-4 text-sm text-muted">
              {result.meta.exhaustive ? "Exhaustive" : "Sampled"} {result.meta.handsSearched.toLocaleString()} of {result.meta.handsPossible.toLocaleString()} hands
              {" · "}
              {weaponById(result.meta.weaponId).name}
              {" · "}
              {result.meta.connect}
              {" · "}
              {(result.meta.ms / 1000).toFixed(1)}s
              {result.meta.partialHands ? ` · ${result.meta.partialHands} hands hit the node budget` : ""}
            </p>
          ) : (
            <p className="mb-4 text-sm text-muted">{running ? "Walking legal lines…" : "The first pass starts on its own."}</p>
          )}

          {tab === "hands" ? (
            <div className="flex flex-col gap-3">
              {ranked.slice(0, 40).map((hand, index) => (
                <button
                  key={hand.ids.join("-") + index}
                  type="button"
                  onClick={() => {
                    setPicked(index);
                    setProbe(null);
                    setTab("line");
                  }}
                  className={`rounded-xl border p-4 text-left ${picked === index && !probe ? "border-accent bg-bg-elevated" : "border-border bg-bg-elevated"}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="display text-2xl font-medium tabular">{index + 1}</span>
                    <span className="tabular text-sm text-muted">{num(hand.score)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hand.ids.map((id, slot) => (
                      <Chip key={`${id}-${slot}`} id={id} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted tabular">
                    {num(hand.outcome.damage)} damage · {num(hand.outcome.contractsCompleted)} contracts · {num(hand.outcome.cardsBanished)} banished · {num(hand.outcome.cardsInHand)} in hand · {num(hand.outcome.cardsInArsenal)} arsenal
                  </p>
                </button>
              ))}
              {!ranked.length && !running ? <p className="text-sm text-muted">No hands yet.</p> : null}
            </div>
          ) : null}

          {tab === "line" ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <h2 className="text-lg font-medium">{probe ? "Probed hand" : `Hand ${picked + 1}`}</h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  {probeSlots.map((id, index) => (
                    <select
                      key={index}
                      value={id}
                      onChange={(event) => {
                        const next = probeSlots.slice();
                        next[index] = event.target.value;
                        setProbeSlots(next);
                      }}
                      className="h-11 rounded-md border border-border bg-bg-subtle px-2 text-sm text-fg"
                    >
                      <option value="">Empty</option>
                      {CARDS.map((card) => (
                        <option key={card.id} value={card.id}>
                          {pitchLabel(card.pitch, card.color)} {card.name}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
                <button type="button" onClick={readProbe} className="mt-3 h-11 rounded-md border border-border px-4 text-sm">
                  Read this hand
                </button>
              </div>
              {lineReport ? (
                <>
                  <div className="rounded-xl border border-border bg-bg-elevated p-4">
                    <div className="flex flex-wrap gap-2">
                      {lineReport.ids.map((id, slot) => (
                        <Chip key={`${id}-${slot}`} id={id} />
                      ))}
                    </div>
                    <p className="mt-3 tabular text-sm text-muted">Score {num(lineReport.score)}{lineReport.partial ? " · partial search" : ""}</p>
                    <div className="mt-4">
                      <LineList line={lineReport.line} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-bg-elevated p-4">
                    <h2 className="text-lg font-medium">Raw outcome</h2>
                    <div className="mt-3">
                      <OutcomeGrid outcome={lineReport.outcome} />
                    </div>
                  </div>
                  {lineReport.contribution ? (
                    <div className="rounded-xl border border-border bg-bg-elevated p-4">
                      <h2 className="text-lg font-medium">Leave-one-out</h2>
                      <p className="mt-1 text-sm text-muted">Score with the card, minus the best line of the hand without it. Positive means the card raised the evaluated outcome.</p>
                      <ul className="mt-3 flex flex-col gap-3">
                        {lineReport.contribution.map((row) => (
                          <li key={row.id} className="flex items-baseline justify-between gap-3 text-sm">
                            <span>{cardById(row.id).name}</span>
                            <span className="tabular">{num(row.score)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {lineReport.alts.length ? (
                    <div className="rounded-xl border border-border bg-bg-elevated p-4">
                      <h2 className="text-lg font-medium">Other lines</h2>
                      <div className="mt-3 flex flex-col gap-4">
                        {lineReport.alts.map((alt, index) => (
                          <div key={index}>
                            <p className="tabular text-sm text-muted">Score {num(alt.score)}</p>
                            <LineList line={alt.line} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-muted">Run a search or read a hand.</p>
              )}
            </div>
          ) : null}

          {tab === "cards" ? (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-bg-elevated p-4">
                <h2 className="text-lg font-medium">Contribution</h2>
                <p className="mt-1 text-sm text-muted">Mean leave-one-out on the highest-ranked hands. Usage rates cover every searched hand’s best line.</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 8 }}>
                      <XAxis type="number" stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" width={128} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
                      <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-fg)" }} />
                      <Bar dataKey="contribution" fill="var(--color-accent)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <ul className="flex flex-col gap-3">
                {rows.map((row) => (
                  <li key={row.id} className="rounded-xl border border-border bg-bg-elevated p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-base font-medium">{row.name}</h3>
                      <span className="text-sm text-accent">{row.role}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{row.because}</p>
                    <p className="mt-2 text-sm tabular text-muted">
                      Played {pct(row.played)} · Pitched {pct(row.pitched)} · Blocked {pct(row.blocked)} · Arsenal {pct(row.arsenaled)} · Kept {pct(row.retained)}
                      {row.discarded ? ` · Discarded ${pct(row.discarded)}` : ""}
                    </p>
                    <p className="mt-1 text-sm tabular">Contribution {num(row.contribution)} across {row.hands} hands</p>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-border p-4">
                <h2 className="text-lg font-medium">How roles are assigned</h2>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-muted">
                  {roleRules().map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {tab === "synergy" ? (
            <div className="flex flex-col gap-6">
              <SynergyList title="Pairs" note="Interaction is mean(both) − mean(only A) − mean(only B) + mean(neither). Buckets under 4 hands are omitted." rows={synergy.pairs} />
              <SynergyList title="Triples" note="Lift is the triple’s mean score minus the mean of every searched hand." rows={synergy.triples} />
            </div>
          ) : null}

          {tab === "patterns" ? (
            <div className="rounded-xl border border-border bg-bg-elevated p-4">
              <h2 className="text-lg font-medium">What the elite hands share</h2>
              <div className="mt-3 flex flex-col gap-3">
                {pattern.sentences.map((sentence) => (
                  <p key={sentence} className="text-sm leading-6">{sentence}</p>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                {pattern.means.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-subtle">{item.label}</dt>
                    <dd className="tabular text-sm">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <details className="mt-6 rounded-xl border border-border p-4">
            <summary className="text-sm font-medium">What this does not pretend to be</summary>
            <div className="mt-3 flex flex-col gap-3 text-sm leading-6 text-muted">
              <p>
                Talishar is the fan-made PHP rules engine. It does not run in this preview. The ledger uses its own action-phase kernel for the listed Huntsman cards: costs, pitch, action points, the combat chain, go again, contracts, on-hit banishes, arsenal, equipment reactions, and the hero peek.
              </p>
              <p>
                Search stores raw counts. Nothing in the kernel converts a contract into points. The evaluator is the only place numbers become a score, and every weight is on the controls.
              </p>
              <p>
                Contract and banish figures are expected values under the prior, unless you force always or never. There is no opponent policy, no decklist, and no multi-turn plan beyond arsenal and ponder. Silver can be cashed only when a whole token was created, not from a fractional expectation.
              </p>
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}

function PriorSlider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-muted">
      <span className="flex justify-between">{label}<span className="tabular text-fg">{Math.round(value * 100)}%</span></span>
      <input type="range" min={0} max={1} step={0.01} value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-11 accent-accent" />
    </label>
  );
}

function SynergyList({ title, note, rows }: { title: string; note: string; rows: { names: string; n: number; mean: number; interaction: number; note: string }[] }) {
  return (
    <div>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-1 text-sm text-muted">{note}</p>
      <ul className="mt-3 flex flex-col gap-3">
        {rows.length ? rows.map((row) => (
          <li key={row.names} className="rounded-xl border border-border bg-bg-elevated p-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-medium">{row.names}</h3>
              <span className="tabular text-sm">{num(row.interaction)}</span>
            </div>
            <p className="mt-1 text-sm text-muted">{row.note} n={row.n}, mean {num(row.mean)}.</p>
          </li>
        )) : <li className="text-sm text-muted">Not enough hands in each bucket yet.</li>}
      </ul>
    </div>
  );
}
