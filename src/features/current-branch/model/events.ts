import { createRunCommandEvent } from "features/run-command-options";
import { RevParseParams } from "lib/git-proxy/rev-parse";

import { revParse } from "./effects";

export const getCurrentBranch = createRunCommandEvent<RevParseParams>(
  revParse,
  () => ({
    mode: "branch",
  }),
);
