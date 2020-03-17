import { diffWords } from "diff";
import { v4 as uuid } from "uuid";
import { EffectResult } from "lib/added-effector/create-pipe-promise-effect";
import { Change } from "diff";

export type DiffLine = {
  id: string;
  action: null | "removed" | "added";
  line: string;
  removedNumLine: number | null;
  addedNumLine: number | null;
  diff: Change[] | null;
  chunk: DiffChunk;
};
export type DiffChunk = {
  id: string;
  header: string;
  lines: DiffLine[];
  file: DiffFile;
};
export type DiffFile = {
  path: string;
  info: string;
  chunks: DiffChunk[];
};

export function parseResult(result: EffectResult): DiffFile[] {
  const data = result
    .filter(({ action }) => action === "data")
    .map(({ value }) => value)
    .reduce<string[]>((memo, value) => [...memo, value], []);

  return data
    .map((value) => value.split("diff --git ").filter(Boolean))
    .reduce<string[]>((memo, value) => [...memo, ...value], [])
    .map(parseFile);
}

export function parseFile(value: string): DiffFile {
  const [info, ...chunks] = value.split("\n@@");
  const [pathA] = info.split(" ");

  const diffFile: DiffFile = {
    path: pathA.slice(2),
    info: `diff --git ${info}`,
    chunks: [],
  };

  diffFile.chunks = chunks.map((value) => parseChunk(value, diffFile));

  return diffFile;
}

export function parseChunk(value: string, file: DiffFile): DiffChunk {
  const [header, ...lines] = value.split("\n");

  lines.pop();

  const diffChunk: DiffChunk = {
    id: uuid(),
    header: `@@${header}`,
    file,
    lines: [],
  };

  diffChunk.lines = buildScopeLines(lines, parseHeader(header), diffChunk);

  return diffChunk;
}

type HeaderChunk = {
  removedRow: number;
  addedRow: number;
};

export function parseHeader(value: string): HeaderChunk {
  const [remove, add] = value
    .split(" @@")[0]
    .trim()
    .split(" ")
    .map((value) => value.trim());

  return {
    removedRow: parseInt(remove.split(",")[0], 10) * -1,
    addedRow: parseInt(add.split(",")[0], 10),
  };
}

export function buildScopeLines(
  lines: string[],
  header: HeaderChunk,
  chunk: DiffChunk,
): DiffLine[] {
  let removedRow = header.removedRow;
  let addedRow = header.addedRow;
  let removedIndex = 0;
  let addedIndex = 0;
  const scope: DiffLine[] = [];
  let stackLines: DiffLine[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const action = toLineAction(line[0]);
    let removedNumLine = null;
    let addedNumLine = null;

    if (action === null) {
      removedNumLine = removedRow + removedIndex;
      addedNumLine = addedRow + addedIndex;
      removedIndex += 1;
      addedIndex += 1;
    } else if (action === "removed") {
      removedNumLine = removedRow + removedIndex;
      removedIndex += 1;
    } else if (action === "added") {
      addedNumLine = addedRow + addedIndex;
      addedIndex += 1;
    }

    const scopeLine: DiffLine = {
      id: uuid(),
      action,
      line: line.slice(1),
      removedNumLine,
      addedNumLine,
      diff: null,
      chunk,
    };

    scope.push(scopeLine);

    if (action === null) {
      stackLines = [];
    } else if (action === "removed") {
      stackLines.push(scopeLine);
    } else if (action === "added" && stackLines[0]) {
      const diff = diffWords(stackLines[0].line, scopeLine.line);

      stackLines[0].diff = diff;
      scopeLine.diff = diff;

      stackLines.shift();
    }
  }

  return scope;
}

function toLineAction(value: string) {
  switch (value) {
    case "-":
      return "removed";
    case "+":
      return "added";
    default:
      return null;
  }
}