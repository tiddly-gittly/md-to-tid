import { Button, Card } from '@blueprintjs/core';
import styled from 'styled-components';
import React from 'react';
import ReactMarkdown from 'react-markdown';

export enum ResultDisplayMode {
  share,
  paragraph,
  card,
  markdown,
}
const ResultContainer = styled(Card)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 100vh;
  overflow: scroll;

  padding: 40px;
  font-size: 64px;
`;
const CopyButton = styled(Button)``;

export function GenerationResult(props: { result: string; resultDisplayMode: ResultDisplayMode; template: string }): JSX.Element {
  switch (props.resultDisplayMode) {
    case ResultDisplayMode.card: {
      return (
        <ResultContainer>
          <pre>{props.result}</pre>
        </ResultContainer>
      );
    }
    case ResultDisplayMode.share:
    case ResultDisplayMode.paragraph: {
      return (
        <ResultContainer as="article">
          <CopyButton
            large
            onClick={() => {
              navigator.clipboard.writeText(props.result);
            }}>
            复制
          </CopyButton>
          <pre>{props.result}</pre>
        </ResultContainer>
      );
    }
    case ResultDisplayMode.markdown: {
      return (
        <ResultContainer as="article">
          <ReactMarkdown>{props.template}</ReactMarkdown>
        </ResultContainer>
      );
    }
  }
}
