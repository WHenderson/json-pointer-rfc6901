var pointer = require('../index');

console.log('result:', pointer.isFragment('#/'));
// result: true

console.log('result:', pointer.isFragment('#'));
// result: true

console.log('result:', pointer.isFragment('#a'));
// result: false

console.log('result:', pointer.isFragment(''));
// result: false
