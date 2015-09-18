class JsonPointerError extends Error
  constructor: (message) ->
    base = super(message)

    @message = base.message
    @stack = base.stack
    @name = @constructor.name

class JsonPointer
  @JsonPointerError: JsonPointerError

  constructor: (object, pointer, value) ->
    return switch arguments.length
      when 3 then JsonPointer.set(object, pointer, value)
      when 2 then JsonPointer.get(object, pointer)
      when 1 then JsonPointer.smartBind({ object: object })
      else null

  @smartBind: ({ object: obj, pointer: ptr, options: opt }) ->
    # What are binding?
    hasObj = obj != undefined
    hasPtr = ptr?
    hasOpt = opt?

    # Lets not parse this every time!
    if typeof ptr == 'string'
      ptr = @parse(ptr)

    # default options have changed
    mergeOptions = (override) ->
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
          when 1 then jp.set(obj, ptr, value, opt)
          when 0 then jp.get(obj, ptr, opt)
          else null

      api.set = (value, override) -> obj = JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (override) -> obj = JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasObj and hasPtr
      api = (value) ->
        return switch arguments.length
          when 1 then jp.set(obj, ptr, value)
          when 0 then jp.get(obj, ptr)
          else null

      api.set = (value, override) -> obj = JsonPointer.set(obj, ptr, value, override)
      api.get = (override) -> JsonPointer.get(obj, ptr, override)
      api.has = (override) -> JsonPointer.has(obj, ptr, override)
      api.del = (override) -> obj = JsonPointer.del(obj, ptr, override)
    else if hasObj and hasOpt
      api = (ptr, value) ->
        return switch arguments.length
          when 2 then jp.set(obj, ptr, value, opt)
          when 1 then jp.get(obj, ptr, opt)
          else null

      api.set = (ptr, value, override) -> obj = JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (ptr, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (ptr, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (ptr, override) -> obj = JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasPtr and hasOpt
      api = (obj, value) ->
        return switch arguments.length
          when 2 then jp.set(obj, ptr, value, opt)
          when 1 then jp.get(obj, ptr, opt)
          else null

      api.set = (obj, value, override) -> JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (obj, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (obj, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (obj, override) -> JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasOpt
      api = (obj, ptr, value) ->
        return switch arguments.length
          when 3 then jp.set(obj, ptr, value, opt)
          when 2 then jp.get(obj, ptr, opt)
          when 1 then api.smartBind({ object: obj })
          else null

      api.set = (obj, ptr, value, override) -> JsonPointer.set(obj, ptr, value, mergeOptions(override))
      api.get = (obj, ptr, override) -> JsonPointer.get(obj, ptr, mergeOptions(override))
      api.has = (obj, ptr, override) -> JsonPointer.has(obj, ptr, mergeOptions(override))
      api.del = (obj, ptr, override) -> JsonPointer.del(obj, ptr, mergeOptions(override))
    else if hasObj
      api = (ptr, value) ->
        return switch arguments.length
          when 1 then jp.set(obj, ptr, value)
          when 0 then jp.get(obj, ptr)
          else null

      api.set = (ptr, value, override) -> obj = JsonPointer.set(obj, ptr, value, override)
      api.get = (ptr, override) -> JsonPointer.get(obj, ptr, override)
      api.has = (ptr, override) -> JsonPointer.has(obj, ptr, override)
      api.del = (ptr, override) -> obj = JsonPointer.del(obj, ptr, override)
    else if hasPtr
      api = (obj, value) ->
        return switch arguments.length
          when 1 then jp.set(obj, ptr, value)
          when 0 then jp.get(obj, ptr)
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
      else if hasObj
        o.pointer = ptr

      if {}.hasOwnProperty.call(override, 'options')
        o.options = merge(override.options)
      else if hasObj
        o.options = opt

      return JsonPointer.smartBind(o)

    # copy the remaining methods which do not need binding
    for own key, val of JsonPointer
      if not {}.hasOwnProperty.call(api, key)
        api[key] = val

    # final result
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
    segments.map((segment) -> '/' + JsonPointer.escape(segment)).join('')

  @hasJsonProp: (obj, key) ->
    if Array.isArray(obj)
      return (typeof key == 'number') and (key < obj.length)
    else if typeof obj == 'object'
      return {}.hasOwnProperty.call(obj, key)
    else
      return false

  @hasOwnProp: (obj, key) ->
    {}.hasOwnProperty.call(obj, key)

  @hasProp: (obj, key) ->
    key of obj

  @getProp: (obj, key) ->
    obj[key]

  @setProp: (obj, key, value) ->
    obj[key] = value

  @getNotFound: (obj, segment, root, segments, iSegment) ->
    undefined

  @setNotFound: (obj, segment, root, segments, iSegment) ->
    if segments[iSegment + 1].match(/^(?:0|[1-9]\d*|-)$/)
      return obj[segment] = []
    else
      return obj[segment] = {}

  @delNotFound: (obj, segment, root, segments, iSegment) ->
    @

  @errorNotFound: (obj, segment, root, segments, iSegment) ->
    throw new JsonPointerError("Unable to find json path: #{JsonPointer.compile(segments.slice(0, iSegment+1))}")

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
