import styled from "styled-components";

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
