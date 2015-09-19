var pointer = require('../index');

console.log('result:', pointer.parse('/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parse('/~0/~1/abc'));
// result: [ '~', '/', 'abc' ]

console.log('result:', pointer.parse('/'));
// result: [ '' ]

console.log('result:', pointer.parse(''));
// result: []
