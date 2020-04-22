var pointer = require('../src/index');

console.log('result:', pointer.get({ a: 1 }, '/a'));
// result: 1

console.log('result:', pointer.get({ a: 1 }, '/b'));
// result: undefined
