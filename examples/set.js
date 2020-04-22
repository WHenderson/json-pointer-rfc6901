var pointer = require('../src/index');

var obj = { a: 1 };

console.log('result:', pointer.set(obj, '/a', 2));
// result: { a: 2 }

console.log('result:', pointer.set(obj, '/b', 3));
// result: { a: 2, b: 3 }

console.log('result:', pointer.set(obj, '/c/0/a', 4));
// result: { a: 2, b: 3, c: [ { a: 4 } ] }

console.log('result:', pointer.set(obj, '/c/-/b', 5));
// result: { a: 2, b: 3, c: [ { a: 4 }, { b: 5 } ] }
