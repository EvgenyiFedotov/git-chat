import { runCommandGit, RunCommandOptions } from "lib/run-command";

export interface RevParseOptions {
  commandOptions?: RunCommandOptions;
  mode?: "branch" | "commitHash";
}

export const revParse = (options: RevParseOptions = {}) => {
  const args = createArgs(options);

  return runCommandGit("rev-parse", args, options.commandOptions);
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
