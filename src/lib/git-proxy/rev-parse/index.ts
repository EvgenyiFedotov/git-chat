import { runCommandGit, RunCommandOptions } from "lib/run-command-v2";

export interface RevParseOptions extends RunCommandOptions {
  mode?: "branch" | "commitHash";
}

export const revParse = (options: RevParseOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("rev-parse", args, options);
};

function createArgs(options: RevParseOptions = {}): string[] {
  const { mode = "branch" } = options;

  switch (mode) {
    case "branch":
      return ["--abbrev-ref", "HEAD"];
    case "commitHash":
      return ["--verify", "HEAD"];
  }
}