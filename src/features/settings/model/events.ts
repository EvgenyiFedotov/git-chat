import { createEvent } from "effector";
import { createCommand } from "features/commands";

export type HotKey = {
  type: "command";
  targetId: string;
  command: string;
};

export const init = createEvent<void>();
// TODO Maybe move to 'features/path-repo'
export const selectCwd = createEvent<void>();
export const changedCwd = createEvent<string | null>();
export const changePathRepo = createCommand(
  "change path repo",
  "changePathRepo",
);