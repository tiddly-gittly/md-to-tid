import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { VFile } from 'vfile';

const md2tidProcessor = unified().use(remarkParse).use(remarkRetid).use(retidFormat).use(retidStringify);

export async function md2tid(markdownString: string): Promise<string> {
  const vFile = new VFile({ path: 'fileName', value: markdownString });
  const file = await md2tidProcessor.process(vFile);
  return file.value as string;
}
