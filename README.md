# Markdown to Tid

Transform markdown to tiddlywiki5 wikitext syntax. Using unifiedjs.

## Basic features

- blockquote
- bold
- break
- code
- emphasis
- heading
- html
- image
- inline-code
- italic
- link
- list
- list-item
- paragraph
- text
- thematic-break
- table

### 定义和引用

- link-reference
- image-reference
- definition

```md
[][label1]
[alt1][label1]

![][label2]
![alt2][label2]

[label1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"
[label2]: https://example.com
```

```wikitext
[ext[https://en.wikipedia.org/wiki/Hobbit#Lifestyle]]
[ext[alt1|https://en.wikipedia.org/wiki/Hobbit#Lifestyle]]

[img[https://example.com]]
[img[alt2|https://example.com]]
```

[label1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"

[label2]: https://example.com

### 前置内容和脚注

- front-matter
- footnote

```md
---
foo: bar
---

# Other markdown
```

````wikitext
```yaml
foo: bar
```
! Other markdown
````

```md
In the Solar System, Mercury[^mercury] and Venus[^venus] have very small tilts.

[^mercury]:
**Mercury** is the first planet from the Sun and the smallest
in the Solar System.

[^venus]:
**Venus** is the second planet from
the Sun.
```

```wikitext
In the Solar System, Mercury<<fnote "''Mercury'' is the first planet from the Sun and the smallest in the Solar System.">> and Venus<<fnote "''Venus'' is the second planet from the Sun.">> have very small tilts.
```

## Usage

Website demo: https://tiddly-gittly.github.io/md-to-tid/

### Programmatic usage

First, run `pnpm add md-to-tid` to install the md-to-tid package. Then, use the API of this package to transform the
Markdown data obtained from your Wiki.

```ts
import {md2tid} from 'md-to-tid';

const prevMDText = $tw.wiki.getTiddlerText(title);
const tidText = md2tid(prevMDText);
$tw.wiki.setText(title, 'text', undefined, tidText);
$tw.wiki.setText(title, 'type', undefined, 'text/vnd.tiddlywiki');
```

Or if you have a [MDAST](https://github.com/syntax-tree/mdast): See [Our test case](./test) for details.
