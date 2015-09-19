var pointer = require('../index');

try {
  console.log('result:', pointer.get({a: 1}, '/b', {getNotFound: pointer.errorNotFound}));
}
catch (ex)
{
  console.log(ex.name, ':', ex.message);
}
// exception: JsonPointerError : Unable to find json path: /b

console.log('result:', pointer.get([1,2,3], '/length'));
// result: undefined
console.log('result:', pointer.get([1,2,3], '/length', { hasProp: pointer.hasOwnProp }));
// result: 3
console.log('result:', pointer.get([1,2,3], '/length', { hasProp: pointer.hasProp }));
// result: 3

console.log('result:', pointer.get([1,2,3], '/push'));
// result: undefined
console.log('result:', pointer.get([1,2,3], '/push', { hasProp: pointer.hasOwnProp }));
// result: undefined
console.log('result:', pointer.get([1,2,3], '/push', { hasProp: pointer.hasProp }));
// result: function push() { [native code] }
