import { md2tid } from '../src';

let tab = `
# 这是一个表格

这个是一个火狐狸

| ab | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |
| L | L | R | C |
`;

let footnote = `
In the Solar System, Mercury[^mercury] and Venus[^venus] have very small tilts.

[^mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.

[^venus]:
    **Venus** is the second planet from
    the Sun.
`;

let tomlFrontMatter = `+++
title = "New Website"
+++

# Other markdown
`;

let yamlFrontMatter = `---
foo: bar
---

# Other markdown
`;

let reference = `
[][]
![][]
[alt1][]
![alt2][]

[][label1]
![][label2]
[alt1][label1]
![alt2][label2]

[label1]: https://en.wikipedia.org/wiki/Hobbit#Lifestyle "Hobbit lifestyles"
[label2]: https://example.com
`;

let obsidian_internal_link_and_embeds = `
[[Link]]
[[Link|AltText]]
[[Link|AltText|AltText1|...]]

![[Embeds]]
![[Embeds|AltText]]
![[Embeds|AltText|AltText1|...|200x400]]
`;

console.log(md2tid(obsidian_internal_link_and_embeds));
