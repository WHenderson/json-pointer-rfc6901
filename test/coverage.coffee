assert = require('chai').assert

suite('coverage', () ->
  jp = null

  setup(() ->
    jp = require('../dist/json-pointer.coffee')
  )

  suite('escape', () ->
    test('none', () ->
      assert.deepEqual(
        jp.escape('abc123[]%\"\'')
        'abc123[]%\"\'',
        'incorrect escaping'
      )
    )
    test('slash', () ->
      assert.deepEqual(
        jp.escape('//')
        '~1~1',
        'incorrect escaping'
      )
    )
    test('tilda', () ->
      assert.deepEqual(
        jp.escape('~~')
        '~0~0',
        'incorrect escaping'
      )
    )
    test('mixed', () ->
      assert.deepEqual(
        jp.escape('abc123[]%\"\'/~/~')
        'abc123[]%\"\'~1~0~1~0',
        'incorrect escaping'
      )
      assert.deepEqual(
        jp.escape('abc123[]%\"\'~/~/')
        'abc123[]%\"\'~0~1~0~1',
        'incorrect escaping'
      )
    )
  )

  suite('unescape', () ->
    test('none', () ->
      assert.deepEqual(
        jp.unescape('abc123[]%\"\'')
        'abc123[]%\"\''
        'incorrect escaping'
      )
    )
    test('slash', () ->
      assert.deepEqual(
        jp.unescape('~1~1')
        '//'
        'incorrect escaping'
      )
    )
    test('tilda', () ->
      assert.deepEqual(
        jp.unescape('~0~0')
        '~~'
        'incorrect escaping'
      )
    )
    test('mixed', () ->
      assert.deepEqual(
        jp.unescape('abc123[]%\"\'~1~0~1~0')
        'abc123[]%\"\'/~/~'
        'incorrect escaping'
      )
      assert.deepEqual(
        jp.unescape('abc123[]%\"\'~0~1~0~1')
        'abc123[]%\"\'~/~/'
        'incorrect escaping'
      )
    )
  )

  suite('parse', () ->
    test('empty', () ->
      assert.deepEqual(
        jp.parse('')
        []
        'incorrect parse result'
      )
    )

    test('invalid', () ->
      try
        jp.parse('a')
      catch ex
        assert(ex instanceof jp.JsonPointerError, 'incorrect error type')
        assert.deepEqual(
          ex.message
          'Invalid JSON pointer: a'
          'incorrect error message'
        )
    )

    test('simple', () ->
      assert.deepEqual(
        jp.parse('/a/b/')
        ['a','b','']
        'incorrect parse result'
      )
    )

    test('escaped', () ->
      assert.deepEqual(
        jp.parse('/~0/~1')
        ['~','/']
        'incorrect parse result'
      )
    )
  )

  suite('compile', () ->
    test('empty', () ->
      assert.deepEqual(
        jp.compile([])
        ''
        'incorrect compile result'
      )
    )

    test('simple', () ->
      assert.deepEqual(
        jp.compile(['a','b',''])
        '/a/b/'
        'incorrect compile result'
      )
    )

    test('escape', () ->
      assert.deepEqual(
        jp.compile(['~','/'])
        '/~0/~1'
        'incorrect compile result'
      )
    )
  )

  suite('hasJsonProp', () ->
    test('has', () ->
      assert(jp.hasJsonProp({ a: 1 }, 'a'), 'invalid result')
    )
    test('has not', () ->
      assert(not jp.hasJsonProp({ a: 1 }, 'b'), 'invalid result')
    )
    test('prototype', () ->
      assert(not jp.hasJsonProp([], 'push'), 'invalid result')
    )
    test('non json array prop', () ->
      assert(not jp.hasJsonProp([], 'length'), 'invalid result')
    )
    test('non json string prop', () ->
      assert(not jp.hasJsonProp('0', 0), 'invalid result')
    )
  )

  suite('hasOwnProp', () ->
    test('has', () ->
      assert(jp.hasOwnProp({ a: 1 }, 'a'), 'invalid result')
    )
    test('has not', () ->
      assert(not jp.hasOwnProp({ a: 1 }, 'b'), 'invalid result')
    )
    test('prototype', () ->
      assert(not jp.hasOwnProp([], 'push'), 'invalid result')
    )
  )

  suite('hasProp', () ->
    test('has', () ->
      assert(jp.hasProp({ a: 1 }, 'a'), 'invalid result')
    )
    test('has not', () ->
      assert(not jp.hasProp({ a: 1 }, 'b'), 'invalid result')
    )
    test('prototype', () ->
      assert(jp.hasProp([], 'push'), 'invalid result')
    )
  )

  suite('get', () ->
    object = {
      "foo": ["bar", "baz"],
      "": 0,
      "a/b": 1,
      "c%d": 2,
      "e^f": 3,
      "g|h": 4,
      "i\\j": 5,
      "k\"l": 6,
      " ": 7,
      "m~n": 8
    }

    gets = {
      "": object              # the whole document
      "/foo": object.foo      # ["bar", "baz"]
      "/foo/0": object.foo[0] # "bar"
      "/": object['']         # 0
      "/a~1b":object['a/b']   # 1
      "/c%d":object['c%d']    # 2
      "/e^f":object['e^f']    # 3
      "/g|h":object['g|h']    # 4
      "/i\\j":object['i\\j']  # 5
      "/k\"l":object['k\"l']  # 6
      "/ ":object[' ']        # 7
      "/m~0n":object['m~n']   # 8
      "/foo/-": undefined
    }

    for own path, result of gets
      do (path,result) ->
        test("path (#{path})", () ->
          assert.deepEqual(
            jp.get(object, path)
            result
            'incorrect result'
          )
        )
  )

  suite('has', () ->
    object = {
      a: 1
      b: [2,3]
    }

    test('root', ()->
      assert(
        jp.has(object, '')
        'incorrect result'
      )
    )

    test('object has', () ->
      assert(
        jp.has(object, '/a')
        'incorrect result'
      )
    )

    test('array has', () ->
      assert(
        jp.has(object, '/b/0')
        'incorrect result'
      )
    )

    test('object has not', () ->
      assert(
        not jp.has(object, '/c')
        'incorrect result'
      )
    )

    test('array has not element', () ->
      assert(
        not jp.has(object, '/b/-')
        'incorrect result'
      )
    )
  )

  suite('set', () ->
    test('root', () ->
      assert.deepEqual(
        jp.set({}, '', 1)
        1
        'incorrect result'
      )
    )

    test('object', () ->
      assert.deepEqual(
        jp.set({}, '/a', 1)
        { a: 1 }
        'incorrect result'
      )
    )

    test('object deep', () ->
      assert.deepEqual(
        jp.set({ a: {} }, '/a/b/c', 1)
        { a: { b: { c: 1 } } }
        'incorrect result'
      )
    )

    test('array', () ->
      assert.deepEqual(
        jp.set([], '/-', 1)
        [1]
        'incorrect result'
      )
    )

    test('array deep', () ->
      assert.deepEqual(
        jp.set([[]], '/0/-/-', 1)
        [[[1]]]
        'incorrect result'
      )
    )
  )

  suite('del', () ->
    test('root', () ->
      assert.deepEqual(
        jp.del({}, '')
        undefined
        'incorrect result'
      )
    )

    test('object', () ->
      assert.deepEqual(
        jp.del({ a: 1 }, '/a')
        {}
        'incorrect result'
      )
    )

    test('object deep', () ->
      assert.deepEqual(
        jp.del({ a: { b: { c: 1 } } }, '/a/b/c')
        { a: { b: {} } }
        'incorrect result'
      )
    )

    test('object not found', () ->
      assert.deepEqual(
        jp.del({ a: 1 }, '/b')
        { a: 1 }
        'incorrect result'
      )
    )

    test('array', () ->
      assert.deepEqual(
        jp.del([1], '/0')
        []
        'incorrect result'
      )
    )

    test('array deep', () ->
      assert.deepEqual(
        jp.del([[[1]]], '/0/0/0')
        [[[]]]
        'incorrect result'
      )
    )

    test('array not found', () ->
      assert.deepEqual(
        jp.del([1], '/-')
        [1]
        'incorrect result'
      )
    )
  )

  suite('simplified', () ->
    test('set', () ->
      assert.deepEqual(
        jp({}, '/a', 1)
        { a: 1 }
        'incorrect result'
      )
    )

    test('get', () ->
      assert.deepEqual(
        jp({ b: 2 }, '/b')
        2
        'incorrect result'
      )
    )

    test('bind', () ->
      assert.deepEqual(
        jp({ b: 2 }).set('/b', 3)
        { b: 3 }
        'incorrect result'
      )
    )

    test('invalid', () ->
      assert(jp() == null, 'expected null')
    )
  )
)
