import * as React from "react";
import { AutoComplete } from "antd";
import { useStore } from "effector-react";
import { HotKey } from "features/hot-key";

import {
  $filteredCommands,
  searchCommand,
  selectCommand,
  focusInput,
  $textCommand,
  changeTextCommand,
  blurInput,
} from "./model";

export const Commands: React.FC = () => {
  const filteredCommands = useStore($filteredCommands);
  const textCommand = useStore($textCommand);
  const options = filteredCommands.reduce<React.ReactElement[]>(
    (memo, value) => {
      memo.push(
        <AutoComplete.Option key={value.id}>{value.name}</AutoComplete.Option>,
      );

      return memo;
    },
    [],
  );

  const select = React.useCallback((id: any) => {
    // TODO antd doesn't return type SelectValue
    if (typeof id === "string") {
      selectCommand(id);
    }
  }, []);

  const change = React.useCallback((value: any) => {
    // TODO antd doesn't return type SelectValue
    if (typeof value === "string") {
      changeTextCommand(value);
    }
  }, []);

  const focus = React.useCallback(() => focusInput(), []);
  const blur = React.useCallback(() => blurInput(), []);

  const ref = React.useRef<AutoComplete>(null);

  return (
    <HotKey
      command="command+shift+p"
      title="shift+p"
      bindRef={ref}
      action="focus"
    >
      <AutoComplete
        size="small"
        onSearch={searchCommand}
        onSelect={select}
        onFocus={focus}
        onBlur={blur}
        ref={ref}
        value={textCommand}
        onChange={change}
        placeholder="command"
        open={!!options.length}
      >
        {options}
      </AutoComplete>
    </HotKey>
  );
};
