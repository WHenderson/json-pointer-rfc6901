class JsonPointerError extends Error
  constructor: (message) ->
    base = super(message)

    @message = base.message
    @stack = base.stack
    @name = @constructor.name

class JsonPointer
  @JsonPointerError: JsonPointerError

  ###
  # Convenience function for choosing between `.smartBind`, `.get`, and `.set`, depending on the number of arguments.
  #
  # @param {*} object
  # @param {string} pointer
  # @param {*} value
  # @returns {*} evaluation of the proxied method
  ###
  constructor: (object, pointer, value) ->
    return switch arguments.length
      when 3 then JsonPointer.set(object, pointer, value)
      when 2 then JsonPointer.get(object, pointer)
      when 1 then JsonPointer.smartBind({ object: object })
      else null

  ###
  # Creates a clone of the api, with `./.get/.has/.set/.del/.smartBind` method signatures adjusted.
  # The smartBind method is cumulative, meaning that `.smartBind({ object: x}).smartBind({ pointer: y })` will behave as expected.
  #
  # @param {Object} bindings
  # @param {*} bindings.object
  # @param {string|string[]} bindings.pointer
  # @param {Object} bindings.options
  # @returns {JsonPointer}
  ###
  @smartBind: ({ object: obj, pointer: ptr, fragment: frag, options: opt }) ->
    # fragment overrides pointer
    ptr = frag ? ptr

    # What are binding?
    hasObj = obj != undefined
    hasPtr = ptr?
    hasOpt = opt?

    # Lets not parse this every time!
    if typeof ptr == 'string'
      ptr = @parse(ptr)

    # default options have changed
    mergeOptions = (override = {}) ->
      o = {}

      o.hasOwnProp = override.hasOwnProp ? opt.hasOwnProp
      o.getProp = override.getProp ? opt.getProp
      o.setProp = override.setProp ? opt.setProp
      o.getNotFound = override.getNotFound ? opt.getNotFound
      o.setNotFound = override.setNotFound ? opt.setNotFound
      o.delNotFound = override.delNotFound ? opt.delNotFound

      return o

    api = undefined

    # Every combination of bindings
    if hasObj and hasPtr and hasOpt
      api = (value) ->
        return switch arguments.length
          when 1 then JsonPointer.set(obj, ptr, value, opt)
          when 0 then JsonPointer.get(obj, ptr, opt)
          else null

      api.set = (value, override) -> obj = JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (override) -> obj = JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasObj and hasPtr
      api = (value) ->
        return switch arguments.length
          when 1 then JsonPointer.set(obj, ptr, value)
          when 0 then JsonPointer.get(obj, ptr)
          else null

      api.set = (value, override) -> obj = JsonPointer.set(obj, ptr, value, override)
      api.get = (override) -> JsonPointer.get(obj, ptr, override)
      api.has = (override) -> JsonPointer.has(obj, ptr, override)
      api.del = (override) -> obj = JsonPointer.del(obj, ptr, override)
    else if hasObj and hasOpt
      api = (ptr, value) ->
        return switch arguments.length
          when 2 then JsonPointer.set(obj, ptr, value, opt)
          when 1 then JsonPointer.get(obj, ptr, opt)
          else null

      api.set = (ptr, value, override) -> obj = JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (ptr, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (ptr, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (ptr, override) -> obj = JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasPtr and hasOpt
      api = (obj, value) ->
        return switch arguments.length
          when 2 then JsonPointer.set(obj, ptr, value, opt)
          when 1 then JsonPointer.get(obj, ptr, opt)
          else null

      api.set = (obj, value, override) -> JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (obj, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (obj, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (obj, override) -> JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasOpt
      api = (obj, ptr, value) ->
        return switch arguments.length
          when 3 then JsonPointer.set(obj, ptr, value, opt)
          when 2 then JsonPointer.get(obj, ptr, opt)
          when 1 then api.smartBind({ object: obj })
          else null

      api.set = (obj, ptr, value, override) -> JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (obj, ptr, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (obj, ptr, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (obj, ptr, override) -> JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasObj
      api = (ptr, value) ->
        return switch arguments.length
          when 2 then JsonPointer.set(obj, ptr, value)
          when 1 then JsonPointer.get(obj, ptr)
          else null

      api.set = (ptr, value, override) -> obj = JsonPointer.set(obj, ptr, value, override)
      api.get = (ptr, override) -> JsonPointer.get(obj, ptr, override)
      api.has = (ptr, override) -> JsonPointer.has(obj, ptr, override)
      api.del = (ptr, override) -> obj = JsonPointer.del(obj, ptr, override)
    else if hasPtr
      api = (obj, value) ->
        return switch arguments.length
          when 2 then JsonPointer.set(obj, ptr, value)
          when 1 then JsonPointer.get(obj, ptr)
          else null

      api.set = (obj, value, override) -> JsonPointer.set(obj, ptr, value, override)
      api.get = (obj, override) -> JsonPointer.get(obj, ptr, override)
      api.has = (obj, override) -> JsonPointer.has(obj, ptr, override)
      api.del = (obj, override) -> JsonPointer.del(obj, ptr, override)
    else
      return @

    # smartBind has new defaults
    api.smartBind = (override) ->
      o = {}

      if {}.hasOwnProperty.call(override, 'object')
        o.object = override.object
      else if hasObj
        o.object = obj

      if {}.hasOwnProperty.call(override, 'pointer')
        o.pointer = override.pointer
      else if hasPtr
        o.pointer = ptr

      if {}.hasOwnProperty.call(override, 'options')
        o.options = mergeOptions(override.options)
      else if hasObj
        o.options = opt

      return JsonPointer.smartBind(o)

    if hasPtr
      ###
      # get/set bound pointer value
      #
      # Only available when pointer has been bound
      #
      # @param {string} value
      # @returns string[] segments
      ###
      api.pointer = (value) ->
        if arguments.length == 0
          return JsonPointer.compilePointer(ptr)
        else
          return ptr = JsonPointer.parsePointer(value)

      ###
      # get/set bound pointer value as fragment
      #
      # Only available when pointer has been bound
      #
      # @param {string} value
      # @returns string[] segments
      ###
      api.fragment = (value) ->
        if arguments.length == 0
          return JsonPointer.compileFragment(ptr)
        else
          return ptr = JsonPointer.parseFragment(value)

    if hasObj
      ###
      # get/set bound object
      #
      # Only available when object has been bound
      #
      # @param {*} value
      # @returns {*} bound object
      ###
      api.object = (value) ->
        if arguments.length == 0
          return obj
        else
          return obj = value

    if hasOpt
      ###
      # get/set bound options
      #
      # Only available when options has been bound
      #
      # @param {*} value
      # @returns {*} bound options
      ###
      api.options = (value) ->
        if arguments.length == 0
          return opt
        else
          return opt = value

    # copy the remaining methods which do not need binding
    for own key, val of JsonPointer
      if not {}.hasOwnProperty.call(api, key)
        api[key] = val

    # final result
    return api

  ###
  # Escapes the given path segment as described by RFC6901.
  #
  # Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'`.
  #
  # @param {string} segment
  # @returns {string}
  ###
  @escape: (segment) ->
    segment.replace(/~/g, '~0').replace(/\//g, '~1')

  ###
  # Escapes the given path fragment segment as described by RFC6901.
  #
  # Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'` and finally the string is URI encoded.
  #
  # @param {string} segment
  # @returns {string}
  ###
  @escapeFragment: (segment) ->
    encodeURIComponent(JsonPointer.escape(segment))

  ###
  # Un-Escapes the given path segment, reversing the actions of `.escape`.
  #
  # Notably, `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
  #
  # @param {string} segment
  # @returns {string}
  ###
  @unescape: (segment) ->
    segment.replace(/~1/g, '/').replace(/~0/g, '~')

  ###
  # Un-Escapes the given path fragment segment, reversing the actions of `.escapeFragment`.
  #
  # Notably, the string is URI decoded and then `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
  #
  # @param {string} segment
  # @returns {string}
  ###
  @unescapeFragment: (segment) ->
    JsonPointer.unescape(decodeURIComponent(segment))

  ###
  # Returns true iff `str` is a valid json pointer value
  #
  # @param {string} str
  # @returns {Boolean}
  ###
  @isPointer: (str) ->
    switch str.charAt(0)
      when '' then return true
      when '/' then return true
      else
        return false

  ###
  # Returns true iff `str` is a valid json fragment pointer value
  #
  # @param {string} str
  # @returns {Boolean}
  ###
  @isFragment: (str) ->
    switch str.substring(0, 2)
      when '#' then return true
      when '#/' then return true
      else
        return false

  ###
  # Parses a json-pointer or json fragment pointer, as described by RFC901, into an array of path segments.
  #
  # @throws {JsonPointerError} for invalid json-pointers.
  #
  # @param {string} str
  # @returns {string[]}
  ###
  @parse: (str) ->
    switch str.charAt(0)
      when '' then return []
      when '/' then return str.substring(1).split('/').map(JsonPointer.unescape)
      when '#'
        switch str.charAt(1)
          when '' then return []
          when '/' then return str.substring(2).split('/').map(JsonPointer.unescapeFragment)
          else
            throw new JsonPointerError("Invalid JSON fragment pointer: #{str}")
      else
        throw new JsonPointerError("Invalid JSON pointer: #{str}")

  ###
  # Parses a json-pointer, as described by RFC901, into an array of path segments.
  #
  # @throws {JsonPointerError} for invalid json-pointers.
  #
  # @param {string} str
  # @returns {string[]}
  ###
  @parsePointer: (str) ->
    switch str.charAt(0)
      when '' then return []
      when '/' then return str.substring(1).split('/').map(JsonPointer.unescape)
      else throw new JsonPointerError("Invalid JSON pointer: #{str}")

  ###
  # Parses a json fragment pointer, as described by RFC901, into an array of path segments.
  #
  # @throws {JsonPointerError} for invalid json-pointers.
  #
  # @param {string} str
  # @returns {string[]}
  ###
  @parseFragment: (str) ->
    switch str.substring(0, 2)
      when '#' then return []
      when '#/' then return str.substring(2).split('/').map(JsonPointer.unescapeFragment)
      else
        throw new JsonPointerError("Invalid JSON fragment pointer: #{str}")

  ###
  # Converts an array of path segments into a json pointer.
  # This method is the reverse of `.parsePointer`.
  #
  # @param {string[]} segments
  # @returns {string}
  ###
  @compile: (segments) ->
    segments.map((segment) -> '/' + JsonPointer.escape(segment)).join('')

  ###
  # Converts an array of path segments into a json pointer.
  # This method is the reverse of `.parsePointer`.
  #
  # @param {string[]} segments
  # @returns {string}
  ###
  @compilePointer: (segments) ->
    segments.map((segment) -> '/' + JsonPointer.escape(segment)).join('')

  ###
  # Converts an array of path segments into a json fragment pointer.
  # This method is the reverse of `.parseFragment`.
  #
  # @param {string[]} segments
  # @returns {string}
  ###
  @compileFragment: (segments) ->
    '#' + segments.map((segment) -> '/' + JsonPointer.escapeFragment(segment)).join('')

  ###
  # Callback used to determine if an object contains a given property.
  #
  # @callback hasProp
  # @param {*} obj
  # @param {string|integer} key
  # @returns {Boolean}
  ###

  ###
  # Returns true iff `obj` contains `key` and `obj` is either an Array or an Object.
  # Ignores the prototype chain.
  #
  # Default value for `options.hasProp`.
  #
  # @param {*} obj
  # @param {string|integer} key
  # @returns {Boolean}
  ###
  @hasJsonProp: (obj, key) ->
    if Array.isArray(obj)
      return (typeof key == 'number') and (key < obj.length)
    else if typeof obj == 'object'
      return {}.hasOwnProperty.call(obj, key)
    else
      return false

  ###
  # Returns true iff `obj` contains `key`, disregarding the prototype chain.
  #
  # @param {*} obj
  # @param {string|integer} key
  # @returns {Boolean}
  ###
  @hasOwnProp: (obj, key) ->
    {}.hasOwnProperty.call(obj, key)

  ###
  # Returns true iff `obj` contains `key`, including via the prototype chain.
  #
  # @param {*} obj
  # @param {string|integer} key
  # @returns {Boolean}
  ###
  @hasProp: (obj, key) ->
    key of obj

  ###
  # Callback used to retrieve a property from an object
  #
  # @callback getProp
  # @param {*} obj
  # @param {string|integer} key
  # @returns {*}
  ###

  ###
  # Finds the given `key` in `obj`.
  #
  # Default value for `options.getProp`.
  #
  # @param {*} obj
  # @param {string|integer} key
  # @returns {*}
  ###
  @getProp: (obj, key) ->
    obj[key]

  ###
  # Callback used to set a property on an object.
  #
  # @callback setProp
  # @param {*} obj
  # @param {string|integer} key
  # @param {*} value
  # @returns {*}
  ###

  ###
  # Sets the given `key` in `obj` to `value`.
  #
  # Default value for `options.setProp`.
  #
  # @param {*} obj
  # @param {string|integer} key
  # @param {*} value
  # @returns {*} `value`
  ###
  @setProp: (obj, key, value) ->
    obj[key] = value

  ###
  # Callback used to modify behaviour when a given path segment cannot be found.
  #
  # @callback notFound
  # @param {*} obj
  # @param {string|integer} key
  # @returns {*}
  ###

  ###
  # Returns the value to use when `.get` fails to locate a pointer segment.
  #
  # Default value for `options.getNotFound`.
  #
  # @param {*} obj
  # @param {string|integer} segment
  # @param {*} root
  # @param {string[]} segments
  # @param {integer} iSegment
  # @returns {undefined}
  ###
  @getNotFound: (obj, segment, root, segments, iSegment) ->
    undefined

  ###
  # Returns the value to use when `.set` fails to locate a pointer segment.
  #
  # Default value for `options.setNotFound`.
  #
  # @param {*} obj
  # @param {string|integer} segment
  # @param {*} root
  # @param {string[]} segments
  # @param {integer} iSegment
  # @returns {undefined}
  ###
  @setNotFound: (obj, segment, root, segments, iSegment) ->
    if segments[iSegment + 1].match(/^(?:0|[1-9]\d*|-)$/)
      return obj[segment] = []
    else
      return obj[segment] = {}

  ###
  # Performs an action when `.del` fails to locate a pointer segment.
  #
  # Default value for `options.delNotFound`.
  #
  # @param {*} obj
  # @param {string|integer} segment
  # @param {*} root
  # @param {string[]} segments
  # @param {integer} iSegment
  # @returns {undefined}
  ###
  @delNotFound: (obj, segment, root, segments, iSegment) ->
    undefined

  ###
  # Raises a JsonPointerError when the given pointer segment is not found.
  #
  # May be used in place of the above methods via the `options` argument of `./.get/.set/.has/.del/.simpleBind`.
  #
  # @param {*} obj
  # @param {string|integer} segment
  # @param {*} root
  # @param {string[]} segments
  # @param {integer} iSegment
  # @returns {undefined}
  ###
  @errorNotFound: (obj, segment, root, segments, iSegment) ->
    throw new JsonPointerError("Unable to find json path: #{JsonPointer.compile(segments.slice(0, iSegment+1))}")

  ###
  # Sets the location in `object`, specified by `pointer`, to `value`.
  # If `pointer` refers to the whole document, `value` is returned without modifying `object`,
  # otherwise, `object` modified and returned.
  #
  # By default, if any location specified by `pointer` does not exist, the location is created using objects and arrays.
  # Arrays are used only when the immediately following path segment is an array element as defined by the standard.
  #
  # @param {*} obj
  # @param {string|string[]} pointer
  # @param {Object} options
  # @param {hasProp} options.hasProp
  # @param {getProp} options.getProp
  # @param {setProp} options.setProp
  # @param {notFound} options.getNotFound
  # @returns {*}
  ###
  @set: (obj, pointer, value, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    if pointer.length == 0
      return value

    hasProp = options?.hasProp ? JsonPointer.hasJsonProp
    getProp = options?.getProp ? JsonPointer.getProp
    setProp = options?.setProp ? JsonPointer.setProp
    setNotFound = options?.setNotFound ? JsonPointer.setNotFound

    root = obj
    iSegment = 0
    len = pointer.length

    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length
      else if segment.match(/^(?:0|[1-9]\d*)$/) and Array.isArray(obj)
        segment = parseInt(segment, 10)

      if iSegment == len
        setProp(obj, segment, value)
        break
      else if not hasProp(obj, segment)
        obj = setNotFound(obj, segment, root, pointer, iSegment - 1)
      else
        obj = getProp(obj, segment)

    return root

  ###
  # Finds the value in `obj` as specified by `pointer`
  #
  # By default, returns undefined for values which cannot be found
  #
  # @param {*} obj
  # @param {string|string[]} pointer
  # @param {Object} options
  # @param {hasProp} options.hasProp
  # @param {getProp} options.getProp
  # @param {notFound} options.getNotFound
  # @returns {*}
  ###
  @get: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasJsonProp
    getProp = options?.getProp ? JsonPointer.getProp
    getNotFound = options?.getNotFound ? JsonPointer.getNotFound

    root = obj
    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length
      else if segment.match(/^(?:0|[1-9]\d*)$/) and Array.isArray(obj)
        segment = parseInt(segment, 10)

      if not hasProp(obj, segment)
        return getNotFound(obj, segment, root, pointer, iSegment - 1)
      else
        obj = getProp(obj, segment)

    return obj

  ###
  # Removes the location, specified by `pointer`, from `object`.
  # Returns the modified `object`, or undefined if the `pointer` is empty.
  #
  # @param {*} obj
  # @param {string|string[]} pointer
  # @param {Object} options
  # @param {hasProp} options.hasProp
  # @param {getProp} options.getProp
  # @param {notFound} options.delNotFound
  # @returns {*}
  ###
  @del: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    if pointer.length == 0
      return undefined

    hasProp = options?.hasProp ? JsonPointer.hasJsonProp
    getProp = options?.getProp ? JsonPointer.getProp
    delNotFound = options?.delNotFound ? JsonPointer.delNotFound

    root = obj
    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length
      else if segment.match(/^(?:0|[1-9]\d*)$/) and Array.isArray(obj)
        segment = parseInt(segment, 10)

      if not hasProp(obj, segment)
        delNotFound(obj, segment, root, pointer, iSegment - 1)
        break
      else if iSegment == len
        delete obj[segment]
        break
      else
        obj = getProp(obj, segment)

    return root

  ###
  # Returns true iff the location, specified by `pointer`, exists in `object`
  #
  # @param {*} obj
  # @param {string|string[]} pointer
  # @param {Object} options
  # @param {hasProp} options.hasProp
  # @param {getProp} options.getProp
  # @returns {*}
  ###
  @has: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasJsonProp
    getProp = options?.getProp ? JsonPointer.getProp

    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length
      else if segment.match(/^(?:0|[1-9]\d*)$/) and Array.isArray(obj)
        segment = parseInt(segment, 10)

      if not hasProp(obj, segment)
        return false

      obj = getProp(obj, segment)

    return true

module.exports = JsonPointer