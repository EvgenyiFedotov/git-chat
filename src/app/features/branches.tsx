import * as React from "react";
import styled from "styled-components";
import { useStore } from "effector-react";
import * as ui from "../ui";
import { $branches, showBranches } from "../model";

export const Branches: React.FC = () => {
  const branches = useStore($branches);

  return (
    <BranchesContainer>
      {Array.from(branches.values()).map(branch => (
        <Branch key={branch.name} onClick={() => showBranches(false)}>
          {branch.shortName}
        </Branch>
      ))}
    </BranchesContainer>
  );
};

const BranchesContainer = styled.div`
  box-shadow: 0px -2px 6px 0 hsla(0, 0%, 0%, 0.2);
  border-top: 1px solid var(--panel-boder-color);
  max-height: 10rem;
  overflow-y: auto;
`;

const Branch = styled(ui.Row)`
  padding: 0.5rem;
  cursor: pointer;
  min-height: 2.5rem;
  align-items: center;

  &:hover {
    background-color: var(--main-3-color);
  }
`;