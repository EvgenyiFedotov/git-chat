import * as React from "react";
import styled from "styled-components";
import { Cwd } from "features/cwd";
import { Row } from "ui";
import { Input } from "antd";

export const Header: React.FC = () => {
  return (
    <Container>
      <Cwd />
      <Input size="small" placeholder="command" />
    </Container>
  );
};

const Container = styled(Row)`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 40px;
  padding: 8px;
  background-color: white;
  flex-wrap: nowrap;
`;
