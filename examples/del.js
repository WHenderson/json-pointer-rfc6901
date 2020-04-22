var pointer = require('../src/index');

var obj = { a: 1 };

console.log('result:', pointer.del(obj, '/b'));
// result: { a: 1 }

console.log('result:', pointer.del(obj, '/a'));
// result: {}

console.log('result:', pointer.del(obj, ''));
// result: undefined
