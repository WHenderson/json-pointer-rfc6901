var pointer = require('../index');

// default (pointer)

console.log('result:', pointer.compile([ 'abc' ]));
// result: /abc

console.log('result:', pointer.compile([ '~', '/', 'abc' ]));
// result: '/~0/~1/abc'

console.log('result:', pointer.compile([ '' ]));
// result: '/'

console.log('result:', pointer.compile([]));
// result:

// pointer

console.log('result:', pointer.compilePointer([ 'abc' ]));
// result: /abc

console.log('result:', pointer.compilePointer([ '~', '/', 'abc' ]));
// result: /~0/~1/abc

console.log('result:', pointer.compilePointer([ '' ]));
// result: /

console.log('result:', pointer.compilePointer([]));
// result:

// fragment

console.log('result:', pointer.compilePointer([ 'abc' ]));
// result: #/abc

console.log('result:', pointer.compilePointer([ '~', '/', 'abc' ]));
// result: #/~0/~1/abc

console.log('result:', pointer.compilePointer([ '' ]));
// result: #/

console.log('result:', pointer.compilePointer([]));
// result: #
