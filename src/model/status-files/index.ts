import { createCommandEffect } from "lib/added-effector/command-effect";
import * as ef from "effector";

import { StatusFile } from "../types";

export const gitStatus = createCommandEffect("git", () => [
  "status",
  "-s",
  "-u",
]);

export const loadStatusFiles = ef.createEvent<void>();

export const $statusFiles = ef.createStore<StatusFile[]>([]);
export const $unstagedFiles = $statusFiles.map((statusFiles) => {
  return statusFiles.filter(({ unstage }) => unstage !== " ");
});
export const $stagedFiles = $statusFiles.map((statusFiles) => {
  return statusFiles.filter(({ stage }) => stage !== " " && stage !== "?");
});