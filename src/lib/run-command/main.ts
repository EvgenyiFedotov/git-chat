import { spawn, SpawnOptionsWithoutStdio } from "child_process";

export interface RunCommandScope {
  command: string;
  args?: string[];
  options: RunCommandOptions;
  log: RunCommandLogItem[];
}

export type RunCommandOnBefore = (_: RunCommandScope) => void;
export type RunCommandOnData = (value: string, _: RunCommandScope) => void;
export type RunCommandOnError = (error: Error, _: RunCommandScope) => void;
export type RunCommandOnClose = (code: number, _: RunCommandScope) => void;

export interface RunCommandOptions {
  commandOptions?: {
    key?: string;
    onBefore?: RunCommandOnBefore;
    onData?: RunCommandOnData;
    onError?: RunCommandOnError;
    onClose?: RunCommandOnClose;
  };
  spawnOptions?: SpawnOptionsWithoutStdio;
}

export type RunCommandCallbackChannel = "main" | "stdout" | "stderr";

export type RunCommandCallback<V = any> = (
  value: V,
  _: {
    channel: RunCommandCallbackChannel;
    scope: RunCommandScope;
  },
) => void;

export interface RunCommandResult {
  data: (cb: RunCommandCallback<string>) => RunCommandResult;
  error: (cb: RunCommandCallback<Error>) => RunCommandResult;
  close: (cb: RunCommandCallback<number>) => RunCommandResult;
}

export interface RunCommandLogItem {
  type: "data" | "error" | "close";
  channel: RunCommandCallbackChannel;
  data: string | Error | number;
}

export function runCommand(
  command: string,
  options?: RunCommandOptions,
): RunCommandResult;
export function runCommand(command: string, args?: string[]): RunCommandResult;
export function runCommand(
  command: string,
  args?: string[],
  options?: RunCommandOptions,
): RunCommandResult;
export function runCommand(
  command: string,
  _args?: RunCommandOptions | string[],
  _options: RunCommandOptions = {},
): RunCommandResult {
  const args = isOptions(_args) ? [] : _args || [];
  const options = isOptions(_args) ? _args : _options;

  const { commandOptions = {}, spawnOptions } = options;
  const {
    onBefore = () => {},
    onData = () => {},
    onError = () => {},
    onClose = () => {},
  } = commandOptions;

  const dataCallbacks: RunCommandCallback<string>[] = [];
  const errorCallbacks: RunCommandCallback<Error>[] = [];
  const closeCallbacks: RunCommandCallback<number>[] = [];

  const log: RunCommandLogItem[] = [];
  const scope = { command, args, options, log };

  onBefore(scope);

  const childProcess = spawn(command, args, spawnOptions);

  childProcess.stdout.on("data", (data: Buffer) => {
    const dataString = data.toString();
    log.push({ type: "data", channel: "stdout", data: dataString });
    dataCallbacks.forEach((cb) => cb(dataString, { channel: "stdout", scope }));
    onData(dataString, scope);
  });
  childProcess.stdout.on("error", (error) => {
    log.push({ type: "error", channel: "stdout", data: error });
    errorCallbacks.forEach((cb) => cb(error, { channel: "stdout", scope }));
    onError(error, scope);
  });

  childProcess.stderr.on("data", (data: Buffer) => {
    const dataString = data.toString();
    log.push({ type: "data", channel: "stderr", data: dataString });
    dataCallbacks.forEach((cb) => cb(dataString, { channel: "stderr", scope }));
    onData(dataString, scope);
  });
  childProcess.stdout.on("error", (error) => {
    log.push({ type: "error", channel: "stderr", data: error });
    errorCallbacks.forEach((cb) => cb(error, { channel: "stderr", scope }));
    onError(error, scope);
  });

  childProcess.on("close", (code) => {
    log.push({ type: "close", channel: "main", data: code });
    closeCallbacks.forEach((cb) => cb(code, { channel: "main", scope }));
    onClose(code, scope);
  });

  const result: RunCommandResult = {
    data: (cb) => {
      dataCallbacks.push(cb);
      return result;
    },

    error: (cb) => {
      errorCallbacks.push(cb);
      return result;
    },

    close: (cb) => {
      closeCallbacks.push(cb);
      return result;
    },
  };

  return result;
}

export function isOptions(x: any): x is RunCommandOptions {
  return x && !(x instanceof Array);
}
