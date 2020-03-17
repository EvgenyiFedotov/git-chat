import styled from "styled-components";
import { blue } from "@ant-design/colors";

export const RowBase = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  flex-wrap: wrap;
  min-height: 24px;
`;

export const Row = styled(RowBase)`
  & > *:not(:last-child) {
    margin-right: 8px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex: none;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;

export const LinkBlock = styled.div`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const StatusFileRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
  cursor: default;

  &:hover {
    background-color: ${blue[0]};
  }
`;

export const StatusFileAction = styled.div<{ color?: string }>`
  font-family: monospace;
  color: ${({ color }) => color};
`;

export const ButtonIcon = styled.div`
  cursor: pointer;
`;
