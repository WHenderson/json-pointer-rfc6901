;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.JSON.pointer = factory();
  }
}(this, function() {
var JsonPointer, JsonPointerError,
  extend = function(child, parent) { for (var key in parent) { if (hasProp1.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp1 = {}.hasOwnProperty;

JsonPointerError = (function(superClass) {
  extend(JsonPointerError, superClass);

  function JsonPointerError(message) {
    var base;
    base = JsonPointerError.__super__.constructor.call(this, message);
    this.message = base.message;
    this.stack = base.stack;
    this.name = this.constructor.name;
  }

  return JsonPointerError;

})(Error);

JsonPointer = (function() {
  JsonPointer.JsonPointerError = JsonPointerError;


  /*
   * Convenience function for choosing between `.smartBind`, `.get`, and `.set`, depending on the number of arguments.
   *
   * @param {*} object
   * @param {string} pointer
   * @param {*} value
   * @returns {*} evaluation of the proxied method
   */

  function JsonPointer(object, pointer, value) {
    switch (arguments.length) {
      case 3:
        return JsonPointer.set(object, pointer, value);
      case 2:
        return JsonPointer.get(object, pointer);
      case 1:
        return JsonPointer.smartBind({
          object: object
        });
      default:
        return null;
    }
  }


  /*
   * Creates a clone of the api, with `./.get/.has/.set/.del/.smartBind` method signatures adjusted.
   * The smartBind method is cumulative, meaning that `.smartBind({ object: x}).smartBind({ pointer: y })` will behave as expected.
   *
   * @param {Object} bindings
   * @param {*} bindings.object
   * @param {string|string[]} bindings.pointer
   * @param {Object} bindings.options
   * @returns {JsonPointer}
   */

  JsonPointer.smartBind = function(arg) {
    var api, hasObj, hasOpt, hasPtr, key, mergeOptions, obj, opt, ptr, val;
    obj = arg.object, ptr = arg.pointer, opt = arg.options;
    hasObj = obj !== void 0;
    hasPtr = ptr != null;
    hasOpt = opt != null;
    if (typeof ptr === 'string') {
      ptr = this.parse(ptr);
    }
    mergeOptions = function(override) {
      var o, ref, ref1, ref2, ref3, ref4, ref5;
      if (override == null) {
        override = {};
      }
      o = {};
      o.hasOwnProp = (ref = override.hasOwnProp) != null ? ref : opt.hasOwnProp;
      o.getProp = (ref1 = override.getProp) != null ? ref1 : opt.getProp;
      o.setProp = (ref2 = override.setProp) != null ? ref2 : opt.setProp;
      o.getNotFound = (ref3 = override.getNotFound) != null ? ref3 : opt.getNotFound;
      o.setNotFound = (ref4 = override.setNotFound) != null ? ref4 : opt.setNotFound;
      o.delNotFound = (ref5 = override.delNotFound) != null ? ref5 : opt.delNotFound;
      return o;
    };
    api = void 0;
    if (hasObj && hasPtr && hasOpt) {
      api = function(value) {
        switch (arguments.length) {
          case 1:
            return JsonPointer.set(obj, ptr, value, opt);
          case 0:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(value, override) {
        return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(override) {
        return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasObj && hasPtr) {
      api = function(value) {
        switch (arguments.length) {
          case 1:
            return JsonPointer.set(obj, ptr, value);
          case 0:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(value, override) {
        return obj = JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(override) {
        return obj = JsonPointer.del(obj, ptr, override);
      };
    } else if (hasObj && hasOpt) {
      api = function(ptr, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value, opt);
          case 1:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(ptr, value, override) {
        return obj = JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(ptr, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(ptr, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(ptr, override) {
        return obj = JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasPtr && hasOpt) {
      api = function(obj, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value, opt);
          case 1:
            return JsonPointer.get(obj, ptr, opt);
          default:
            return null;
        }
      };
      api.set = function(obj, value, override) {
        return JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(obj, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(obj, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(obj, override) {
        return JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasOpt) {
      api = function(obj, ptr, value) {
        switch (arguments.length) {
          case 3:
            return JsonPointer.set(obj, ptr, value, opt);
          case 2:
            return JsonPointer.get(obj, ptr, opt);
          case 1:
            return api.smartBind({
              object: obj
            });
          default:
            return null;
        }
      };
      api.set = function(obj, ptr, value, override) {
        return JsonPointer.set(obj, ptr, value, mergeOptions(override));
      };
      api.get = function(obj, ptr, override) {
        return JsonPointer.get(obj, ptr, mergeOptions(override));
      };
      api.has = function(obj, ptr, override) {
        return JsonPointer.has(obj, ptr, mergeOptions(override));
      };
      api.del = function(obj, ptr, override) {
        return JsonPointer.del(obj, ptr, mergeOptions(override));
      };
    } else if (hasObj) {
      api = function(ptr, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value);
          case 1:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(ptr, value, override) {
        return obj = JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(ptr, override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(ptr, override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(ptr, override) {
        return obj = JsonPointer.del(obj, ptr, override);
      };
    } else if (hasPtr) {
      api = function(obj, value) {
        switch (arguments.length) {
          case 2:
            return JsonPointer.set(obj, ptr, value);
          case 1:
            return JsonPointer.get(obj, ptr);
          default:
            return null;
        }
      };
      api.set = function(obj, value, override) {
        return JsonPointer.set(obj, ptr, value, override);
      };
      api.get = function(obj, override) {
        return JsonPointer.get(obj, ptr, override);
      };
      api.has = function(obj, override) {
        return JsonPointer.has(obj, ptr, override);
      };
      api.del = function(obj, override) {
        return JsonPointer.del(obj, ptr, override);
      };
    } else {
      return this;
    }
    api.smartBind = function(override) {
      var o;
      o = {};
      if ({}.hasOwnProperty.call(override, 'object')) {
        o.object = override.object;
      } else if (hasObj) {
        o.object = obj;
      }
      if ({}.hasOwnProperty.call(override, 'pointer')) {
        o.pointer = override.pointer;
      } else if (hasPtr) {
        o.pointer = ptr;
      }
      if ({}.hasOwnProperty.call(override, 'options')) {
        o.options = mergeOptions(override.options);
      } else if (hasObj) {
        o.options = opt;
      }
      return JsonPointer.smartBind(o);
    };
    for (key in JsonPointer) {
      if (!hasProp1.call(JsonPointer, key)) continue;
      val = JsonPointer[key];
      if (!{}.hasOwnProperty.call(api, key)) {
        api[key] = val;
      }
    }
    return api;
  };


  /*
   * Escapes the given path segment as described by RFC6901.
   *
   * Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.escape = function(segment) {
    return segment.replace(/~/g, '~0').replace(/\//g, '~1');
  };


  /*
   * Un-Escapes the given path segment, reversing the actions of `.escape`.
   *
   * Notably, `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.unescape = function(segment) {
    return segment.replace(/~1/g, '/').replace(/~0/g, '~');
  };


  /*
   * Parses a json-pointer, as desribed by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parse = function(str) {
    if (str === '') {
      return [];
    }
    if (str.charAt(0) !== '/') {
      throw new JsonPointerError("Invalid JSON pointer: " + str);
    }
    return str.substring(1).split('/').map(JsonPointer.unescape);
  };


  /*
   * Converts an array of path segments into a json path.
   * This method is the reverse of `.parse`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compile = function(segments) {
    return segments.map(function(segment) {
      return '/' + JsonPointer.escape(segment);
    }).join('');
  };


  /*
   * Callback used to determine if an object contains a given property.
   *
   * @callback hasProp
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */


  /*
   * Returns true iff `obj` contains `key` and `obj` is either an Array or an Object.
   * Ignores the prototype chain.
   *
   * Default value for `options.hasProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasJsonProp = function(obj, key) {
    if (Array.isArray(obj)) {
      return (typeof key === 'number') && (key < obj.length);
    } else if (typeof obj === 'object') {
      return {}.hasOwnProperty.call(obj, key);
    } else {
      return false;
    }
  };


  /*
   * Returns true iff `obj` contains `key`, disregarding the prototype chain.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasOwnProp = function(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  };


  /*
   * Returns true iff `obj` contains `key`, including via the prototype chain.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {Boolean}
   */

  JsonPointer.hasProp = function(obj, key) {
    return key in obj;
  };


  /*
   * Callback used to retrieve a property from an object
   *
   * @callback getProp
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */


  /*
   * Finds the given `key` in `obj`.
   *
   * Default value for `options.getProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */

  JsonPointer.getProp = function(obj, key) {
    return obj[key];
  };


  /*
   * Callback used to set a property on an object.
   *
   * @callback setProp
   * @param {*} obj
   * @param {string|integer} key
   * @param {*} value
   * @returns {*}
   */


  /*
   * Sets the given `key` in `obj` to `value`.
   *
   * Default value for `options.setProp`.
   *
   * @param {*} obj
   * @param {string|integer} key
   * @param {*} value
   * @returns {*} `value`
   */

  JsonPointer.setProp = function(obj, key, value) {
    return obj[key] = value;
  };


  /*
   * Callback used to modify behaviour when a given path segment cannot be found.
   *
   * @callback notFound
   * @param {*} obj
   * @param {string|integer} key
   * @returns {*}
   */


  /*
   * Returns the value to use when `.get` fails to locate a pointer segment.
   *
   * Default value for `options.getNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.getNotFound = function(obj, segment, root, segments, iSegment) {
    return void 0;
  };


  /*
   * Returns the value to use when `.set` fails to locate a pointer segment.
   *
   * Default value for `options.setNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.setNotFound = function(obj, segment, root, segments, iSegment) {
    if (segments[iSegment + 1].match(/^(?:0|[1-9]\d*|-)$/)) {
      return obj[segment] = [];
    } else {
      return obj[segment] = {};
    }
  };


  /*
   * Performs an action when `.del` fails to locate a pointer segment.
   *
   * Default value for `options.delNotFound`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.delNotFound = function(obj, segment, root, segments, iSegment) {
    return void 0;
  };


  /*
   * Raises a JsonPointerError when the given pointer segment is not found.
   *
   * May be used in place of the above methods via the `options` argument of `./.get/.set/.has/.del/.simpleBind`.
   *
   * @param {*} obj
   * @param {string|integer} segment
   * @param {*} root
   * @param {string[]} segments
   * @param {integer} iSegment
   * @returns {undefined}
   */

  JsonPointer.errorNotFound = function(obj, segment, root, segments, iSegment) {
    throw new JsonPointerError("Unable to find json path: " + (JsonPointer.compile(segments.slice(0, iSegment + 1))));
  };


  /*
   * Sets the location in `object`, specified by `pointer`, to `value`.
   * If `pointer` refers to the whole document, `value` is returned without modifying `object`,
   * otherwise, `object` modified and returned.
   *
   * By default, if any location specified by `pointer` does not exist, the location is created using objects and arrays.
   * Arrays are used only when the immediately following path segment is an array element as defined by the standard.
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {setProp} options.setProp
   * @param {notFound} options.getNotFound
   * @returns {*}
   */

  JsonPointer.set = function(obj, pointer, value, options) {
    var getProp, hasProp, iSegment, len, ref, ref1, ref2, ref3, root, segment, setNotFound, setProp;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    if (pointer.length === 0) {
      return value;
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    setProp = (ref2 = options != null ? options.setProp : void 0) != null ? ref2 : JsonPointer.setProp;
    setNotFound = (ref3 = options != null ? options.setNotFound : void 0) != null ? ref3 : JsonPointer.setNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (iSegment === len) {
        setProp(obj, segment, value);
        break;
      } else if (!hasProp(obj, segment)) {
        obj = setNotFound(obj, segment, root, pointer, iSegment - 1);
      } else {
        obj = getProp(obj, segment);
      }
    }
    return root;
  };


  /*
   * Finds the value in `obj` as specified by `pointer`
   *
   * By default, returns undefined for values which cannot be found
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {notFound} options.getNotFound
   * @returns {*}
   */

  JsonPointer.get = function(obj, pointer, options) {
    var getNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    getNotFound = (ref2 = options != null ? options.getNotFound : void 0) != null ? ref2 : JsonPointer.getNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        return getNotFound(obj, segment, root, pointer, iSegment - 1);
      } else {
        obj = getProp(obj, segment);
      }
    }
    return obj;
  };


  /*
   * Removes the location, specified by `pointer`, from `object`.
   * Returns the modified `object`, or undefined if the `pointer` is empty.
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @param {notFound} options.delNotFound
   * @returns {*}
   */

  JsonPointer.del = function(obj, pointer, options) {
    var delNotFound, getProp, hasProp, iSegment, len, ref, ref1, ref2, root, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    if (pointer.length === 0) {
      return void 0;
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    delNotFound = (ref2 = options != null ? options.delNotFound : void 0) != null ? ref2 : JsonPointer.delNotFound;
    root = obj;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        delNotFound(obj, segment, root, pointer, iSegment - 1);
        break;
      } else if (iSegment === len) {
        delete obj[segment];
        break;
      } else {
        obj = getProp(obj, segment);
      }
    }
    return root;
  };


  /*
   * Returns true iff the location, specified by `pointer`, exists in `object`
   *
   * @param {*} obj
   * @param {string|string[]} pointer
   * @param {Object} options
   * @param {hasProp} options.hasProp
   * @param {getProp} options.getProp
   * @returns {*}
   */

  JsonPointer.has = function(obj, pointer, options) {
    var getProp, hasProp, iSegment, len, ref, ref1, segment;
    if (typeof pointer === 'string') {
      pointer = JsonPointer.parse(pointer);
    }
    hasProp = (ref = options != null ? options.hasProp : void 0) != null ? ref : JsonPointer.hasJsonProp;
    getProp = (ref1 = options != null ? options.getProp : void 0) != null ? ref1 : JsonPointer.getProp;
    iSegment = 0;
    len = pointer.length;
    while (iSegment !== len) {
      segment = pointer[iSegment];
      ++iSegment;
      if (segment === '-' && Array.isArray(obj)) {
        segment = obj.length;
      } else if (segment.match(/^(?:0|[1-9]\d*)$/) && Array.isArray(obj)) {
        segment = parseInt(segment, 10);
      }
      if (!hasProp(obj, segment)) {
        return false;
      }
      obj = getProp(obj, segment);
    }
    return true;
  };

  return JsonPointer;

})();

return JsonPointer;
}));

//# sourceMappingURL=data:application/json;base64,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Q0FBdEI7UUFDRSxPQUFBLEdBQVUsR0FBRyxDQUFDLE9BRGhCO09BQUEsTUFFSyxJQUFHLE9BQU8sQ0FBQyxLQUFSLENBQWMsa0JBQWQsQ0FBQSxJQUFzQyxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBekM7UUFDSCxPQUFBLEdBQVUsUUFBQSxDQUFTLE9BQVQsRUFBa0IsRUFBbEIsRUFEUDs7TUFHTCxJQUFHLENBQUksT0FBQSxDQUFRLEdBQVIsRUFBYSxPQUFiLENBQVA7QUFDRSxlQUFPLE1BRFQ7O01BR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYjtJQVpSO0FBY0EsV0FBTztFQXZCSCIsImZpbGUiOiJqc29uLXBvaW50ZXIudW1kLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSnNvblBvaW50ZXJFcnJvciBleHRlbmRzIEVycm9yXHJcbiAgY29uc3RydWN0b3I6IChtZXNzYWdlKSAtPlxyXG4gICAgYmFzZSA9IHN1cGVyKG1lc3NhZ2UpXHJcblxyXG4gICAgQG1lc3NhZ2UgPSBiYXNlLm1lc3NhZ2VcclxuICAgIEBzdGFjayA9IGJhc2Uuc3RhY2tcclxuICAgIEBuYW1lID0gQGNvbnN0cnVjdG9yLm5hbWVcclxuXHJcbmNsYXNzIEpzb25Qb2ludGVyXHJcbiAgQEpzb25Qb2ludGVyRXJyb3I6IEpzb25Qb2ludGVyRXJyb3JcclxuXHJcbiAgIyMjXHJcbiAgIyBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hvb3NpbmcgYmV0d2VlbiBgLnNtYXJ0QmluZGAsIGAuZ2V0YCwgYW5kIGAuc2V0YCwgZGVwZW5kaW5nIG9uIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqZWN0XHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gcG9pbnRlclxyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICMgQHJldHVybnMgeyp9IGV2YWx1YXRpb24gb2YgdGhlIHByb3hpZWQgbWV0aG9kXHJcbiAgIyMjXHJcbiAgY29uc3RydWN0b3I6IChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSAtPlxyXG4gICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgIHdoZW4gMyB0aGVuIEpzb25Qb2ludGVyLnNldChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKVxyXG4gICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqZWN0LCBwb2ludGVyKVxyXG4gICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zbWFydEJpbmQoeyBvYmplY3Q6IG9iamVjdCB9KVxyXG4gICAgICBlbHNlIG51bGxcclxuXHJcbiAgIyMjXHJcbiAgIyBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGFwaSwgd2l0aCBgLi8uZ2V0Ly5oYXMvLnNldC8uZGVsLy5zbWFydEJpbmRgIG1ldGhvZCBzaWduYXR1cmVzIGFkanVzdGVkLlxyXG4gICMgVGhlIHNtYXJ0QmluZCBtZXRob2QgaXMgY3VtdWxhdGl2ZSwgbWVhbmluZyB0aGF0IGAuc21hcnRCaW5kKHsgb2JqZWN0OiB4fSkuc21hcnRCaW5kKHsgcG9pbnRlcjogeSB9KWAgd2lsbCBiZWhhdmUgYXMgZXhwZWN0ZWQuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzXHJcbiAgIyBAcGFyYW0geyp9IGJpbmRpbmdzLm9iamVjdFxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGJpbmRpbmdzLnBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5ncy5vcHRpb25zXHJcbiAgIyBAcmV0dXJucyB7SnNvblBvaW50ZXJ9XHJcbiAgIyMjXHJcbiAgQHNtYXJ0QmluZDogKHsgb2JqZWN0OiBvYmosIHBvaW50ZXI6IHB0ciwgb3B0aW9uczogb3B0IH0pIC0+XHJcbiAgICAjIFdoYXQgYXJlIGJpbmRpbmc/XHJcbiAgICBoYXNPYmogPSBvYmogIT0gdW5kZWZpbmVkXHJcbiAgICBoYXNQdHIgPSBwdHI/XHJcbiAgICBoYXNPcHQgPSBvcHQ/XHJcblxyXG4gICAgIyBMZXRzIG5vdCBwYXJzZSB0aGlzIGV2ZXJ5IHRpbWUhXHJcbiAgICBpZiB0eXBlb2YgcHRyID09ICdzdHJpbmcnXHJcbiAgICAgIHB0ciA9IEBwYXJzZShwdHIpXHJcblxyXG4gICAgIyBkZWZhdWx0IG9wdGlvbnMgaGF2ZSBjaGFuZ2VkXHJcbiAgICBtZXJnZU9wdGlvbnMgPSAob3ZlcnJpZGUgPSB7fSkgLT5cclxuICAgICAgbyA9IHt9XHJcblxyXG4gICAgICBvLmhhc093blByb3AgPSBvdmVycmlkZS5oYXNPd25Qcm9wID8gb3B0Lmhhc093blByb3BcclxuICAgICAgby5nZXRQcm9wID0gb3ZlcnJpZGUuZ2V0UHJvcCA/IG9wdC5nZXRQcm9wXHJcbiAgICAgIG8uc2V0UHJvcCA9IG92ZXJyaWRlLnNldFByb3AgPyBvcHQuc2V0UHJvcFxyXG4gICAgICBvLmdldE5vdEZvdW5kID0gb3ZlcnJpZGUuZ2V0Tm90Rm91bmQgPyBvcHQuZ2V0Tm90Rm91bmRcclxuICAgICAgby5zZXROb3RGb3VuZCA9IG92ZXJyaWRlLnNldE5vdEZvdW5kID8gb3B0LnNldE5vdEZvdW5kXHJcbiAgICAgIG8uZGVsTm90Rm91bmQgPSBvdmVycmlkZS5kZWxOb3RGb3VuZCA/IG9wdC5kZWxOb3RGb3VuZFxyXG5cclxuICAgICAgcmV0dXJuIG9cclxuXHJcbiAgICBhcGkgPSB1bmRlZmluZWRcclxuXHJcbiAgICAjIEV2ZXJ5IGNvbWJpbmF0aW9uIG9mIGJpbmRpbmdzXHJcbiAgICBpZiBoYXNPYmogYW5kIGhhc1B0ciBhbmQgaGFzT3B0XHJcbiAgICAgIGFwaSA9ICh2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcclxuICAgICAgICAgIHdoZW4gMCB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmdldCA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5kZWwgPSAob3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgIGVsc2UgaWYgaGFzT2JqIGFuZCBoYXNQdHJcclxuICAgICAgYXBpID0gKHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcclxuICAgICAgICAgIHdoZW4gMCB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9ICh2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZ2V0ID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuaGFzID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZGVsID0gKG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgZWxzZSBpZiBoYXNPYmogYW5kIGhhc09wdFxyXG4gICAgICBhcGkgPSAocHRyLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmhhcyA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5kZWwgPSAocHRyLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNQdHIgYW5kIGhhc09wdFxyXG4gICAgICBhcGkgPSAob2JqLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmhhcyA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNPcHRcclxuICAgICAgYXBpID0gKG9iaiwgcHRyLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMyB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG9wdClcclxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gYXBpLnNtYXJ0QmluZCh7IG9iamVjdDogb2JqIH0pXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmdldCA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmhhcyA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChvYmosIHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgIGVsc2UgaWYgaGFzT2JqXHJcbiAgICAgIGFwaSA9IChwdHIsIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5nZXQgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmhhcyA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZGVsID0gKHB0ciwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICBlbHNlIGlmIGhhc1B0clxyXG4gICAgICBhcGkgPSAob2JqLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAob2JqLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmRlbCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gQFxyXG5cclxuICAgICMgc21hcnRCaW5kIGhhcyBuZXcgZGVmYXVsdHNcclxuICAgIGFwaS5zbWFydEJpbmQgPSAob3ZlcnJpZGUpIC0+XHJcbiAgICAgIG8gPSB7fVxyXG5cclxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ29iamVjdCcpXHJcbiAgICAgICAgby5vYmplY3QgPSBvdmVycmlkZS5vYmplY3RcclxuICAgICAgZWxzZSBpZiBoYXNPYmpcclxuICAgICAgICBvLm9iamVjdCA9IG9ialxyXG5cclxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ3BvaW50ZXInKVxyXG4gICAgICAgIG8ucG9pbnRlciA9IG92ZXJyaWRlLnBvaW50ZXJcclxuICAgICAgZWxzZSBpZiBoYXNQdHJcclxuICAgICAgICBvLnBvaW50ZXIgPSBwdHJcclxuXHJcbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdvcHRpb25zJylcclxuICAgICAgICBvLm9wdGlvbnMgPSBtZXJnZU9wdGlvbnMob3ZlcnJpZGUub3B0aW9ucylcclxuICAgICAgZWxzZSBpZiBoYXNPYmpcclxuICAgICAgICBvLm9wdGlvbnMgPSBvcHRcclxuXHJcbiAgICAgIHJldHVybiBKc29uUG9pbnRlci5zbWFydEJpbmQobylcclxuXHJcbiAgICAjIGNvcHkgdGhlIHJlbWFpbmluZyBtZXRob2RzIHdoaWNoIGRvIG5vdCBuZWVkIGJpbmRpbmdcclxuICAgIGZvciBvd24ga2V5LCB2YWwgb2YgSnNvblBvaW50ZXJcclxuICAgICAgaWYgbm90IHt9Lmhhc093blByb3BlcnR5LmNhbGwoYXBpLCBrZXkpXHJcbiAgICAgICAgYXBpW2tleV0gPSB2YWxcclxuXHJcbiAgICAjIGZpbmFsIHJlc3VsdFxyXG4gICAgcmV0dXJuIGFwaVxyXG5cclxuICAjIyNcclxuICAjIEVzY2FwZXMgdGhlIGdpdmVuIHBhdGggc2VnbWVudCBhcyBkZXNjcmliZWQgYnkgUkZDNjkwMS5cclxuICAjXHJcbiAgIyBOb3RhYmx5LCBgJ34nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjAnYCBhbmQgYCcvJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34xJ2AuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcclxuICAjIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgIyMjXHJcbiAgQGVzY2FwZTogKHNlZ21lbnQpIC0+XHJcbiAgICBzZWdtZW50LnJlcGxhY2UoL34vZywgJ34wJykucmVwbGFjZSgvXFwvL2csICd+MScpXHJcblxyXG4gICMjI1xyXG4gICMgVW4tRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBzZWdtZW50LCByZXZlcnNpbmcgdGhlIGFjdGlvbnMgb2YgYC5lc2NhcGVgLlxyXG4gICNcclxuICAjIE5vdGFibHksIGAnfjEnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnLydgIGFuZCBgJ34wJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34nYC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxyXG4gICMgQHJldHVybnMge3N0cmluZ31cclxuICAjIyNcclxuICBAdW5lc2NhcGU6IChzZWdtZW50KSAtPlxyXG4gICAgc2VnbWVudC5yZXBsYWNlKC9+MS9nLCAnLycpLnJlcGxhY2UoL34wL2csICd+JylcclxuXHJcbiAgIyMjXHJcbiAgIyBQYXJzZXMgYSBqc29uLXBvaW50ZXIsIGFzIGRlc3JpYmVkIGJ5IFJGQzkwMSwgaW50byBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzLlxyXG4gICNcclxuICAjIEB0aHJvd3Mge0pzb25Qb2ludGVyRXJyb3J9IGZvciBpbnZhbGlkIGpzb24tcG9pbnRlcnMuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICMgQHJldHVybnMge3N0cmluZ1tdfVxyXG4gICMjI1xyXG4gIEBwYXJzZTogKHN0cikgLT5cclxuICAgIGlmIHN0ciA9PSAnJ1xyXG4gICAgICByZXR1cm4gW11cclxuXHJcbiAgICBpZiBzdHIuY2hhckF0KDApICE9ICcvJ1xyXG4gICAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBwb2ludGVyOiAje3N0cn1cIilcclxuXHJcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZygxKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZSlcclxuXHJcbiAgIyMjXHJcbiAgIyBDb252ZXJ0cyBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzIGludG8gYSBqc29uIHBhdGguXHJcbiAgIyBUaGlzIG1ldGhvZCBpcyB0aGUgcmV2ZXJzZSBvZiBgLnBhcnNlYC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHJldHVybnMge3N0cmluZ31cclxuICAjIyNcclxuICBAY29tcGlsZTogKHNlZ21lbnRzKSAtPlxyXG4gICAgc2VnbWVudHMubWFwKChzZWdtZW50KSAtPiAnLycgKyBKc29uUG9pbnRlci5lc2NhcGUoc2VnbWVudCkpLmpvaW4oJycpXHJcblxyXG4gICMjI1xyXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBkZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGNvbnRhaW5zIGEgZ2l2ZW4gcHJvcGVydHkuXHJcbiAgI1xyXG4gICMgQGNhbGxiYWNrIGhhc1Byb3BcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAgYW5kIGBvYmpgIGlzIGVpdGhlciBhbiBBcnJheSBvciBhbiBPYmplY3QuXHJcbiAgIyBJZ25vcmVzIHRoZSBwcm90b3R5cGUgY2hhaW4uXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuaGFzUHJvcGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGhhc0pzb25Qcm9wOiAob2JqLCBrZXkpIC0+XHJcbiAgICBpZiBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgcmV0dXJuICh0eXBlb2Yga2V5ID09ICdudW1iZXInKSBhbmQgKGtleSA8IG9iai5sZW5ndGgpXHJcbiAgICBlbHNlIGlmIHR5cGVvZiBvYmogPT0gJ29iamVjdCdcclxuICAgICAgcmV0dXJuIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAsIGRpc3JlZ2FyZGluZyB0aGUgcHJvdG90eXBlIGNoYWluLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICMjI1xyXG4gIEBoYXNPd25Qcm9wOiAob2JqLCBrZXkpIC0+XHJcbiAgICB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdHJ1ZSBpZmYgYG9iamAgY29udGFpbnMgYGtleWAsIGluY2x1ZGluZyB2aWEgdGhlIHByb3RvdHlwZSBjaGFpbi5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAjIyNcclxuICBAaGFzUHJvcDogKG9iaiwga2V5KSAtPlxyXG4gICAga2V5IG9mIG9ialxyXG5cclxuICAjIyNcclxuICAjIENhbGxiYWNrIHVzZWQgdG8gcmV0cmlldmUgYSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdFxyXG4gICNcclxuICAjIEBjYWxsYmFjayBnZXRQcm9wXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuXHJcbiAgIyMjXHJcbiAgIyBGaW5kcyB0aGUgZ2l2ZW4gYGtleWAgaW4gYG9iamAuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZ2V0UHJvcGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGdldFByb3A6IChvYmosIGtleSkgLT5cclxuICAgIG9ialtrZXldXHJcblxyXG4gICMjI1xyXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBzZXQgYSBwcm9wZXJ0eSBvbiBhbiBvYmplY3QuXHJcbiAgI1xyXG4gICMgQGNhbGxiYWNrIHNldFByb3BcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIFNldHMgdGhlIGdpdmVuIGBrZXlgIGluIGBvYmpgIHRvIGB2YWx1ZWAuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuc2V0UHJvcGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICMgQHJldHVybnMgeyp9IGB2YWx1ZWBcclxuICAjIyNcclxuICBAc2V0UHJvcDogKG9iaiwga2V5LCB2YWx1ZSkgLT5cclxuICAgIG9ialtrZXldID0gdmFsdWVcclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIG1vZGlmeSBiZWhhdmlvdXIgd2hlbiBhIGdpdmVuIHBhdGggc2VnbWVudCBjYW5ub3QgYmUgZm91bmQuXHJcbiAgI1xyXG4gICMgQGNhbGxiYWNrIG5vdEZvdW5kXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRoZSB2YWx1ZSB0byB1c2Ugd2hlbiBgLmdldGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmdldE5vdEZvdW5kYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxyXG4gICMgQHBhcmFtIHsqfSByb290XHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxyXG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAjIyNcclxuICBAZ2V0Tm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cclxuICAgIHVuZGVmaW5lZFxyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdGhlIHZhbHVlIHRvIHVzZSB3aGVuIGAuc2V0YCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuc2V0Tm90Rm91bmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBzZXROb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgaWYgc2VnbWVudHNbaVNlZ21lbnQgKyAxXS5tYXRjaCgvXig/OjB8WzEtOV1cXGQqfC0pJC8pXHJcbiAgICAgIHJldHVybiBvYmpbc2VnbWVudF0gPSBbXVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gb2JqW3NlZ21lbnRdID0ge31cclxuXHJcbiAgIyMjXHJcbiAgIyBQZXJmb3JtcyBhbiBhY3Rpb24gd2hlbiBgLmRlbGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmRlbE5vdEZvdW5kYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxyXG4gICMgQHBhcmFtIHsqfSByb290XHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxyXG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAjIyNcclxuICBAZGVsTm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cclxuICAgIHVuZGVmaW5lZFxyXG5cclxuICAjIyNcclxuICAjIFJhaXNlcyBhIEpzb25Qb2ludGVyRXJyb3Igd2hlbiB0aGUgZ2l2ZW4gcG9pbnRlciBzZWdtZW50IGlzIG5vdCBmb3VuZC5cclxuICAjXHJcbiAgIyBNYXkgYmUgdXNlZCBpbiBwbGFjZSBvZiB0aGUgYWJvdmUgbWV0aG9kcyB2aWEgdGhlIGBvcHRpb25zYCBhcmd1bWVudCBvZiBgLi8uZ2V0Ly5zZXQvLmhhcy8uZGVsLy5zaW1wbGVCaW5kYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxyXG4gICMgQHBhcmFtIHsqfSByb290XHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxyXG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAjIyNcclxuICBAZXJyb3JOb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJVbmFibGUgdG8gZmluZCBqc29uIHBhdGg6ICN7SnNvblBvaW50ZXIuY29tcGlsZShzZWdtZW50cy5zbGljZSgwLCBpU2VnbWVudCsxKSl9XCIpXHJcblxyXG4gICMjI1xyXG4gICMgU2V0cyB0aGUgbG9jYXRpb24gaW4gYG9iamVjdGAsIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIHRvIGB2YWx1ZWAuXHJcbiAgIyBJZiBgcG9pbnRlcmAgcmVmZXJzIHRvIHRoZSB3aG9sZSBkb2N1bWVudCwgYHZhbHVlYCBpcyByZXR1cm5lZCB3aXRob3V0IG1vZGlmeWluZyBgb2JqZWN0YCxcclxuICAjIG90aGVyd2lzZSwgYG9iamVjdGAgbW9kaWZpZWQgYW5kIHJldHVybmVkLlxyXG4gICNcclxuICAjIEJ5IGRlZmF1bHQsIGlmIGFueSBsb2NhdGlvbiBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgIGRvZXMgbm90IGV4aXN0LCB0aGUgbG9jYXRpb24gaXMgY3JlYXRlZCB1c2luZyBvYmplY3RzIGFuZCBhcnJheXMuXHJcbiAgIyBBcnJheXMgYXJlIHVzZWQgb25seSB3aGVuIHRoZSBpbW1lZGlhdGVseSBmb2xsb3dpbmcgcGF0aCBzZWdtZW50IGlzIGFuIGFycmF5IGVsZW1lbnQgYXMgZGVmaW5lZCBieSB0aGUgc3RhbmRhcmQuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcclxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXHJcbiAgIyBAcGFyYW0ge3NldFByb3B9IG9wdGlvbnMuc2V0UHJvcFxyXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5nZXROb3RGb3VuZFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQHNldDogKG9iaiwgcG9pbnRlciwgdmFsdWUsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xyXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcclxuXHJcbiAgICBpZiBwb2ludGVyLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVybiB2YWx1ZVxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG4gICAgc2V0UHJvcCA9IG9wdGlvbnM/LnNldFByb3AgPyBKc29uUG9pbnRlci5zZXRQcm9wXHJcbiAgICBzZXROb3RGb3VuZCA9IG9wdGlvbnM/LnNldE5vdEZvdW5kID8gSnNvblBvaW50ZXIuc2V0Tm90Rm91bmRcclxuXHJcbiAgICByb290ID0gb2JqXHJcbiAgICBpU2VnbWVudCA9IDBcclxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXHJcblxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBpU2VnbWVudCA9PSBsZW5cclxuICAgICAgICBzZXRQcm9wKG9iaiwgc2VnbWVudCwgdmFsdWUpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZWxzZSBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgb2JqID0gc2V0Tm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcclxuXHJcbiAgICByZXR1cm4gcm9vdFxyXG5cclxuICAjIyNcclxuICAjIEZpbmRzIHRoZSB2YWx1ZSBpbiBgb2JqYCBhcyBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgXHJcbiAgI1xyXG4gICMgQnkgZGVmYXVsdCwgcmV0dXJucyB1bmRlZmluZWQgZm9yIHZhbHVlcyB3aGljaCBjYW5ub3QgYmUgZm91bmRcclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxyXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcclxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZ2V0Tm90Rm91bmRcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG4gIEBnZXQ6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xyXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcclxuXHJcbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXHJcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcclxuICAgIGdldE5vdEZvdW5kID0gb3B0aW9ucz8uZ2V0Tm90Rm91bmQgPyBKc29uUG9pbnRlci5nZXROb3RGb3VuZFxyXG5cclxuICAgIHJvb3QgPSBvYmpcclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxyXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cclxuICAgICAgKytpU2VnbWVudFxyXG5cclxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXHJcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxyXG5cclxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxyXG4gICAgICAgIHJldHVybiBnZXROb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiBvYmpcclxuXHJcbiAgIyMjXHJcbiAgIyBSZW1vdmVzIHRoZSBsb2NhdGlvbiwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgZnJvbSBgb2JqZWN0YC5cclxuICAjIFJldHVybnMgdGhlIG1vZGlmaWVkIGBvYmplY3RgLCBvciB1bmRlZmluZWQgaWYgdGhlIGBwb2ludGVyYCBpcyBlbXB0eS5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxyXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcclxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZGVsTm90Rm91bmRcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG4gIEBkZWw6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xyXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcclxuXHJcbiAgICBpZiBwb2ludGVyLmxlbmd0aCA9PSAwXHJcbiAgICAgIHJldHVybiB1bmRlZmluZWRcclxuXHJcbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXHJcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcclxuICAgIGRlbE5vdEZvdW5kID0gb3B0aW9ucz8uZGVsTm90Rm91bmQgPyBKc29uUG9pbnRlci5kZWxOb3RGb3VuZFxyXG5cclxuICAgIHJvb3QgPSBvYmpcclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxyXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cclxuICAgICAgKytpU2VnbWVudFxyXG5cclxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXHJcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxyXG5cclxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxyXG4gICAgICAgIGRlbE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGVsc2UgaWYgaVNlZ21lbnQgPT0gbGVuXHJcbiAgICAgICAgZGVsZXRlIG9ialtzZWdtZW50XVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcclxuXHJcbiAgICByZXR1cm4gcm9vdFxyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdHJ1ZSBpZmYgdGhlIGxvY2F0aW9uLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCBleGlzdHMgaW4gYG9iamVjdGBcclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxyXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG4gIEBoYXM6IChvYmosIHBvaW50ZXIsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiB0eXBlb2YgcG9pbnRlciA9PSAnc3RyaW5nJ1xyXG4gICAgICBwb2ludGVyID0gSnNvblBvaW50ZXIucGFyc2UocG9pbnRlcilcclxuXHJcbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXHJcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcclxuXHJcbiAgICBpU2VnbWVudCA9IDBcclxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXHJcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cclxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXHJcbiAgICAgICsraVNlZ21lbnRcclxuXHJcbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxyXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcclxuXHJcbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiB0cnVlXHJcbiJdfQ==