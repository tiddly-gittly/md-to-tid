import { toString, md2tid } from '../dist/index.mjs';

describe('blockquote', () => {
  test('should support adjacent texts in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a' },
              { type: 'text', value: 'b' },
            ],
          },
        ],
      }),
    ).toEqual('> ab\n');
  });

  test('should support a block quote in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'a\nb' }],
          },
          {
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [
                  { type: 'text', value: 'a\n' },
                  { type: 'inlineCode', value: 'b\nc' },
                  { type: 'text', value: '\nd' },
                ],
              },
              {
                type: 'heading',
                depth: 1,
                children: [{ type: 'text', value: 'a b' }],
              },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> b\n>\n> > a\n> > `b\n> > c`\n> > d\n> >\n> > ! a b\n');
  });

  test('should support a break in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'a' }, { type: 'break' }, { type: 'text', value: 'b' }],
          },
        ],
      }),
    ).toEqual('> a\\\n> b\n');
  });

  test('should support code (flow, indented) in a block quote', () => {
    expect(toString({ type: 'blockquote', children: [{ type: 'code', value: 'a\nb\n\nc' }] })).toEqual('>     a\n>     b\n>\n>     c\n');
  });

  test('should support code (flow, fenced) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [{ type: 'code', lang: 'a\nb', value: 'c\nd\n\ne' }],
      }),
    ).toEqual('> ```a&#xA;b\n> c\n> d\n>\n> e\n> ```\n');
  });

  test('should support code (text) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              { type: 'inlineCode', value: 'b\nc' },
              { type: 'text', value: '\nd' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> `b\n> c`\n> d\n');
  });

  test('should support padded code (text) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              { type: 'inlineCode', value: ' b\nc ' },
              { type: 'text', value: '\nd' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> `  b\n> c  `\n> d\n');
  });

  test('should support a definition in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          // @ts-expect-error: `definition` is fine in `blockquote`.
          { type: 'definition', label: 'a\nb', url: 'c\nd', title: 'e\nf' },
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'a\nb' }],
          },
        ],
      }),
    ).toEqual('> [a\n> b]: <c&#xA;d> "e\n> f"\n>\n> a\n> b\n');
  });

  test('should support an emphasis in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              { type: 'emphasis', children: [{ type: 'text', value: 'c\nd' }] },
              { type: 'text', value: '\nd' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> *c\n> d*\n> d\n');
  });

  test('should support a heading (atx) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'heading',
            depth: 3,
            children: [{ type: 'text', value: 'a\nb' }],
          },
        ],
      }),
    ).toEqual('> !!! a&#xA;b\n');
  });

  test('should support a heading (setext) in a block quote', () => {
    expect(
      toString(
        {
          type: 'blockquote',
          children: [
            {
              type: 'heading',
              depth: 1,
              children: [{ type: 'text', value: 'a\nb' }],
            },
          ],
        },
        { setext: true },
      ),
    ).toEqual('> ! a&#xA;b\n'); // TODO: <<<\n! a&#xA;b\n<<<
  });

  test('should support html (flow) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [{ type: 'html', value: '<div\nhidden>' }],
      }),
    ).toEqual('> <div\n> hidden>\n');
  });

  test('should support html (text) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a ' },
              { type: 'html', value: '<span\nhidden>' },
              { type: 'text', value: '\nb' },
            ],
          },
        ],
      }),
    ).toEqual('> a <span\n> hidden>\n> b\n');
  });

  test('should support an image (resource) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              { type: 'image', url: 'b\nc', alt: 'd\ne', title: 'f\ng' },
              { type: 'text', value: '\nh' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> ![d\n> e](<b&#xA;c> "f\n> g")\n> h\n');
  });

  test('should support an image (reference) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              {
                type: 'imageReference',
                alt: 'b\nc',
                label: 'd\ne',
                identifier: 'f',
                referenceType: 'collapsed',
              },
              { type: 'text', value: '\ng' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> ![b\n> c][d\n> e]\n> g\n');
  });

  test('should support a link (resource) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              {
                type: 'link',
                url: 'b\nc',
                children: [{ type: 'text', value: 'd\ne' }],
                title: 'f\ng',
              },
              { type: 'text', value: '\nh' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> [d\n> e](<b&#xA;c> "f\n> g")\n> h\n');
  });

  test('should support a link (reference) in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              {
                type: 'linkReference',
                children: [{ type: 'text', value: 'b\nc' }],
                label: 'd\ne',
                identifier: 'f',
                referenceType: 'collapsed',
              },
              { type: 'text', value: '\ng' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> [b\n> c][d\n> e]\n> g\n');
  });

  test('should support a list in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'text', value: 'a\nb' }],
          },
          {
            type: 'list',
            children: [
              {
                type: 'listItem',
                children: [{ type: 'paragraph', children: [{ type: 'text', value: 'c\nd' }] }],
              },
              {
                type: 'listItem',
                children: [{ type: 'thematicBreak' }],
              },
              {
                type: 'listItem',
                children: [{ type: 'paragraph', children: [{ type: 'text', value: 'e\nf' }] }],
              },
            ],
          },
        ],
      }),
    ).toEqual(`> a
> b
>
> * c
> * d
>
> * ---
>
> * e
> * f
`);
  });

  test('should support a strong in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [
          {
            type: 'paragraph',
            children: [
              { type: 'text', value: 'a\n' },
              { type: 'strong', children: [{ type: 'text', value: 'c\nd' }] },
              { type: 'text', value: '\nd' },
            ],
          },
        ],
      }),
    ).toEqual('> a\n> **c\n> d**\n> d\n');
  });

  test('should support a thematic break in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [{ type: 'thematicBreak' }, { type: 'thematicBreak' }],
      }),
    ).toEqual('> ---\n>\n> ---\n');
  });

  test('1. to #', async () => {
    await expect(md2tid('1. item 1')).resolves.toEqual('# item 1\n');
  });
});
