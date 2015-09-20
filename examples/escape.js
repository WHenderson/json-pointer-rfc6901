var pointer = require('../index');

console.log('result:', pointer.escape('abc'));
// result: abc

console.log('result:', pointer.escape('~'));
// result: ~0

console.log('result:', pointer.escape('/'));
// result: ~1

console.log('result:', pointer.escapeFragment('a b'));
// result: a%20b
