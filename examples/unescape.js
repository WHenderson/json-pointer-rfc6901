var pointer = require('../index');

console.log('result:', pointer.unescape('abc'));
// result: abc

console.log('result:', pointer.unescape('~0'));
// result: ~

console.log('result:', pointer.unescape('~1'));
// result: /
