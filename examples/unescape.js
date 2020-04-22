var pointer = require('../src/index');

console.log('result:', pointer.unescape('abc'));
// result: abc

console.log('result:', pointer.unescape('~0'));
// result: ~

console.log('result:', pointer.unescape('~1'));
// result: /

console.log('result:', pointer.unescapeFragment('a%20b'));
// result: a b
