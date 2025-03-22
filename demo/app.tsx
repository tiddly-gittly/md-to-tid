import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDebouncedCallback } from 'beautiful-react-hooks';

import styled from 'styled-components';
import { Button, ButtonGroup, Intent, Tab, Tabs, TextArea, Card, Elevation } from '@blueprintjs/core';
import { useLocalStorage } from 'beautiful-react-hooks';
import useQueryString from 'use-query-string';

import { templates } from './data';
import { IOptions, md2tid } from '../src';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
`;
const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  margin-top: 10px;
  max-height: 1350px;
  flex-direction: column;
  @media (min-width: 700px) {
    flex-direction: row;
  }
`;
const TemplateInputContainer = styled(Card)`
  display: flex;
  flex: 1;
  flex-direction: column;

  min-height: 300px;
  margin-right: 10px;

  & textarea {
    display: flex;
    max-height: calc(95%);
    flex: 3;
  }
`;

const ErrorMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ResultDisplayModeSelectContainer = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  opacity: 0.5;

  &:active,
  &:hover,
  &:focus {
    opacity: 1;
  }
`;

const ResultContainer = styled(Card)`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: calc(90%);
  overflow: scroll;

  padding: 40px;
  font-size: 32px;
`;
const CopyButton = styled(Button)``;

function useTrigger() {
  const [a, f] = useState(false);
  return [
    useCallback(() => {
      f(!a);
    }, [a]),
    a,
  ] as const;
}

export function useTemplateGeneration(configFormData: IOptions | undefined, fileName = 'input.md') {
  const [template, templateSetter] = useState('');
  const [result, resultSetter] = useState<string>('');
  const [templateData, templateDataSetter] = useState<string>('');
  const [errorMessage, errorMessageSetter] = useState('');
  const [rerender, rerenderHookTrigger] = useTrigger();
  const parseAndGenerateFromTemplate = useDebouncedCallback(
    (templateStringToParse: string) => {
      let newErrorMessage = '';
      try {
        const templateData = md2tid(templateStringToParse);
        if (configFormData === undefined) {
          throw new Error('模板参数不正确');
        }
        resultSetter(templateData.toString());
      } catch (e) {
        newErrorMessage += (e as Error).message;
      }
      // newErrorMessage += reporter(vFile);
      errorMessageSetter(newErrorMessage);
    },
    [configFormData],
    500,
  );
  useEffect(() => {
    parseAndGenerateFromTemplate(template);
  }, [template, rerenderHookTrigger]);

  return [rerender, template, templateSetter, result, errorMessage, templateData] as const;
}

export enum ResultDisplayMode {
  paragraph,
  card,
}

export function GenerationResult(props: { result: string; resultDisplayMode: ResultDisplayMode; template: string }): JSX.Element {
  switch (props.resultDisplayMode) {
    case ResultDisplayMode.card: {
      return (
        <ResultContainer elevation={Elevation.TWO}>
          <pre>{props.result}</pre>
        </ResultContainer>
      );
    }
    case ResultDisplayMode.paragraph: {
      return (
        <ResultContainer elevation={Elevation.TWO}>
          <CopyButton
            size="large"
            onClick={() => {
              navigator.clipboard.writeText(props.result);
            }}>
            复制
          </CopyButton>
          <pre>{props.result}</pre>
        </ResultContainer>
      );
    }
  }
}

function updateQuery(path: string) {
  window.history.pushState(null, document.title, path);
}

const emptyConfigurationString = `{}`;

function App(): JSX.Element {
  const [configString, configStringSetter] = useState<string>(emptyConfigurationString);
  const queryString = useQueryString(window.location, updateQuery);
  const [templateTab, templateTabSetter] = useState<keyof typeof templates>('空白');
  const [resultDisplayMode, resultDisplayModeSetter] = useState<ResultDisplayMode>(ResultDisplayMode.paragraph);
  const [空白templateContent, 空白templateContentSetter] = useLocalStorage<string>('空白templateContent', templates['空白']);
  let configFormData: IOptions | undefined = JSON.parse(configString) as IOptions;
  const [rerender, template, templateSetter, result, errorMessage, templateData] = useTemplateGeneration(configFormData, `${templateTab}.md`);
  useEffect(() => {
    templates['空白'] = 空白templateContent;
    const tabFromQueryString = queryString[0].tab as keyof typeof templates | undefined;
    if (tabFromQueryString) {
      templateTabSetter(tabFromQueryString);
      templateSetter(templates[tabFromQueryString]);
    } else {
      templateSetter(templates[templateTab]);
    }
    const configStringFromQueryString = queryString[0].conf as string | undefined;
    if (configStringFromQueryString) {
      JSON.parse(configStringFromQueryString);
      configStringSetter(configStringFromQueryString);
    }
    const resultDisplayModeFromQueryString = queryString[0].mode;
    if (resultDisplayModeFromQueryString) {
      resultDisplayModeSetter(Number(resultDisplayModeFromQueryString));
    }
  }, []);

  const updateConfigString = useCallback(
    (nextConfigString: string) => {
      const parsedConfig = JSON.parse(nextConfigString);
      // if no error thrown
      configStringSetter(nextConfigString);
      queryString[1]({ conf: JSON.stringify({ ...parsedConfig }) });
    },
    [templateData, template, queryString],
  );

  const updateResultDisplayMode = useCallback(
    (nextResultDisplayMode: ResultDisplayMode) => {
      resultDisplayModeSetter(nextResultDisplayMode);
      queryString[1]({ mode: String(nextResultDisplayMode) });
    },
    [queryString],
  );

  const inputGroup = (
    <TemplateInputContainer>
      <Tabs
        id="Tabs"
        onChange={(nextTabName: keyof typeof templates) => {
          templateTabSetter(nextTabName);
          templateSetter(templates[nextTabName]);
          queryString[1]({ tab: nextTabName });
        }}
        selectedTabId={templateTab}>
        {Object.keys(templates).map((templateName) => (
          <Tab id={templateName} key={templateName} title={templateName} panel={<div />} />
        ))}
      </Tabs>
      <TextArea
        size="large"
        intent={Intent.PRIMARY}
        fill={true}
        onChange={(event) => {
          templateSetter(event.target.value);
          if (templateTab === '空白') {
            空白templateContentSetter(event.target.value);
          }
        }}
        value={template}
      />
      <ErrorMessageContainer>{errorMessage}</ErrorMessageContainer>
    </TemplateInputContainer>
  );

  return (
    <Container>
      <ContentContainer as="main">
        {inputGroup}
        <ResultDisplayModeSelectContainer>
          <ButtonGroup>
            <Button icon="eye-on" onClick={() => updateResultDisplayMode(ResultDisplayMode.paragraph)}>
              编辑模式
            </Button>
            <Button icon="database" onClick={() => updateResultDisplayMode(ResultDisplayMode.card)}>
              元信息模式
            </Button>
          </ButtonGroup>
        </ResultDisplayModeSelectContainer>
        <GenerationResult result={result} resultDisplayMode={resultDisplayMode} template={template} />
      </ContentContainer>
    </Container>
  );
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);
