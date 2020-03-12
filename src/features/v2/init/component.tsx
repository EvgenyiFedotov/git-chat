import * as React from "react";
import { loadBranches } from "features/v2/branches";
import { $cwd } from "features/v2/settings";
import { useStore } from "effector-react";
import styled from "styled-components";
import { Button, Spin } from "antd";
import mousetrap from "mousetrap";
import { selectPathRepo } from "features/v2/path-repo";
import { initSettings, $pendingReadSettings } from "features/v2/settings";
import { getStatusS } from "features/v2/status";

export const Init: React.FC = ({ children }) => {
  const pendingReadSettings = useStore($pendingReadSettings);

  React.useEffect(() => initSettings(), []);

  if (pendingReadSettings !== false) {
    return <Spin />;
  }

  return <Setup>{children}</Setup>;
};

const Setup: React.FC = ({ children }) => {
  const cwd = useStore($cwd);

  if (!cwd) {
    return (
      <Container>
        <SetupPathRepo />
      </Container>
    );
  }

  return <AfterSetup>{children}</AfterSetup>;
};

const AfterSetup: React.FC = ({ children }) => {
  React.useEffect(() => {
    loadBranches();
    getStatusS();
  }, []);

  return <>{children}</>;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const SetupPathRepo: React.FC = () => {
  const click = React.useCallback(() => selectPathRepo(), []);

  React.useEffect(() => {
    mousetrap.bind("enter", () => selectPathRepo());

    return () => {
      mousetrap.unbind("enter");
    };
  });

  return (
    <Button type="primary" onClick={click}>
      Select path repo
    </Button>
  );
};