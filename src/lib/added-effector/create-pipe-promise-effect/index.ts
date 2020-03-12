import { createEffect } from "effector";
import {
  RunCommandOptions,
  PipeValue,
  commandPipeToPromise,
} from "lib/run-command";
import { Pipe, ResolverStoreItem } from "lib/pipe";

export type Callback<P = void> = (
  params: P,
  options?: RunCommandOptions,
) => Pipe<PipeValue>;

export type EffectParams<P = void> = {
  params: P;
  options?: RunCommandOptions;
};

export type EffectResult = ResolverStoreItem<string>[];

export const createPipePromiseEffect = <P = void>(cb: Callback<P>) =>
  createEffect<EffectParams<P>, EffectResult>({
    handler: ({ params, options }: EffectParams<P>) =>
      commandPipeToPromise(cb(params, options)),
  });