import { discover } from "./discover.ts";
import type { DiscoverResult, SearchConfig } from "./types.ts";

type Request = { cardIds: string[]; config: SearchConfig };
type Progress = { type: "progress"; done: number; total: number };
type Done = { type: "done"; result: DiscoverResult };
type Fail = { type: "error"; message: string };

self.onmessage = (event: MessageEvent<Request>) => {
  const { cardIds, config } = event.data;
  try {
    const result = discover(cardIds, config, (done, total) => {
      const message: Progress = { type: "progress", done, total };
      self.postMessage(message);
    });
    const message: Done = { type: "done", result };
    self.postMessage(message);
  } catch (error) {
    const message: Fail = {
      type: "error",
      message: error instanceof Error ? error.message : "Search failed",
    };
    self.postMessage(message);
  }
};
