# Markdown to Tid

Transform markdown to tiddlywiki5 wikitext syntax. Using unifiedjs.

## Basic features

- `-` to `*`
- `1.` to `#`
- `#` to `!`

## Usage

Website demo: https://tiddly-gittly.github.io/md-to-tid/

### Programmatic usage

Get md data from your wiki and transform it:

```ts
import { md2tid } from 'md-to-tid';

const prevMDText = $tw.wiki.getTiddlerText(title);
const tidText = md2tid(prevMDText);
$tw.wiki.setText(title, 'text', undefined, tidText);
$tw.wiki.setText(title, 'type', undefined, 'text/vnd.tiddlywiki');
```

Or if you have a [MDAST](https://github.com/syntax-tree/mdast): See [Our test case](./test) for details.
