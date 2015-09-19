var pointer = require('../index');

var obj = { a: 1 };

console.log('result:', pointer.smartBind({ object: obj })('/a'));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).get('/a'));
// result: 1

console.log('result:', pointer.smartBind({ pointer: '/a' }).get(obj));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).smartBind({ pointer: '/a' }).get());
// result: 1
