class JsonPointerError extends Error
  constructor: (message) ->
    base = super(message)

    @message = base.message
    @stack = base.stack
    @name = @constructor.name

class JsonPointer
  constructor: (obj, pointer, value) ->
    return switch arguments.length
      when 3 then @set(obj, pointer, value)
      when 2 then @get(obj, pointer)
      when 1 then @bind({ obj: obj })
      else null

  @bind: (bindings) ->
    # object
    # pointer
    # value

    obj = bindings.object
    ptr = bindings.pointer
    opt = bindings.options

    hasObj = obj != undefined
    hasPtr = ptr?
    hasOpt = opt?

    if typeof ptr == 'string'
      ptr = @parse(ptr)

    api = @constructor.bind(@)

    for own key, val of @
      api[key] = @[key]

    mergeOptions = (override) ->
      o = {}

      o.hasOwnProp = override.hasOwnProp ? opt.hasOwnProp
      o.getProp = override.getProp ? opt.getProp
      o.setProp = override.setProp ? opt.setProp
      o.getNotFound = override.getNotFound ? opt.getNotFound
      o.setNotFound = override.setNotFound ? opt.setNotFound
      o.delNotFound = override.delNotFound ? opt.delNotFound

      return o

    if hasObj and hasPtr and hasOpt
      api.set = (value, override) => @set.call(api, obj, ptr, value, mergeOptions(override))
      api.get = (override) => @get.call(api, obj, ptr, mergeOptions(override))
      api.has = (override) => @has.call(api, obj, ptr, mergeOptions(override))
      api.del = (override) => @del.call(api, obj, ptr, mergeOptions(override))
    else if hasObj and hasPtr
      api.set = @set.bind(api, obj, ptr)
      api.get = @get.bind(api, obj, ptr)
      api.has = @has.bind(api, obj, ptr)
      api.del = @del.bind(api, obj, ptr)
    else if hasObj and hasOpt
      api.set = (ptr, value, override) => @set.call(api, obj, ptr, value, mergeOptions(override))
      api.get = (ptr, override) => @get.call(api, obj, ptr, mergeOptions(override))
      api.has = (ptr, override) => @has.call(api, obj, ptr, mergeOptions(override))
      api.del = (ptr, override) => @del.call(api, obj, ptr, mergeOptions(override))
    else if hasPtr and hasOpt
      api.set = (obj, value, override) => @set.call(api, obj, ptr, value, mergeOptions(override))
      api.get = (obj, override) => @get.call(api, obj, ptr, mergeOptions(override))
      api.has = (obj, override) => @has.call(api, obj, ptr, mergeOptions(override))
      api.del = (obj, override) => @del.call(api, obj, ptr, mergeOptions(override))
    else if hasOpt
      api.set = (obj, ptr, value, override) => @set.call(api, obj, ptr, value, mergeOptions(override))
      api.get = (obj, ptr, override) => @get.call(api, obj, ptr, mergeOptions(override))
      api.has = (obj, ptr, override) => @has.call(api, obj, ptr, mergeOptions(override))
      api.del = (obj, ptr, override) => @del.call(api, obj, ptr, mergeOptions(override))
    else if hasObj
      api.set = @set.bind(api, obj)
      api.get = @get.bind(api, obj)
      api.has = @has.bind(api, obj)
      api.del = @del.bind(api, obj)
    else if hasPtr
      api.set = (obj, value, options) => @set.call(api, obj, ptr, value, options)
      api.get = (obj, options) => @get.call(api, obj, ptr, options)
      api.has = (obj, options) => @has.call(api, obj, ptr, options)
      api.del = (obj, options) => @del.call(api, obj, ptr, options)
    else
      return @

    api.bind = (override) ->
      o = {}

      if {}.hasOwnProperty.call(override, 'object')
        o.object = override.object
      else if hasObj
        o.object = obj

      if {}.hasOwnProperty.call(override, 'pointer')
        o.pointer = override.pointer
      else if hasObj
        o.pointer = ptr

      if {}.hasOwnProperty.call(override, 'options')
        o.options = merge(override.options)
      else if hasObj
        o.options = opt

    return api

  @escape: (segment) ->
    segment.replace(/~/g, '~0').replace(/\//g, '~1')

  @unescape: (segment) ->
    segment.replace(/~1/g, '/').replace(/~0/g, '~')

  @parse: (str) ->
    if str == ''
      return []

    if str.charAt(0) != '/'
      throw new JsonPointerError("Invalid JSON pointer: #{str}")

    return str.substring(1).split('/').map(JsonPointer.unescape)

  @compile: (segments) ->
    segents.map((segment) -> '/' + segment).join()

  @hasOwnProp: (obj, key) ->
    {}.hasOwnProperty.call(obj, key)

  @hasProp: (obj, key) ->
    key of obj

  @getProp: (obj, key) ->
    obj[key]

  @setProp: (obj, key, value) ->
    obj[key] = value

  @getNotFound: (root, segments, node, iSegment) ->
    undefined

  @setNotFound: (root, segments, node, iSegment) ->
    segment = segments[iSegment]

    if pointer[iSegment + 1].match(/^\d+|-$/)
      return obj[segment] = []
    else
      return obj[segment] = {}

  @delNotFound: (root, segments, node, iSegment) ->
    @

  @set: (obj, pointer, value, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasOwnProp
    getProp = options?.getProp ? JsonPointer.getProp.bind(@)
    setProp = options?.setProp ? JsonPointer.setProp.bind(@)
    setNotFound = options?.setNotFound ? JsonPointer.setNotFound.bind(@)

    root = obj
    iSegment = 0
    len = pointer.length

    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length

      if iSegment == len
        setProp(obj, segment, value)
        break
      else if not hasProp(obj, segment)
        obj = setNotFound(root, pointer, obj, pointer)
      else
        obj = getProp(obj, segment)

    return @

  @get: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasOwnProp
    getProp = options?.getProp ? JsonPointer.getProp.bind(@)
    getNotFound = options?.getNotFound ? JsonPointer.getNotFound.bind(@)

    root = obj
    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length

      if not hasProp(obj, segment)
        return getNotFound(root, pointer, obj, iSegment - 1)
      else
        obj = getProp(obj, segment)

    return obj

  @del: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasOwnProp
    getProp = options?.getProp ? JsonPointer.getProp.bind(@)
    delNotFound = options?.delNotFound ? JsonPointer.delNotFound.bind(@)

    root = obj
    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length

      if iSegment == len
        delete obj[segment]
        break
      else if not hasProp(obj, segment)
        delNotFound(root, pointer, obj, iSegment - 1)
        break
      else
        obj = getProp(obj, segment)

    return @

  @has: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasOwnProp
    getProp = options?.getProp ? JsonPointer.getProp

    iSegment = 0
    len = pointer.length
    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if not hasProp(obj, segment)
        return false

      obj = getProp(obj, segment)

    return true


