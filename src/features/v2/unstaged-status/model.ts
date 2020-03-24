import { createStore, createEvent, createEffect } from "effector";
import {
  createPipePromiseEffect,
  EffectParams,
  EffectResult,
} from "lib/added-effector/create-pipe-promise-effect";
import { runCommandGit, commandPipeToPromise } from "lib/run-command";
import { DiffFile, DiffChunk, DiffLine } from "lib/diff";
import * as consts from "app/const";
import { createStageByPatch } from "lib/added-effector/stage-by-patch";

export type StatusFile = {
  stage: string;
  unstage: string;
  path: string;
  diff: DiffFile | null;
};

export const discard = createPipePromiseEffect<{ paths: string[] }>(
  async ({ paths }, options) => {
    await commandPipeToPromise(
      runCommandGit(
        "stash",
        ["push", "--keep-index", "--include-untracked", "--", ...paths],
        options,
      ),
    );
    return runCommandGit("stash", ["drop"], options);
  },
);
export const stage = createPipePromiseEffect<{ paths: string[] }>(
  ({ paths }, options) => runCommandGit("add", paths, options),
);
export const diff = createEffect<EffectParams<StatusFile>, EffectResult>({
  handler: async ({ params: { path, unstage }, options }) => {
    if (unstage === "?") {
      await commandPipeToPromise(runCommandGit("add", [path], options));

      const result = await commandPipeToPromise(
        runCommandGit(
          "diff",
          ["--diff-algorithm=patience", "--cached", "--", path],
          options,
        ),
      );

      await commandPipeToPromise(
        runCommandGit("reset", ["HEAD", "--", path], options),
      );

      return result;
    }

    return await commandPipeToPromise(
      runCommandGit("diff", ["--diff-algorithm=patience", "--", path], options),
    );
  },
});
export const stageByPatchChunk = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});
export const stageByPatchLine = createStageByPatch({
  pathGitEditor: consts.PATH_GIT_EDITOR,
  pathGitEditorMessage: consts.PATH_GIT_EDITOR_MESSAGE,
});

export const discardChanges = createEvent<StatusFile>();
export const stageChanges = createEvent<StatusFile>();
export const discardAllChanges = createEvent<void>();
export const stageAllChanges = createEvent<void>();
export const getDiff = createEvent<StatusFile>();
export const showDiff = createEvent<string>();
export const hideDiff = createEvent<string>();
export const createPatchByChunk = createEvent<DiffChunk>();
export const createPatchByLine = createEvent<DiffLine>();
export const editAddEditPatch = createEvent<{ path: string }>();

export const $unstagedStatus = createStore<{ ref: Map<string, StatusFile> }>({
  ref: new Map(),
});
export const $discardingChanges = createStore<{ ref: Map<string, StatusFile> }>(
  { ref: new Map() },
);
