class JsonPointerError extends Error
  constructor: (message) ->
    base = super(message)

    @message = base.message
    @stack = base.stack
    @name = @constructor.name
