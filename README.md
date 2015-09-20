# json-pointer-rfc6901

json-pointer-rfc6901 provides convenient methods for handling json pointers as defined by [RFC6901](https://tools.ietf.org/html/rfc6901)

[![Build Status](https://travis-ci.org/WHenderson/json-pointer-rfc6901.svg?branch=master)](https://travis-ci.org/WHenderson/json-pointer-rfc6901)
[![Coverage Status](https://coveralls.io/repos/WHenderson/json-pointer-rfc6901/badge.svg?branch=master&service=github)](https://coveralls.io/github/WHenderson/json-pointer-rfc6901?branch=master)

## Installation

### Node
    npm install json-pointer-rfc6901

### Web
    bower install json-pointer-rfc6901

## Usage

### node
```js
var pointer = require('json-pointer-rfc6901');

console.log(pointer({ a: 1 }, '/a'));
```

### web (global)
```html
<html>
    <head>
        <script type="text/javascript" src="json-pointer-rfc6901.web.min.js"></script>
    </head>
    <body>
        <script>
            console.log(JSON.pointer({ a: 1 }, '/a');
        </script>
    </body>
</html>
```

### web (amd)
```js
require.config({
  paths: {
      "json-pointer-rfc6901": "json-pointer-rfc6901.web.min.js"
  }
});
require(['json-pointer-rfc6901'], function (pointer) {
    console.log(pointer({ a: 1 }, '/a');
});
```

## API

### methods

### [`.get(object, pointer, [options]) -> value`](examples/get.js)
Finds the value in `object` as specified by `pointer`.

```js
console.log('result:', pointer.get({ a: 1 }, '/a'));
// result: 1

console.log('result:', pointer.get({ a: 1 }, '/b'));
// result: undefined
```

### [`.set(object, pointer, value, [options]) -> object`](examples/set.js)
Sets the location in `object`, specified by `pointer`, to `value`.
Returns the modified `object`.

```js
var obj = { a: 1 };

console.log('result:', pointer.set(obj, '/a', 2));
// result: { a: 2 }

console.log('result:', pointer.set(obj, '/b', 3));
// result: { a: 2, b: 3 }

console.log('result:', pointer.set(obj, '/c/0/a', 4));
// result: { a: 2, b: 3, c: [ { a: 4 } ] }

console.log('result:', pointer.set(obj, '/c/-/b', 5));
// result: { a: 2, b: 3, c: [ { a: 4 }, { b: 5 } ] }
```

### [.has(object, pointer, [options]) -> Boolean](examples/has.js)
Returns true iff the location, specified by `pointer`, exists in `object`.

```js
console.log('result:', pointer.has({ a: 1 }, '/a'));
// result: true

console.log('result:', pointer.has({ a: 1 }, '/b'));
// result: false
```

### [.del(object, pointer, [options]) -> object/undefined](examples/del.js)
Removes the location, specified by `pointer`, from `object`.
Returns the modified `object`, or undefined if the `pointer` is empty.

```js
var obj = { a: 1 };

console.log('result:', pointer.del(obj, '/b'));
// result: { a: 1 }

console.log('result:', pointer.del(obj, '/a'));
// result: {}

console.log('result:', pointer.del(obj, ''));
// result: undefined
```

### [.escape(str) -> str](examples/escape.js)
Escapes the given path segment as described by RFC6901.

Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'`

```js
console.log('result:', pointer.escape('abc'));
// result: abc

console.log('result:', pointer.escape('~'));
// result: ~0

console.log('result:', pointer.escape('/'));
// result: ~1
```

### [.escapeFragment(str) -> str](examples/escape.js)
Escapes the given path fragment segment as described by RFC6901.

Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'` and finally the string is URI encoded.

```js
console.log('result:', pointer.escapeFragment('a b'));
// result: a%20b
```

### [.unescape(str) -> str](examples/escape.js)
Un-Escapes the given path segment, reversing the actions of `.escape`

Notably, `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`

```js
console.log('result:', pointer.unescape('abc'));
// result: abc

console.log('result:', pointer.unescape('~0'));
// result: ~

console.log('result:', pointer.unescape('~1'));
// result: /
```

### [.unescapeFragment(str) -> str](examples/escape.js)
Un-Escapes the given path fragment segment, reversing the actions of `.escapeFragment`.

Notably, the string is URI decoded and then `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.

```js
console.log('result:', pointer.unescapeFragment('a%20b'));
// result: a b
```

### [.isPointer(str) -> Boolean](examples/isPointer.js')
Returns true iff `str` is a valid json pointer value

```js
console.log('result:', pointer.isPointer('/a'));
// result: true
```

### [.isFragment(str) -> Boolean](examples/isFragment.js')
Returns true iff `str` is a valid json fragment pointer value

```js
console.log('result:', pointer.isFragment('#/'));
// result: true
```

### [.parse(str) -> Array](examples/parse.js)
Parses a json-pointer or json fragment pointer, as described by RFC901, into an array of path segments.

```js
console.log('result:', pointer.parse('/abc'));
// result: [ 'abc' ]

console.log('result:', pointer.parse('#/abc'));
// result: [ 'abc' ]
```

### [.parsePointer(str) -> Array](examples/parse.js)
Parses a json-pointer, as described by RFC901, into an array of path segments.

```js
console.log('result:', pointer.parsePointer('/abc'));
// result: [ 'abc' ]
```

### [.parseFragment(str) -> Array](examples/parse.js)
Parses a json-pointer or json fragment pointer, as described by RFC901, into an array of path segments.

```js
console.log('result:', pointer.parseFragment('#/abc'));
// result: [ 'abc' ]
```

### [.compile(array) -> str](examples/compile.js)
Converts an array of path segments into a json pointer.
This method is the reverse of `.parsePointer`

```js
console.log('result:', pointer.compile([ 'abc' ]));
// result: /abc

console.log('result:', pointer.compile([ '~', '/', 'abc' ]));
// result: '/~0/~1/abc'

console.log('result:', pointer.compile([ '' ]));
// result: '/'

console.log('result:', pointer.compile([]));
// result:
```

### [.compilePointer(array) -> str](examples/compile.js)
Converts an array of path segments into a json pointer.
This method is the reverse of `.parsePointer`

```js
console.log('result:', pointer.compilePointer([ 'abc' ]));
// result: /abc
```

### [.compileFragment(array) -> str](examples/compile.js)
Converts an array of path segments into a json pointer.
This method is the reverse of `.compileFragment`

```js
console.log('result:', pointer.compileFragment([ 'abc' ]));
// result: #/abc
```

### [pointer(object, [pointer, [value]]) -> pointer/value/object](examples/simple.js)
Convenience function for choosing between `.smartBind`, `.get`, and `.set`, depending on the number of arguments.

```js
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
```

### [.smartBind(bindings) -> pointer](examples/smartBind.js)
Creates a clone of the api, with `./.get/.has/.set/.del/.smartBind` method signatures adjusted.

```js
var obj = { a: 1 };

console.log('result:', pointer.smartBind({ object: obj })('/a'));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).get('/a'));
// result: 1

console.log('result:', pointer.smartBind({ pointer: '/a' }).get(obj));
// result: 1

console.log('result:', pointer.smartBind({ object: obj }).smartBind({ pointer: '/a' }).get());
// result: 1
```

#### [bound.pointer(str) -> strings](examples/smartBind.js)
get/set bound pointer value

#### [bound.fragment(str) -> strings](examples/smartBind.js)
get/set bound pointer value as fragment

#### [bound.object(str) -> strings](examples/smartBind.js)
get/set bound object

#### [bound.options(str) -> strings](examples/smartBind.js)
get/set bound options

### [.hasJsonProp(object, key) -> Boolean](examples/options.js)
Returns true iff `obj` contains `key` and `obj` is either an Array or an Object.
Ignores the prototype chain.

Default value for `options.hasProp`.

### [.hasOwnProp(object, key) -> Boolean](examples/options.js)
Returns true iff `obj` contains `key`, disregarding the prototype chain.

### [.hasProp(object, key) -> Boolean](examples/options.js)
Returns true iff `obj` contains `key`, including via the prototype chain.

### .getProp(object, key) -> value
Finds the given `key` in `obj`.

Default value for `options.getProp`.

### .setProp(object, key, value) -> value
Sets the given `key` in `obj` to `value`.

Default value for `options.setProp`.

### .getNotFound(object, segment, root, segments, iSegment) -> value
Returns the value to use when `.get` fails to locate a pointer segment.

Default value for `options.getNotFound`.

### .setNotFound(object, segment, root, segments, iSegment) -> value
Returns the value to use when `.set` fails to locate a pointer segment.

Default value for `options.setNotFound`.

### .delNotFound(object, segment, root, segments, iSegment) -> value
Performs an action when `.del` fails to locate a pointer segment.

Default value for `options.delNotFound`.

### [.errorNotFound(object, segment, root, segments, iSegment) -> n/a](examples/options.js)
Raises a JsonPointerError when the given pointer segment is not found.

May be used in place of the above methods via the `options` argument of `./.get/.set/.has/.del/.simpleBind`.

```js
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
```
