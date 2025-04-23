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

let foot = `
In the Solar System, Mercury[^mercury] and Venus[^venus] have very small tilts.

[^mercury]:
    **Mercury** is the first planet from the Sun and the smallest
    in the Solar System.

[^venus]:
    **Venus** is the second planet from
    the Sun.
`

console.log(md2tid(foot));
