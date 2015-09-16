class JsonPointerError extends Error
  constructor: (message) ->
    base = super(message)

    @message = base.message
    @stack = base.stack
    @name = @constructor.name

class JsonPointer
  @escape: (segment) ->
    segment.replace(/~/g, '~0').replace(/\//g, '~1')

  @unescape: (segment) ->
    segment.replace(/~1/g, '/').replace(/~0/g, '~')

  @parse: (str) ->
    if str.charAt(0) != '/'
      throw new JsonPointerError("Invalid JSON pointer: #{str}")

    return str.substring(1).split('/').map(JsonPointer.escape)

  @compile: (segments) ->
    segents.map((segment) -> '/' + segment).join()

  @hasProp: (obj, key) ->
    typeof obj == 'object' and {}.hasOwnProperty.call(obj, key)

  @getNotFound: (root, segments, node, iSegment) ->
    undefined

  @setNotFound: (root, segments, node, iSegment) ->
    segment = segments[iSegment]

    if pointer[iSegment + 1].match(/^\d+|-$/)
      return obj[segment] = []
    else
      return obj[segment] = {}


  @set: (obj, pointer, value, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasProp
    setNotFound = options?.setNotFound ? JsonPointer.setNotFound

    root = obj
    iSegment = 0
    len = pointer.length

    while iSegment != len
      segment = pointer[iSegment]
      ++iSegment

      if segment == '-' and Array.isArray(obj)
        segment = obj.length

      if iSegment == len
        obj[segment] = value
        break
      else if not hasProp(obj, segment)
        obj = setNotFound(root, pointer, obj, pointer)
      else
        obj = obj[segment]

    return @

  @get: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasProp
    getNotFound = options?.getNotFound ? JsonPointer.getNotFound

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
        obj = obj[segment]

    return obj

  @remove: (obj, pointer, options) ->
    if typeof pointer == 'string'
      pointer = JsonPointer.parse(pointer)

    hasProp = options?.hasProp ? JsonPointer.hasProp
    getNotFound = options?.getNotFound ? JsonPointer.getNotFound

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
        return getNotFound(root, pointer, obj, iSegment - 1)
      else
        obj = obj[segment]

    return @

