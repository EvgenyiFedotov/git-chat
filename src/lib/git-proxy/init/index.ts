import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface InitOptions extends RunCommandOptions {}

export const init = (options: InitOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("init", args, options);
};

function createArgs(options: InitOptions = {}) {
  return [];
}
