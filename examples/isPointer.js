var pointer = require('../index');

console.log('result:', pointer.isPointer('/a'));
// result: true

console.log('result:', pointer.isPointer('a'));
// result: false
