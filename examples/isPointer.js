var pointer = require('../src/index');

console.log('result:', pointer.isPointer('/a'));
// result: true

console.log('result:', pointer.isPointer('a'));
// result: false
