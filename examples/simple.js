var pointer = require('../index');

var obj = { a: 1 };

console.log('result:', pointer(obj, '/a', 2));
// result: { a: 2 }

console.log('result:', pointer(obj, '/a'));
// result: 2

var bound = pointer(obj);

console.log('result:', bound.get('/a'));
// result: 2

console.log('result:', bound('/a'));
// result: 2

console.log('result:', bound.set('/a', 3));
// result: { a: 3 }

console.log('result:', bound('/a', 4));
// result: { a: 4 }
