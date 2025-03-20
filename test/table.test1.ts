import { md2tid } from '../src';

let tab = `
| a | b | c | d |
| - | :- | -: | :-: |
| e | f |
| g | h | i | j | k |
`;

console.log(md2tid(tab));
