var pointer = require('../index');

// pointers

console.log('result:', pointer.parse('/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parse('/~0/~1/abc'));
// result: [ '~', '/', 'abc' ]

console.log('result:', pointer.parse('/'));
// result: [ '' ]

console.log('result:', pointer.parse(''));
// result: []

console.log('result:', pointer.parsePointer('/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parsePointer('/~0/~1/abc'));
// result: [ '~', '/', 'abc' ]

console.log('result:', pointer.parsePointer('/'));
// result: [ '' ]

console.log('result:', pointer.parsePointer(''));
// result: []

// fragments

console.log('result:', pointer.parse('#/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parse('#/~0/~1/abc'));
// result: [ '~', '/', 'abc' ]

console.log('result:', pointer.parse('#/'));
// result: [ '' ]

console.log('result:', pointer.parse('#'));
// result: []

console.log('result:', pointer.parseFragment('#/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parseFragment('#/~0/~1/abc'));
// result: [ '~', '/', 'abc' ]

console.log('result:', pointer.parseFragment('#/'));
// result: [ '' ]

console.log('result:', pointer.parseFragment('#'));
// result: []
