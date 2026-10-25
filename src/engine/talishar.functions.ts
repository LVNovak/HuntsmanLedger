import { createServerFn } from "@tanstack/react-start";

const TALISHAR_URL = process.env.TALISHAR_URL ?? "http://127.0.0.1:8090/game/LedgerSearch.php";

export type TalisharFormat = { id: string; name: string };
export type TalisharHero = { heroId: string; name: string; class: string; young: boolean };
export type TalisharCard = {
  id: string;
  name: string;
  type: string;
  pitch: number;
  cost: number;
  rarity: string;
};

type TalisharResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function callTalishar<T>(body: Record<string, unknown>): Promise<TalisharResult<T>> {
  try {
    const response = await fetch(TALISHAR_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as T & { error?: string };
    if (!response.ok) {
      return { ok: false, error: payload.error ?? `Talishar returned ${response.status}.` };
    }
    return { ok: true, data: payload };
  } catch {
    return {
      ok: false,
      error: "Talishar is not running on this machine. Discovery is still using the built-in Huntsman model.",
    };
  }
}

export const talisharFormats = createServerFn({ method: "POST" }).handler(async () => {
  return callTalishar<{ formats: TalisharFormat[] }>({ op: "formats" });
});

export const talisharHeroes = createServerFn({ method: "POST" })
  .validator((input: { format: string }) => input)
  .handler(async ({ data }) => {
    return callTalishar<{ format: string; heroes: TalisharHero[] }>({ op: "heroes", format: data.format });
  });

export const talisharCatalog = createServerFn({ method: "POST" })
  .validator((input: { format: string; heroId: string }) => input)
  .handler(async ({ data }) => {
    return callTalishar<{
      format: string;
      heroId: string;
      deck: TalisharCard[];
      weapons: TalisharCard[];
      equipment: TalisharCard[];
    }>({ op: "catalog", format: data.format, heroId: data.heroId });
  });
