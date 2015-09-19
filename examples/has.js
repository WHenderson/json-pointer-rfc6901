var pointer = require('../index');

console.log('result:', pointer.has({ a: 1 }, '/a'));
// result: true

console.log('result:', pointer.has({ a: 1 }, '/b'));
// result: false

