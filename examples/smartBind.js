var pointer = require('../src/index');

var obj = { a: 1 };

console.log('result:', pointer.smartBind({ object: obj })('/a'));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).get('/a'));
// result: 1

console.log('result:', pointer.smartBind({ pointer: '/a' }).get(obj));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).smartBind({ pointer: '/a' }).get());
// result: 1

var bound = pointer.smartBind({ object: { b: 2 }, pointer: '/b', options: { hasProp: pointer.hasOwnProp } });

console.log('result:', bound.object());
// result: { b: 2 }
console.log('result:', bound.pointer());
// result: /b
console.log('result:', bound.fragment());
// result: #/b
console.log('result:', bound.options());
// result: { hasProp: [Function] }

console.log('result:', bound.object({ c: 3 }));
// result: { c: 3 }
console.log('result:', bound.pointer('/c'));
// result: [ 'b' ]
console.log('result:', bound.fragment('#/c'));
// result: [ 'c' ]
console.log('result:', bound.options({ hasProp: pointer.hasProp }));
// result: { hasProp: [Function] }
