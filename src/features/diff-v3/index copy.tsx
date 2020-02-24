import * as React from "react";
import {
  FileDiff,
  FileDiffChunk,
  FileDiffLine,
  FileDiffHeader,
  FileDiffLineV2,
} from "lib/api-git";
import styled from "styled-components";
import { cyan, red, grey, geekblue } from "@ant-design/colors";
import { DiffChunks } from "features/diff/ui/diff-chunks";
import { Branch } from "lib/branch";
import { Icon, Tooltip } from "antd";

type Mode = "-" | "+";

interface DiffCaclParams {
  showLine: boolean;
  numLine: number;
  bgColor?: string;
}

export const DiffV3: React.FC<{
  fileDiff: FileDiff | null;
  mode: Mode;
}> = ({ fileDiff, mode }) => {
  if (!fileDiff) return null;

  const { chunks } = fileDiff;

  const content = chunks.reduce<{
    infoLines: React.ReactElement[];
    lines: React.ReactElement[];
  }>(
    (memo, diffChunk, chunkIndex) => {
      memo.infoLines.push(
        <InfoLineHeaderChunk
          key={`info-line-header-${chunkIndex}`}
          diffHeader={diffChunk.header}
        />,
      );

      memo.lines.push(
        <LineHeaderChunk
          key={`line-${chunkIndex}`}
          diffHeader={diffChunk.header}
        />,
      );

      diffChunk.lines.forEach((diffLine, lineIndex) => {
        const showLine = ((): boolean => {
          switch (mode) {
            case "-":
              return diffLine.remove || diffLine.spase;
            case "+":
              return diffLine.add || diffLine.spase;
          }
        })();
        const numLine = ((): number => {
          switch (mode) {
            case "-":
              return diffLine.removeNumLine;
            case "+":
              return diffLine.addNumLine;
          }
        })();
        const bgColor = ((): any => {
          if (diffLine.remove && mode === "-") {
            return red[0];
          }

          if (diffLine.add && mode === "+") {
            return cyan[0];
          }
        })();
        const calcParams: DiffCaclParams = {
          showLine,
          numLine,
          bgColor,
        };

        memo.infoLines.push(
          <InfoLine
            key={`info-line-${chunkIndex}-${lineIndex}`}
            diffLine={diffLine}
            calcParams={calcParams}
          />,
        );

        memo.lines.push(
          <Line
            key={`line-${chunkIndex}-${lineIndex}`}
            mode={mode}
            diffLine={diffLine}
            calcParams={calcParams}
          />,
        );
      });

      memo.infoLines.push(
        <Separator key={`info-line-separator-${chunkIndex}`} />,
      );

      memo.lines.push(<Separator key={`line-separator-${chunkIndex}`} />);

      return memo;
    },
    {
      infoLines: [],
      lines: [],
    },
  );

  return (
    <Container>
      <InfoLines>
        <tbody>{content.infoLines}</tbody>
      </InfoLines>
      <Lines>
        <tbody>{content.lines}</tbody>
      </Lines>
    </Container>
  );
};

const InfoLineHeaderChunk: React.FC<{
  diffHeader: FileDiffHeader;
}> = ({ diffHeader }) => {
  return (
    <Header>
      <AddButton>
        <Tooltip title="Add chunk">
          <Icon type="plus" />
        </Tooltip>
      </AddButton>
      <td></td>
    </Header>
  );
};

const LineHeaderChunk: React.FC<{
  diffHeader: FileDiffHeader;
}> = ({ diffHeader }) => {
  return (
    <Header>
      <td>
        {`@@ -${diffHeader.meta.remove.from},${diffHeader.meta.remove.length} +${diffHeader.meta.add.from},${diffHeader.meta.add.length} @@ ${diffHeader.title}`}
      </td>
    </Header>
  );
};

const InfoLine: React.FC<{
  diffLine: FileDiffLine;
  calcParams: DiffCaclParams;
}> = ({ diffLine, calcParams }) => {
  const { showLine, bgColor: color, numLine } = calcParams;

  return (
    <tr>
      <AddButton>
        <Branch if={showLine && !!color}>
          <Tooltip title="Add line">
            <Icon type="plus" />
          </Tooltip>
        </Branch>
      </AddButton>
      <Num bgColor={color}>
        <Branch if={showLine}>{numLine}</Branch>
      </Num>
    </tr>
  );
};

const Line: React.FC<{
  mode: Mode;
  diffLine: FileDiffLine;
  calcParams: DiffCaclParams;
}> = ({ mode, diffLine, calcParams }) => {
  const { bgColor: color, showLine } = calcParams;

  return (
    <tr>
      <Code bgColor={color}>
        <Branch if={showLine}>
          {/* <DiffChunks diffLine={diffLine} type={mode} /> */}
        </Branch>
      </Code>
    </tr>
  );
};

const Separator: React.FC = () => (
  <tr>
    <td></td>
  </tr>
);

const Container = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-wrap: nowrap;
`;

const Table = styled.table`
  font-family: monospace;
  font-size: small;
  display: block;

  tr {
    height: 21px;

    td {
      white-space: nowrap;
      padding: 0 4px;
    }
  }
`;

const InfoLines = styled(Table)``;

const Lines = styled(Table)`
  width: 100%;
  overflow-x: auto;
  white-space: nowrap;
  position: relative;
`;

const Header = styled.tr`
  background-color: ${geekblue[0]};
  font-weight: bold;
`;

const AddButton = styled.td`
  cursor: pointer;
  color: ${grey[2]};
`;

const Num = styled.td<{ bgColor?: string }>`
  color: ${grey[0]};
  text-align: right;
  background-color: ${({ bgColor }) => bgColor};
`;

const Code = styled.td<{ bgColor?: string }>`
  width: 100%;
  white-space: pre !important;
  background-color: ${({ bgColor }) => bgColor};
`;