import { useState, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'beautiful-react-hooks';
import { VFile } from 'vfile';
import type { JSONSchema7 } from 'json-schema';
// import { reporter } from 'vfile-reporter';
import { IOptions, md2tidProcessor } from '../src';

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
  const [configSchema, configSchemaSetter] = useState<JSONSchema7 | undefined>();
  const [rerender, rerenderHookTrigger] = useTrigger();
  const parseAndGenerateFromTemplate = useDebouncedCallback(
    async (templateStringToParse: string): Promise<void> => {
      const vFile = new VFile({ path: fileName, value: templateStringToParse });
      let newErrorMessage = '';
      try {
        const templateData = await md2tidProcessor.process(vFile);
        if (configFormData === undefined) {
          throw new Error('模板参数不正确');
        }
        templateDataSetter(vFile.toString());
        resultSetter(templateData.toString());
      } catch (e) {
        newErrorMessage += (e as Error).message;
      }
      // newErrorMessage += reporter(vFile);
      errorMessageSetter(newErrorMessage);
    },
    500,
    undefined,
    [configFormData],
  );
  useEffect(() => {
    parseAndGenerateFromTemplate(template);
  }, [template, rerenderHookTrigger]);

  return [rerender, template, templateSetter, result, configSchema, errorMessage, templateData] as const;
}
