import * as React from "react";
import { useStore } from "effector-react";
import { Spin } from "antd";

import { init, $cwd, $pendingReadSettings } from "../model";
import { DefaultSetup } from "./default-setup";

export const Settings: React.FC = ({ children }) => {
  const cwd = useStore($cwd);
  const pendingReadSettings = useStore($pendingReadSettings);

  React.useEffect(() => init(), []);

  if (pendingReadSettings !== false) {
    return <Spin />;
  }

  if (!cwd) {
    return <DefaultSetup />;
  }

  return <>{children}</>;
};
