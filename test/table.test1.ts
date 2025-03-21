import { md2tid } from '../src';

let tab = `
# 这是一个表格

这个是一个火狐狸

| ab | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |
`;

console.log(md2tid(tab));
