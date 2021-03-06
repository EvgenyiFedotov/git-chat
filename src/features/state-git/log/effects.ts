import { createEffect } from "effector";

import { CommitOptions, commit as commitGit } from "lib/api-git";

export const commit = createEffect<CommitOptions, void>({
  handler: (options) =>
    new Promise((resolve, reject) => {
      commitGit(options).end((code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(code);
        }
      });
    }),
});
