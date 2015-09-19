var jp = require('../index');

var p = jp.smartBind({
  object: { a: 1 },
  pointer: '/a'
});

console.log(p.has.apply(null, []));
