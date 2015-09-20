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
    var api, frag, hasObj, hasOpt, hasPtr, key, mergeOptions, obj, opt, ptr, val;
    obj = arg.object, ptr = arg.pointer, frag = arg.fragment, opt = arg.options;
    ptr = frag != null ? frag : ptr;
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
    if (hasPtr) {

      /*
       * get/set bound pointer value
       *
       * Only available when pointer has been bound
       *
       * @param {string} value
       * @returns string[] segments
       */
      api.pointer = function(value) {
        if (arguments.length === 0) {
          return JsonPointer.compilePointer(ptr);
        } else {
          return ptr = JsonPointer.parsePointer(value);
        }
      };

      /*
       * get/set bound pointer value as fragment
       *
       * Only available when pointer has been bound
       *
       * @param {string} value
       * @returns string[] segments
       */
      api.fragment = function(value) {
        if (arguments.length === 0) {
          return JsonPointer.compileFragment(ptr);
        } else {
          return ptr = JsonPointer.parseFragment(value);
        }
      };
    }
    if (hasObj) {

      /*
       * get/set bound object
       *
       * Only available when object has been bound
       *
       * @param {*} value
       * @returns {*} bound object
       */
      api.object = function(value) {
        if (arguments.length === 0) {
          return obj;
        } else {
          return obj = value;
        }
      };
    }
    if (hasOpt) {

      /*
       * get/set bound options
       *
       * Only available when options has been bound
       *
       * @param {*} value
       * @returns {*} bound options
       */
      api.options = function(value) {
        if (arguments.length === 0) {
          return opt;
        } else {
          return opt = value;
        }
      };
    }
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
   * Escapes the given path fragment segment as described by RFC6901.
   *
   * Notably, `'~'`'s are replaced with `'~0'` and `'/'`'s are replaced with `'~1'` and finally the string is URI encoded.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.escapeFragment = function(segment) {
    return encodeURIComponent(JsonPointer.escape(segment));
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
   * Un-Escapes the given path fragment segment, reversing the actions of `.escapeFragment`.
   *
   * Notably, the string is URI decoded and then `'~1'`'s are replaced with `'/'` and `'~0'`'s are replaced with `'~'`.
   *
   * @param {string} segment
   * @returns {string}
   */

  JsonPointer.unescapeFragment = function(segment) {
    return JsonPointer.unescape(decodeURIComponent(segment));
  };


  /*
   * Returns true iff `str` is a valid json pointer value
   *
   * @param {string} str
   * @returns {Boolean}
   */

  JsonPointer.isPointer = function(str) {
    switch (str.charAt(0)) {
      case '':
        return true;
      case '/':
        return true;
      default:
        return false;
    }
  };


  /*
   * Returns true iff `str` is a valid json fragment pointer value
   *
   * @param {string} str
   * @returns {Boolean}
   */

  JsonPointer.isFragment = function(str) {
    switch (str.substring(0, 2)) {
      case '#':
        return true;
      case '#/':
        return true;
      default:
        return false;
    }
  };


  /*
   * Parses a json-pointer or json fragment pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parse = function(str) {
    switch (str.charAt(0)) {
      case '':
        return [];
      case '/':
        return str.substring(1).split('/').map(JsonPointer.unescape);
      case '#':
        switch (str.charAt(1)) {
          case '':
            return [];
          case '/':
            return str.substring(2).split('/').map(JsonPointer.unescapeFragment);
          default:
            throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
        }
        break;
      default:
        throw new JsonPointerError("Invalid JSON pointer: " + str);
    }
  };


  /*
   * Parses a json-pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parsePointer = function(str) {
    switch (str.charAt(0)) {
      case '':
        return [];
      case '/':
        return str.substring(1).split('/').map(JsonPointer.unescape);
      default:
        throw new JsonPointerError("Invalid JSON pointer: " + str);
    }
  };


  /*
   * Parses a json fragment pointer, as described by RFC901, into an array of path segments.
   *
   * @throws {JsonPointerError} for invalid json-pointers.
   *
   * @param {string} str
   * @returns {string[]}
   */

  JsonPointer.parseFragment = function(str) {
    switch (str.substring(0, 2)) {
      case '#':
        return [];
      case '#/':
        return str.substring(2).split('/').map(JsonPointer.unescapeFragment);
      default:
        throw new JsonPointerError("Invalid JSON fragment pointer: " + str);
    }
  };


  /*
   * Converts an array of path segments into a json pointer.
   * This method is the reverse of `.parsePointer`.
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
   * Converts an array of path segments into a json pointer.
   * This method is the reverse of `.parsePointer`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compilePointer = function(segments) {
    return segments.map(function(segment) {
      return '/' + JsonPointer.escape(segment);
    }).join('');
  };


  /*
   * Converts an array of path segments into a json fragment pointer.
   * This method is the reverse of `.parseFragment`.
   *
   * @param {string[]} segments
   * @returns {string}
   */

  JsonPointer.compileFragment = function(segments) {
    return '#' + segments.map(function(segment) {
      return '/' + JsonPointer.escapeFragment(segment);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb24tcG9pbnRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1NBQUEsSUFBQSw2QkFBQTtFQUFBOzs7QUFBTTs7O0VBQ1MsMEJBQUMsT0FBRDtBQUNYLFFBQUE7SUFBQSxJQUFBLEdBQU8sa0RBQU0sT0FBTjtJQUVQLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDO0lBQ2hCLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBSSxDQUFDO0lBQ2QsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsV0FBVyxDQUFDO0VBTFY7Ozs7R0FEZ0I7O0FBUXpCO0VBQ0osV0FBQyxDQUFBLGdCQUFELEdBQW1COzs7QUFFbkI7Ozs7Ozs7OztFQVFhLHFCQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLEtBQWxCO0FBQ0osWUFBTyxTQUFTLENBQUMsTUFBakI7QUFBQSxXQUNBLENBREE7ZUFDTyxXQUFXLENBQUMsR0FBWixDQUFnQixNQUFoQixFQUF3QixPQUF4QixFQUFpQyxLQUFqQztBQURQLFdBRUEsQ0FGQTtlQUVPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLE1BQWhCLEVBQXdCLE9BQXhCO0FBRlAsV0FHQSxDQUhBO2VBR08sV0FBVyxDQUFDLFNBQVosQ0FBc0I7VUFBRSxNQUFBLEVBQVEsTUFBVjtTQUF0QjtBQUhQO2VBSUE7QUFKQTtFQURJOzs7QUFPYjs7Ozs7Ozs7Ozs7RUFVQSxXQUFDLENBQUEsU0FBRCxHQUFZLFNBQUMsR0FBRDtBQUVWLFFBQUE7SUFGcUIsVUFBUixRQUFzQixVQUFULFNBQXdCLFdBQVYsVUFBeUIsVUFBVDtJQUV4RCxHQUFBLGtCQUFNLE9BQU87SUFHYixNQUFBLEdBQVMsR0FBQSxLQUFPO0lBQ2hCLE1BQUEsR0FBUztJQUNULE1BQUEsR0FBUztJQUdULElBQUcsT0FBTyxHQUFQLEtBQWMsUUFBakI7TUFDRSxHQUFBLEdBQU0sSUFBQyxDQUFBLEtBQUQsQ0FBTyxHQUFQLEVBRFI7O0lBSUEsWUFBQSxHQUFlLFNBQUMsUUFBRDtBQUNiLFVBQUE7O1FBRGMsV0FBVzs7TUFDekIsQ0FBQSxHQUFJO01BRUosQ0FBQyxDQUFDLFVBQUYsK0NBQXFDLEdBQUcsQ0FBQztNQUN6QyxDQUFDLENBQUMsT0FBRiw4Q0FBK0IsR0FBRyxDQUFDO01BQ25DLENBQUMsQ0FBQyxPQUFGLDhDQUErQixHQUFHLENBQUM7TUFDbkMsQ0FBQyxDQUFDLFdBQUYsa0RBQXVDLEdBQUcsQ0FBQztNQUMzQyxDQUFDLENBQUMsV0FBRixrREFBdUMsR0FBRyxDQUFDO01BQzNDLENBQUMsQ0FBQyxXQUFGLGtEQUF1QyxHQUFHLENBQUM7QUFFM0MsYUFBTztJQVZNO0lBWWYsR0FBQSxHQUFNO0lBR04sSUFBRyxNQUFBLElBQVcsTUFBWCxJQUFzQixNQUF6QjtNQUNFLEdBQUEsR0FBTSxTQUFDLEtBQUQ7QUFDRyxnQkFBTyxTQUFTLENBQUMsTUFBakI7QUFBQSxlQUNBLENBREE7bUJBQ08sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUMsR0FBakM7QUFEUCxlQUVBLENBRkE7bUJBRU8sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsR0FBMUI7QUFGUDttQkFHQTtBQUhBO01BREg7TUFNTixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsS0FBRCxFQUFRLFFBQVI7ZUFBcUIsR0FBQSxHQUFNLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDLFlBQUEsQ0FBYSxRQUFiLENBQWpDO01BQTNCO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixZQUFBLENBQWEsUUFBYixDQUExQjtNQUFkO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixZQUFBLENBQWEsUUFBYixDQUExQjtNQUFkO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxHQUFBLEdBQU0sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBcEIsRUFWWjtLQUFBLE1BV0ssSUFBRyxNQUFBLElBQVcsTUFBZDtNQUNILEdBQUEsR0FBTSxTQUFDLEtBQUQ7QUFDRyxnQkFBTyxTQUFTLENBQUMsTUFBakI7QUFBQSxlQUNBLENBREE7bUJBQ08sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUI7QUFEUCxlQUVBLENBRkE7bUJBRU8sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckI7QUFGUDttQkFHQTtBQUhBO01BREg7TUFNTixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsS0FBRCxFQUFRLFFBQVI7ZUFBcUIsR0FBQSxHQUFNLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDLFFBQWpDO01BQTNCO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixRQUExQjtNQUFkO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixRQUExQjtNQUFkO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLFFBQUQ7ZUFBYyxHQUFBLEdBQU0sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsUUFBMUI7TUFBcEIsRUFWUDtLQUFBLE1BV0EsSUFBRyxNQUFBLElBQVcsTUFBZDtNQUNILEdBQUEsR0FBTSxTQUFDLEdBQUQsRUFBTSxLQUFOO0FBQ0csZ0JBQU8sU0FBUyxDQUFDLE1BQWpCO0FBQUEsZUFDQSxDQURBO21CQUNPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDLEdBQWpDO0FBRFAsZUFFQSxDQUZBO21CQUVPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEdBQTFCO0FBRlA7bUJBR0E7QUFIQTtNQURIO01BTU4sR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsUUFBYjtlQUEwQixHQUFBLEdBQU0sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUMsWUFBQSxDQUFhLFFBQWIsQ0FBakM7TUFBaEM7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsR0FBQSxHQUFNLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLFlBQUEsQ0FBYSxRQUFiLENBQTFCO01BQXpCLEVBVlA7S0FBQSxNQVdBLElBQUcsTUFBQSxJQUFXLE1BQWQ7TUFDSCxHQUFBLEdBQU0sU0FBQyxHQUFELEVBQU0sS0FBTjtBQUNHLGdCQUFPLFNBQVMsQ0FBQyxNQUFqQjtBQUFBLGVBQ0EsQ0FEQTttQkFDTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixLQUExQixFQUFpQyxHQUFqQztBQURQLGVBRUEsQ0FGQTttQkFFTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixHQUExQjtBQUZQO21CQUdBO0FBSEE7TUFESDtNQU1OLEdBQUcsQ0FBQyxHQUFKLEdBQVUsU0FBQyxHQUFELEVBQU0sS0FBTixFQUFhLFFBQWI7ZUFBMEIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUMsWUFBQSxDQUFhLFFBQWIsQ0FBakM7TUFBMUI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBbkIsRUFWUDtLQUFBLE1BV0EsSUFBRyxNQUFIO01BQ0gsR0FBQSxHQUFNLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxLQUFYO0FBQ0csZ0JBQU8sU0FBUyxDQUFDLE1BQWpCO0FBQUEsZUFDQSxDQURBO21CQUNPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDLEdBQWpDO0FBRFAsZUFFQSxDQUZBO21CQUVPLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEdBQTFCO0FBRlAsZUFHQSxDQUhBO21CQUdPLEdBQUcsQ0FBQyxTQUFKLENBQWM7Y0FBRSxNQUFBLEVBQVEsR0FBVjthQUFkO0FBSFA7bUJBSUE7QUFKQTtNQURIO01BT04sR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsS0FBWCxFQUFrQixRQUFsQjtlQUErQixXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixLQUExQixFQUFpQyxZQUFBLENBQWEsUUFBYixDQUFqQztNQUEvQjtNQUNWLEdBQUcsQ0FBQyxHQUFKLEdBQVUsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLFFBQVg7ZUFBd0IsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsWUFBQSxDQUFhLFFBQWIsQ0FBMUI7TUFBeEI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxRQUFYO2VBQXdCLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLFlBQUEsQ0FBYSxRQUFiLENBQTFCO01BQXhCO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsUUFBWDtlQUF3QixXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixZQUFBLENBQWEsUUFBYixDQUExQjtNQUF4QixFQVhQO0tBQUEsTUFZQSxJQUFHLE1BQUg7TUFDSCxHQUFBLEdBQU0sU0FBQyxHQUFELEVBQU0sS0FBTjtBQUNHLGdCQUFPLFNBQVMsQ0FBQyxNQUFqQjtBQUFBLGVBQ0EsQ0FEQTttQkFDTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixLQUExQjtBQURQLGVBRUEsQ0FGQTttQkFFTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQjtBQUZQO21CQUdBO0FBSEE7TUFESDtNQU1OLEdBQUcsQ0FBQyxHQUFKLEdBQVUsU0FBQyxHQUFELEVBQU0sS0FBTixFQUFhLFFBQWI7ZUFBMEIsR0FBQSxHQUFNLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLEtBQTFCLEVBQWlDLFFBQWpDO01BQWhDO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxRQUFOO2VBQW1CLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLFFBQTFCO01BQW5CO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxRQUFOO2VBQW1CLFdBQVcsQ0FBQyxHQUFaLENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCLFFBQTFCO01BQW5CO01BQ1YsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLEdBQUQsRUFBTSxRQUFOO2VBQW1CLEdBQUEsR0FBTSxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixRQUExQjtNQUF6QixFQVZQO0tBQUEsTUFXQSxJQUFHLE1BQUg7TUFDSCxHQUFBLEdBQU0sU0FBQyxHQUFELEVBQU0sS0FBTjtBQUNHLGdCQUFPLFNBQVMsQ0FBQyxNQUFqQjtBQUFBLGVBQ0EsQ0FEQTttQkFDTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQixFQUEwQixLQUExQjtBQURQLGVBRUEsQ0FGQTttQkFFTyxXQUFXLENBQUMsR0FBWixDQUFnQixHQUFoQixFQUFxQixHQUFyQjtBQUZQO21CQUdBO0FBSEE7TUFESDtNQU1OLEdBQUcsQ0FBQyxHQUFKLEdBQVUsU0FBQyxHQUFELEVBQU0sS0FBTixFQUFhLFFBQWI7ZUFBMEIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUMsUUFBakM7TUFBMUI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsUUFBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsUUFBMUI7TUFBbkI7TUFDVixHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsR0FBRCxFQUFNLFFBQU47ZUFBbUIsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEIsUUFBMUI7TUFBbkIsRUFWUDtLQUFBLE1BQUE7QUFZSCxhQUFPLEtBWko7O0lBZUwsR0FBRyxDQUFDLFNBQUosR0FBZ0IsU0FBQyxRQUFEO0FBQ2QsVUFBQTtNQUFBLENBQUEsR0FBSTtNQUVKLElBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFsQixDQUF1QixRQUF2QixFQUFpQyxRQUFqQyxDQUFIO1FBQ0UsQ0FBQyxDQUFDLE1BQUYsR0FBVyxRQUFRLENBQUMsT0FEdEI7T0FBQSxNQUVLLElBQUcsTUFBSDtRQUNILENBQUMsQ0FBQyxNQUFGLEdBQVcsSUFEUjs7TUFHTCxJQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBbEIsQ0FBdUIsUUFBdkIsRUFBaUMsU0FBakMsQ0FBSDtRQUNFLENBQUMsQ0FBQyxPQUFGLEdBQVksUUFBUSxDQUFDLFFBRHZCO09BQUEsTUFFSyxJQUFHLE1BQUg7UUFDSCxDQUFDLENBQUMsT0FBRixHQUFZLElBRFQ7O01BR0wsSUFBRyxFQUFFLENBQUMsY0FBYyxDQUFDLElBQWxCLENBQXVCLFFBQXZCLEVBQWlDLFNBQWpDLENBQUg7UUFDRSxDQUFDLENBQUMsT0FBRixHQUFZLFlBQUEsQ0FBYSxRQUFRLENBQUMsT0FBdEIsRUFEZDtPQUFBLE1BRUssSUFBRyxNQUFIO1FBQ0gsQ0FBQyxDQUFDLE9BQUYsR0FBWSxJQURUOztBQUdMLGFBQU8sV0FBVyxDQUFDLFNBQVosQ0FBc0IsQ0FBdEI7SUFsQk87SUFvQmhCLElBQUcsTUFBSDs7QUFDRTs7Ozs7Ozs7TUFRQSxHQUFHLENBQUMsT0FBSixHQUFjLFNBQUMsS0FBRDtRQUNaLElBQUcsU0FBUyxDQUFDLE1BQVYsS0FBb0IsQ0FBdkI7QUFDRSxpQkFBTyxXQUFXLENBQUMsY0FBWixDQUEyQixHQUEzQixFQURUO1NBQUEsTUFBQTtBQUdFLGlCQUFPLEdBQUEsR0FBTSxXQUFXLENBQUMsWUFBWixDQUF5QixLQUF6QixFQUhmOztNQURZOztBQU1kOzs7Ozs7OztNQVFBLEdBQUcsQ0FBQyxRQUFKLEdBQWUsU0FBQyxLQUFEO1FBQ2IsSUFBRyxTQUFTLENBQUMsTUFBVixLQUFvQixDQUF2QjtBQUNFLGlCQUFPLFdBQVcsQ0FBQyxlQUFaLENBQTRCLEdBQTVCLEVBRFQ7U0FBQSxNQUFBO0FBR0UsaUJBQU8sR0FBQSxHQUFNLFdBQVcsQ0FBQyxhQUFaLENBQTBCLEtBQTFCLEVBSGY7O01BRGEsRUF2QmpCOztJQTZCQSxJQUFHLE1BQUg7O0FBQ0U7Ozs7Ozs7O01BUUEsR0FBRyxDQUFDLE1BQUosR0FBYSxTQUFDLEtBQUQ7UUFDWCxJQUFHLFNBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQXZCO0FBQ0UsaUJBQU8sSUFEVDtTQUFBLE1BQUE7QUFHRSxpQkFBTyxHQUFBLEdBQU0sTUFIZjs7TUFEVyxFQVRmOztJQWVBLElBQUcsTUFBSDs7QUFDRTs7Ozs7Ozs7TUFRQSxHQUFHLENBQUMsT0FBSixHQUFjLFNBQUMsS0FBRDtRQUNaLElBQUcsU0FBUyxDQUFDLE1BQVYsS0FBb0IsQ0FBdkI7QUFDRSxpQkFBTyxJQURUO1NBQUEsTUFBQTtBQUdFLGlCQUFPLEdBQUEsR0FBTSxNQUhmOztNQURZLEVBVGhCOztBQWdCQSxTQUFBLGtCQUFBOzs7TUFDRSxJQUFHLENBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixFQUE0QixHQUE1QixDQUFQO1FBQ0UsR0FBSSxDQUFBLEdBQUEsQ0FBSixHQUFXLElBRGI7O0FBREY7QUFLQSxXQUFPO0VBcE1HOzs7QUFzTVo7Ozs7Ozs7OztFQVFBLFdBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxPQUFEO1dBQ1AsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBMkIsQ0FBQyxPQUE1QixDQUFvQyxLQUFwQyxFQUEyQyxJQUEzQztFQURPOzs7QUFHVDs7Ozs7Ozs7O0VBUUEsV0FBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxPQUFEO1dBQ2Ysa0JBQUEsQ0FBbUIsV0FBVyxDQUFDLE1BQVosQ0FBbUIsT0FBbkIsQ0FBbkI7RUFEZTs7O0FBR2pCOzs7Ozs7Ozs7RUFRQSxXQUFDLENBQUEsUUFBRCxHQUFXLFNBQUMsT0FBRDtXQUNULE9BQU8sQ0FBQyxPQUFSLENBQWdCLEtBQWhCLEVBQXVCLEdBQXZCLENBQTJCLENBQUMsT0FBNUIsQ0FBb0MsS0FBcEMsRUFBMkMsR0FBM0M7RUFEUzs7O0FBR1g7Ozs7Ozs7OztFQVFBLFdBQUMsQ0FBQSxnQkFBRCxHQUFtQixTQUFDLE9BQUQ7V0FDakIsV0FBVyxDQUFDLFFBQVosQ0FBcUIsa0JBQUEsQ0FBbUIsT0FBbkIsQ0FBckI7RUFEaUI7OztBQUduQjs7Ozs7OztFQU1BLFdBQUMsQ0FBQSxTQUFELEdBQVksU0FBQyxHQUFEO0FBQ1YsWUFBTyxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsQ0FBUDtBQUFBLFdBQ08sRUFEUDtBQUNlLGVBQU87QUFEdEIsV0FFTyxHQUZQO0FBRWdCLGVBQU87QUFGdkI7QUFJSSxlQUFPO0FBSlg7RUFEVTs7O0FBT1o7Ozs7Ozs7RUFNQSxXQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsR0FBRDtBQUNYLFlBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQVA7QUFBQSxXQUNPLEdBRFA7QUFDZ0IsZUFBTztBQUR2QixXQUVPLElBRlA7QUFFaUIsZUFBTztBQUZ4QjtBQUlJLGVBQU87QUFKWDtFQURXOzs7QUFPYjs7Ozs7Ozs7O0VBUUEsV0FBQyxDQUFBLEtBQUQsR0FBUSxTQUFDLEdBQUQ7QUFDTixZQUFPLEdBQUcsQ0FBQyxNQUFKLENBQVcsQ0FBWCxDQUFQO0FBQUEsV0FDTyxFQURQO0FBQ2UsZUFBTztBQUR0QixXQUVPLEdBRlA7QUFFZ0IsZUFBTyxHQUFHLENBQUMsU0FBSixDQUFjLENBQWQsQ0FBZ0IsQ0FBQyxLQUFqQixDQUF1QixHQUF2QixDQUEyQixDQUFDLEdBQTVCLENBQWdDLFdBQVcsQ0FBQyxRQUE1QztBQUZ2QixXQUdPLEdBSFA7QUFJSSxnQkFBTyxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsQ0FBUDtBQUFBLGVBQ08sRUFEUDtBQUNlLG1CQUFPO0FBRHRCLGVBRU8sR0FGUDtBQUVnQixtQkFBTyxHQUFHLENBQUMsU0FBSixDQUFjLENBQWQsQ0FBZ0IsQ0FBQyxLQUFqQixDQUF1QixHQUF2QixDQUEyQixDQUFDLEdBQTVCLENBQWdDLFdBQVcsQ0FBQyxnQkFBNUM7QUFGdkI7QUFJSSxrQkFBVSxJQUFBLGdCQUFBLENBQWlCLGlDQUFBLEdBQWtDLEdBQW5EO0FBSmQ7QUFERztBQUhQO0FBVUksY0FBVSxJQUFBLGdCQUFBLENBQWlCLHdCQUFBLEdBQXlCLEdBQTFDO0FBVmQ7RUFETTs7O0FBYVI7Ozs7Ozs7OztFQVFBLFdBQUMsQ0FBQSxZQUFELEdBQWUsU0FBQyxHQUFEO0FBQ2IsWUFBTyxHQUFHLENBQUMsTUFBSixDQUFXLENBQVgsQ0FBUDtBQUFBLFdBQ08sRUFEUDtBQUNlLGVBQU87QUFEdEIsV0FFTyxHQUZQO0FBRWdCLGVBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFkLENBQWdCLENBQUMsS0FBakIsQ0FBdUIsR0FBdkIsQ0FBMkIsQ0FBQyxHQUE1QixDQUFnQyxXQUFXLENBQUMsUUFBNUM7QUFGdkI7QUFHTyxjQUFVLElBQUEsZ0JBQUEsQ0FBaUIsd0JBQUEsR0FBeUIsR0FBMUM7QUFIakI7RUFEYTs7O0FBTWY7Ozs7Ozs7OztFQVFBLFdBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsR0FBRDtBQUNkLFlBQU8sR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFkLEVBQWlCLENBQWpCLENBQVA7QUFBQSxXQUNPLEdBRFA7QUFDZ0IsZUFBTztBQUR2QixXQUVPLElBRlA7QUFFaUIsZUFBTyxHQUFHLENBQUMsU0FBSixDQUFjLENBQWQsQ0FBZ0IsQ0FBQyxLQUFqQixDQUF1QixHQUF2QixDQUEyQixDQUFDLEdBQTVCLENBQWdDLFdBQVcsQ0FBQyxnQkFBNUM7QUFGeEI7QUFJSSxjQUFVLElBQUEsZ0JBQUEsQ0FBaUIsaUNBQUEsR0FBa0MsR0FBbkQ7QUFKZDtFQURjOzs7QUFPaEI7Ozs7Ozs7O0VBT0EsV0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLFFBQUQ7V0FDUixRQUFRLENBQUMsR0FBVCxDQUFhLFNBQUMsT0FBRDthQUFhLEdBQUEsR0FBTSxXQUFXLENBQUMsTUFBWixDQUFtQixPQUFuQjtJQUFuQixDQUFiLENBQTRELENBQUMsSUFBN0QsQ0FBa0UsRUFBbEU7RUFEUTs7O0FBR1Y7Ozs7Ozs7O0VBT0EsV0FBQyxDQUFBLGNBQUQsR0FBaUIsU0FBQyxRQUFEO1dBQ2YsUUFBUSxDQUFDLEdBQVQsQ0FBYSxTQUFDLE9BQUQ7YUFBYSxHQUFBLEdBQU0sV0FBVyxDQUFDLE1BQVosQ0FBbUIsT0FBbkI7SUFBbkIsQ0FBYixDQUE0RCxDQUFDLElBQTdELENBQWtFLEVBQWxFO0VBRGU7OztBQUdqQjs7Ozs7Ozs7RUFPQSxXQUFDLENBQUEsZUFBRCxHQUFrQixTQUFDLFFBQUQ7V0FDaEIsR0FBQSxHQUFNLFFBQVEsQ0FBQyxHQUFULENBQWEsU0FBQyxPQUFEO2FBQWEsR0FBQSxHQUFNLFdBQVcsQ0FBQyxjQUFaLENBQTJCLE9BQTNCO0lBQW5CLENBQWIsQ0FBb0UsQ0FBQyxJQUFyRSxDQUEwRSxFQUExRTtFQURVOzs7QUFHbEI7Ozs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7Ozs7RUFVQSxXQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRCxFQUFNLEdBQU47SUFDWixJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFIO0FBQ0UsYUFBTyxDQUFDLE9BQU8sR0FBUCxLQUFjLFFBQWYsQ0FBQSxJQUE2QixDQUFDLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBWCxFQUR0QztLQUFBLE1BRUssSUFBRyxPQUFPLEdBQVAsS0FBYyxRQUFqQjtBQUNILGFBQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixFQUE0QixHQUE1QixFQURKO0tBQUEsTUFBQTtBQUdILGFBQU8sTUFISjs7RUFITzs7O0FBUWQ7Ozs7Ozs7O0VBT0EsV0FBQyxDQUFBLFVBQUQsR0FBYSxTQUFDLEdBQUQsRUFBTSxHQUFOO1dBQ1gsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFsQixDQUF1QixHQUF2QixFQUE0QixHQUE1QjtFQURXOzs7QUFHYjs7Ozs7Ozs7RUFPQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsR0FBRCxFQUFNLEdBQU47V0FDUixHQUFBLElBQU87RUFEQzs7O0FBR1Y7Ozs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7OztFQVNBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFELEVBQU0sR0FBTjtXQUNSLEdBQUksQ0FBQSxHQUFBO0VBREk7OztBQUdWOzs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7OztFQVVBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVg7V0FDUixHQUFJLENBQUEsR0FBQSxDQUFKLEdBQVc7RUFESDs7O0FBR1Y7Ozs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7Ozs7OztFQVlBLFdBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLElBQWYsRUFBcUIsUUFBckIsRUFBK0IsUUFBL0I7V0FDWjtFQURZOzs7QUFHZDs7Ozs7Ozs7Ozs7OztFQVlBLFdBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLElBQWYsRUFBcUIsUUFBckIsRUFBK0IsUUFBL0I7SUFDWixJQUFHLFFBQVMsQ0FBQSxRQUFBLEdBQVcsQ0FBWCxDQUFhLENBQUMsS0FBdkIsQ0FBNkIsb0JBQTdCLENBQUg7QUFDRSxhQUFPLEdBQUksQ0FBQSxPQUFBLENBQUosR0FBZSxHQUR4QjtLQUFBLE1BQUE7QUFHRSxhQUFPLEdBQUksQ0FBQSxPQUFBLENBQUosR0FBZSxHQUh4Qjs7RUFEWTs7O0FBTWQ7Ozs7Ozs7Ozs7Ozs7RUFZQSxXQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxJQUFmLEVBQXFCLFFBQXJCLEVBQStCLFFBQS9CO1dBQ1o7RUFEWTs7O0FBR2Q7Ozs7Ozs7Ozs7Ozs7RUFZQSxXQUFDLENBQUEsYUFBRCxHQUFnQixTQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQixRQUEvQjtBQUNkLFVBQVUsSUFBQSxnQkFBQSxDQUFpQiw0QkFBQSxHQUE0QixDQUFDLFdBQVcsQ0FBQyxPQUFaLENBQW9CLFFBQVEsQ0FBQyxLQUFULENBQWUsQ0FBZixFQUFrQixRQUFBLEdBQVMsQ0FBM0IsQ0FBcEIsQ0FBRCxDQUE3QztFQURJOzs7QUFHaEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWlCQSxXQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxLQUFmLEVBQXNCLE9BQXRCO0FBQ0osUUFBQTtJQUFBLElBQUcsT0FBTyxPQUFQLEtBQWtCLFFBQXJCO01BQ0UsT0FBQSxHQUFVLFdBQVcsQ0FBQyxLQUFaLENBQWtCLE9BQWxCLEVBRFo7O0lBR0EsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjtBQUNFLGFBQU8sTUFEVDs7SUFHQSxPQUFBLHNFQUE2QixXQUFXLENBQUM7SUFDekMsT0FBQSx3RUFBNkIsV0FBVyxDQUFDO0lBQ3pDLE9BQUEsd0VBQTZCLFdBQVcsQ0FBQztJQUN6QyxXQUFBLDRFQUFxQyxXQUFXLENBQUM7SUFFakQsSUFBQSxHQUFPO0lBQ1AsUUFBQSxHQUFXO0lBQ1gsR0FBQSxHQUFNLE9BQU8sQ0FBQztBQUVkLFdBQU0sUUFBQSxLQUFZLEdBQWxCO01BQ0UsT0FBQSxHQUFVLE9BQVEsQ0FBQSxRQUFBO01BQ2xCLEVBQUU7TUFFRixJQUFHLE9BQUEsS0FBVyxHQUFYLElBQW1CLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF0QjtRQUNFLE9BQUEsR0FBVSxHQUFHLENBQUMsT0FEaEI7T0FBQSxNQUVLLElBQUcsT0FBTyxDQUFDLEtBQVIsQ0FBYyxrQkFBZCxDQUFBLElBQXNDLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF6QztRQUNILE9BQUEsR0FBVSxRQUFBLENBQVMsT0FBVCxFQUFrQixFQUFsQixFQURQOztNQUdMLElBQUcsUUFBQSxLQUFZLEdBQWY7UUFDRSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWIsRUFBc0IsS0FBdEI7QUFDQSxjQUZGO09BQUEsTUFHSyxJQUFHLENBQUksT0FBQSxDQUFRLEdBQVIsRUFBYSxPQUFiLENBQVA7UUFDSCxHQUFBLEdBQU0sV0FBQSxDQUFZLEdBQVosRUFBaUIsT0FBakIsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsUUFBQSxHQUFXLENBQXBELEVBREg7T0FBQSxNQUFBO1FBR0gsR0FBQSxHQUFNLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixFQUhIOztJQVpQO0FBaUJBLFdBQU87RUFqQ0g7OztBQW1DTjs7Ozs7Ozs7Ozs7Ozs7RUFhQSxXQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxPQUFmO0FBQ0osUUFBQTtJQUFBLElBQUcsT0FBTyxPQUFQLEtBQWtCLFFBQXJCO01BQ0UsT0FBQSxHQUFVLFdBQVcsQ0FBQyxLQUFaLENBQWtCLE9BQWxCLEVBRFo7O0lBR0EsT0FBQSxzRUFBNkIsV0FBVyxDQUFDO0lBQ3pDLE9BQUEsd0VBQTZCLFdBQVcsQ0FBQztJQUN6QyxXQUFBLDRFQUFxQyxXQUFXLENBQUM7SUFFakQsSUFBQSxHQUFPO0lBQ1AsUUFBQSxHQUFXO0lBQ1gsR0FBQSxHQUFNLE9BQU8sQ0FBQztBQUNkLFdBQU0sUUFBQSxLQUFZLEdBQWxCO01BQ0UsT0FBQSxHQUFVLE9BQVEsQ0FBQSxRQUFBO01BQ2xCLEVBQUU7TUFFRixJQUFHLE9BQUEsS0FBVyxHQUFYLElBQW1CLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF0QjtRQUNFLE9BQUEsR0FBVSxHQUFHLENBQUMsT0FEaEI7T0FBQSxNQUVLLElBQUcsT0FBTyxDQUFDLEtBQVIsQ0FBYyxrQkFBZCxDQUFBLElBQXNDLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF6QztRQUNILE9BQUEsR0FBVSxRQUFBLENBQVMsT0FBVCxFQUFrQixFQUFsQixFQURQOztNQUdMLElBQUcsQ0FBSSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWIsQ0FBUDtBQUNFLGVBQU8sV0FBQSxDQUFZLEdBQVosRUFBaUIsT0FBakIsRUFBMEIsSUFBMUIsRUFBZ0MsT0FBaEMsRUFBeUMsUUFBQSxHQUFXLENBQXBELEVBRFQ7T0FBQSxNQUFBO1FBR0UsR0FBQSxHQUFNLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixFQUhSOztJQVRGO0FBY0EsV0FBTztFQXpCSDs7O0FBMkJOOzs7Ozs7Ozs7Ozs7O0VBWUEsV0FBQyxDQUFBLEdBQUQsR0FBTSxTQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWUsT0FBZjtBQUNKLFFBQUE7SUFBQSxJQUFHLE9BQU8sT0FBUCxLQUFrQixRQUFyQjtNQUNFLE9BQUEsR0FBVSxXQUFXLENBQUMsS0FBWixDQUFrQixPQUFsQixFQURaOztJQUdBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7QUFDRSxhQUFPLE9BRFQ7O0lBR0EsT0FBQSxzRUFBNkIsV0FBVyxDQUFDO0lBQ3pDLE9BQUEsd0VBQTZCLFdBQVcsQ0FBQztJQUN6QyxXQUFBLDRFQUFxQyxXQUFXLENBQUM7SUFFakQsSUFBQSxHQUFPO0lBQ1AsUUFBQSxHQUFXO0lBQ1gsR0FBQSxHQUFNLE9BQU8sQ0FBQztBQUNkLFdBQU0sUUFBQSxLQUFZLEdBQWxCO01BQ0UsT0FBQSxHQUFVLE9BQVEsQ0FBQSxRQUFBO01BQ2xCLEVBQUU7TUFFRixJQUFHLE9BQUEsS0FBVyxHQUFYLElBQW1CLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF0QjtRQUNFLE9BQUEsR0FBVSxHQUFHLENBQUMsT0FEaEI7T0FBQSxNQUVLLElBQUcsT0FBTyxDQUFDLEtBQVIsQ0FBYyxrQkFBZCxDQUFBLElBQXNDLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUF6QztRQUNILE9BQUEsR0FBVSxRQUFBLENBQVMsT0FBVCxFQUFrQixFQUFsQixFQURQOztNQUdMLElBQUcsQ0FBSSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWIsQ0FBUDtRQUNFLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLE9BQWpCLEVBQTBCLElBQTFCLEVBQWdDLE9BQWhDLEVBQXlDLFFBQUEsR0FBVyxDQUFwRDtBQUNBLGNBRkY7T0FBQSxNQUdLLElBQUcsUUFBQSxLQUFZLEdBQWY7UUFDSCxPQUFPLEdBQUksQ0FBQSxPQUFBO0FBQ1gsY0FGRztPQUFBLE1BQUE7UUFJSCxHQUFBLEdBQU0sT0FBQSxDQUFRLEdBQVIsRUFBYSxPQUFiLEVBSkg7O0lBWlA7QUFrQkEsV0FBTztFQWhDSDs7O0FBa0NOOzs7Ozs7Ozs7OztFQVVBLFdBQUMsQ0FBQSxHQUFELEdBQU0sU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLE9BQWY7QUFDSixRQUFBO0lBQUEsSUFBRyxPQUFPLE9BQVAsS0FBa0IsUUFBckI7TUFDRSxPQUFBLEdBQVUsV0FBVyxDQUFDLEtBQVosQ0FBa0IsT0FBbEIsRUFEWjs7SUFHQSxPQUFBLHNFQUE2QixXQUFXLENBQUM7SUFDekMsT0FBQSx3RUFBNkIsV0FBVyxDQUFDO0lBRXpDLFFBQUEsR0FBVztJQUNYLEdBQUEsR0FBTSxPQUFPLENBQUM7QUFDZCxXQUFNLFFBQUEsS0FBWSxHQUFsQjtNQUNFLE9BQUEsR0FBVSxPQUFRLENBQUEsUUFBQTtNQUNsQixFQUFFO01BRUYsSUFBRyxPQUFBLEtBQVcsR0FBWCxJQUFtQixLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBdEI7UUFDRSxPQUFBLEdBQVUsR0FBRyxDQUFDLE9BRGhCO09BQUEsTUFFSyxJQUFHLE9BQU8sQ0FBQyxLQUFSLENBQWMsa0JBQWQsQ0FBQSxJQUFzQyxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBekM7UUFDSCxPQUFBLEdBQVUsUUFBQSxDQUFTLE9BQVQsRUFBa0IsRUFBbEIsRUFEUDs7TUFHTCxJQUFHLENBQUksT0FBQSxDQUFRLEdBQVIsRUFBYSxPQUFiLENBQVA7QUFDRSxlQUFPLE1BRFQ7O01BR0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYjtJQVpSO0FBY0EsV0FBTztFQXZCSCIsImZpbGUiOiJqc29uLXBvaW50ZXIudW1kLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSnNvblBvaW50ZXJFcnJvciBleHRlbmRzIEVycm9yXHJcbiAgY29uc3RydWN0b3I6IChtZXNzYWdlKSAtPlxyXG4gICAgYmFzZSA9IHN1cGVyKG1lc3NhZ2UpXHJcblxyXG4gICAgQG1lc3NhZ2UgPSBiYXNlLm1lc3NhZ2VcclxuICAgIEBzdGFjayA9IGJhc2Uuc3RhY2tcclxuICAgIEBuYW1lID0gQGNvbnN0cnVjdG9yLm5hbWVcclxuXHJcbmNsYXNzIEpzb25Qb2ludGVyXHJcbiAgQEpzb25Qb2ludGVyRXJyb3I6IEpzb25Qb2ludGVyRXJyb3JcclxuXHJcbiAgIyMjXHJcbiAgIyBDb252ZW5pZW5jZSBmdW5jdGlvbiBmb3IgY2hvb3NpbmcgYmV0d2VlbiBgLnNtYXJ0QmluZGAsIGAuZ2V0YCwgYW5kIGAuc2V0YCwgZGVwZW5kaW5nIG9uIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqZWN0XHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gcG9pbnRlclxyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICMgQHJldHVybnMgeyp9IGV2YWx1YXRpb24gb2YgdGhlIHByb3hpZWQgbWV0aG9kXHJcbiAgIyMjXHJcbiAgY29uc3RydWN0b3I6IChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKSAtPlxyXG4gICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgIHdoZW4gMyB0aGVuIEpzb25Qb2ludGVyLnNldChvYmplY3QsIHBvaW50ZXIsIHZhbHVlKVxyXG4gICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqZWN0LCBwb2ludGVyKVxyXG4gICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zbWFydEJpbmQoeyBvYmplY3Q6IG9iamVjdCB9KVxyXG4gICAgICBlbHNlIG51bGxcclxuXHJcbiAgIyMjXHJcbiAgIyBDcmVhdGVzIGEgY2xvbmUgb2YgdGhlIGFwaSwgd2l0aCBgLi8uZ2V0Ly5oYXMvLnNldC8uZGVsLy5zbWFydEJpbmRgIG1ldGhvZCBzaWduYXR1cmVzIGFkanVzdGVkLlxyXG4gICMgVGhlIHNtYXJ0QmluZCBtZXRob2QgaXMgY3VtdWxhdGl2ZSwgbWVhbmluZyB0aGF0IGAuc21hcnRCaW5kKHsgb2JqZWN0OiB4fSkuc21hcnRCaW5kKHsgcG9pbnRlcjogeSB9KWAgd2lsbCBiZWhhdmUgYXMgZXhwZWN0ZWQuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzXHJcbiAgIyBAcGFyYW0geyp9IGJpbmRpbmdzLm9iamVjdFxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IGJpbmRpbmdzLnBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5ncy5vcHRpb25zXHJcbiAgIyBAcmV0dXJucyB7SnNvblBvaW50ZXJ9XHJcbiAgIyMjXHJcbiAgQHNtYXJ0QmluZDogKHsgb2JqZWN0OiBvYmosIHBvaW50ZXI6IHB0ciwgZnJhZ21lbnQ6IGZyYWcsIG9wdGlvbnM6IG9wdCB9KSAtPlxyXG4gICAgIyBmcmFnbWVudCBvdmVycmlkZXMgcG9pbnRlclxyXG4gICAgcHRyID0gZnJhZyA/IHB0clxyXG5cclxuICAgICMgV2hhdCBhcmUgYmluZGluZz9cclxuICAgIGhhc09iaiA9IG9iaiAhPSB1bmRlZmluZWRcclxuICAgIGhhc1B0ciA9IHB0cj9cclxuICAgIGhhc09wdCA9IG9wdD9cclxuXHJcbiAgICAjIExldHMgbm90IHBhcnNlIHRoaXMgZXZlcnkgdGltZSFcclxuICAgIGlmIHR5cGVvZiBwdHIgPT0gJ3N0cmluZydcclxuICAgICAgcHRyID0gQHBhcnNlKHB0cilcclxuXHJcbiAgICAjIGRlZmF1bHQgb3B0aW9ucyBoYXZlIGNoYW5nZWRcclxuICAgIG1lcmdlT3B0aW9ucyA9IChvdmVycmlkZSA9IHt9KSAtPlxyXG4gICAgICBvID0ge31cclxuXHJcbiAgICAgIG8uaGFzT3duUHJvcCA9IG92ZXJyaWRlLmhhc093blByb3AgPyBvcHQuaGFzT3duUHJvcFxyXG4gICAgICBvLmdldFByb3AgPSBvdmVycmlkZS5nZXRQcm9wID8gb3B0LmdldFByb3BcclxuICAgICAgby5zZXRQcm9wID0gb3ZlcnJpZGUuc2V0UHJvcCA/IG9wdC5zZXRQcm9wXHJcbiAgICAgIG8uZ2V0Tm90Rm91bmQgPSBvdmVycmlkZS5nZXROb3RGb3VuZCA/IG9wdC5nZXROb3RGb3VuZFxyXG4gICAgICBvLnNldE5vdEZvdW5kID0gb3ZlcnJpZGUuc2V0Tm90Rm91bmQgPyBvcHQuc2V0Tm90Rm91bmRcclxuICAgICAgby5kZWxOb3RGb3VuZCA9IG92ZXJyaWRlLmRlbE5vdEZvdW5kID8gb3B0LmRlbE5vdEZvdW5kXHJcblxyXG4gICAgICByZXR1cm4gb1xyXG5cclxuICAgIGFwaSA9IHVuZGVmaW5lZFxyXG5cclxuICAgICMgRXZlcnkgY29tYmluYXRpb24gb2YgYmluZGluZ3NcclxuICAgIGlmIGhhc09iaiBhbmQgaGFzUHRyIGFuZCBoYXNPcHRcclxuICAgICAgYXBpID0gKHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAodmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNPYmogYW5kIGhhc1B0clxyXG4gICAgICBhcGkgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxyXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5nZXQgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5kZWwgPSAob3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICBlbHNlIGlmIGhhc09iaiBhbmQgaGFzT3B0XHJcbiAgICAgIGFwaSA9IChwdHIsIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAocHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChwdHIsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc1B0ciBhbmQgaGFzT3B0XHJcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAob2JqLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc09wdFxyXG4gICAgICBhcGkgPSAob2JqLCBwdHIsIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAzIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBhcGkuc21hcnRCaW5kKHsgb2JqZWN0OiBvYmogfSlcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZGVsID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNPYmpcclxuICAgICAgYXBpID0gKHB0ciwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmdldCA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5kZWwgPSAocHRyLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgIGVsc2UgaWYgaGFzUHRyXHJcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChvYmosIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmhhcyA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZGVsID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBAXHJcblxyXG4gICAgIyBzbWFydEJpbmQgaGFzIG5ldyBkZWZhdWx0c1xyXG4gICAgYXBpLnNtYXJ0QmluZCA9IChvdmVycmlkZSkgLT5cclxuICAgICAgbyA9IHt9XHJcblxyXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAnb2JqZWN0JylcclxuICAgICAgICBvLm9iamVjdCA9IG92ZXJyaWRlLm9iamVjdFxyXG4gICAgICBlbHNlIGlmIGhhc09ialxyXG4gICAgICAgIG8ub2JqZWN0ID0gb2JqXHJcblxyXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAncG9pbnRlcicpXHJcbiAgICAgICAgby5wb2ludGVyID0gb3ZlcnJpZGUucG9pbnRlclxyXG4gICAgICBlbHNlIGlmIGhhc1B0clxyXG4gICAgICAgIG8ucG9pbnRlciA9IHB0clxyXG5cclxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ29wdGlvbnMnKVxyXG4gICAgICAgIG8ub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhvdmVycmlkZS5vcHRpb25zKVxyXG4gICAgICBlbHNlIGlmIGhhc09ialxyXG4gICAgICAgIG8ub3B0aW9ucyA9IG9wdFxyXG5cclxuICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLnNtYXJ0QmluZChvKVxyXG5cclxuICAgIGlmIGhhc1B0clxyXG4gICAgICAjIyNcclxuICAgICAgIyBnZXQvc2V0IGJvdW5kIHBvaW50ZXIgdmFsdWVcclxuICAgICAgI1xyXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gcG9pbnRlciBoYXMgYmVlbiBib3VuZFxyXG4gICAgICAjXHJcbiAgICAgICMgQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgICMgQHJldHVybnMgc3RyaW5nW10gc2VnbWVudHNcclxuICAgICAgIyMjXHJcbiAgICAgIGFwaS5wb2ludGVyID0gKHZhbHVlKSAtPlxyXG4gICAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggPT0gMFxyXG4gICAgICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLmNvbXBpbGVQb2ludGVyKHB0cilcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gcHRyID0gSnNvblBvaW50ZXIucGFyc2VQb2ludGVyKHZhbHVlKVxyXG5cclxuICAgICAgIyMjXHJcbiAgICAgICMgZ2V0L3NldCBib3VuZCBwb2ludGVyIHZhbHVlIGFzIGZyYWdtZW50XHJcbiAgICAgICNcclxuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIHBvaW50ZXIgaGFzIGJlZW4gYm91bmRcclxuICAgICAgI1xyXG4gICAgICAjIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxyXG4gICAgICAjIEByZXR1cm5zIHN0cmluZ1tdIHNlZ21lbnRzXHJcbiAgICAgICMjI1xyXG4gICAgICBhcGkuZnJhZ21lbnQgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgICByZXR1cm4gSnNvblBvaW50ZXIuY29tcGlsZUZyYWdtZW50KHB0cilcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gcHRyID0gSnNvblBvaW50ZXIucGFyc2VGcmFnbWVudCh2YWx1ZSlcclxuXHJcbiAgICBpZiBoYXNPYmpcclxuICAgICAgIyMjXHJcbiAgICAgICMgZ2V0L3NldCBib3VuZCBvYmplY3RcclxuICAgICAgI1xyXG4gICAgICAjIE9ubHkgYXZhaWxhYmxlIHdoZW4gb2JqZWN0IGhhcyBiZWVuIGJvdW5kXHJcbiAgICAgICNcclxuICAgICAgIyBAcGFyYW0geyp9IHZhbHVlXHJcbiAgICAgICMgQHJldHVybnMgeyp9IGJvdW5kIG9iamVjdFxyXG4gICAgICAjIyNcclxuICAgICAgYXBpLm9iamVjdCA9ICh2YWx1ZSkgLT5cclxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDBcclxuICAgICAgICAgIHJldHVybiBvYmpcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gb2JqID0gdmFsdWVcclxuXHJcbiAgICBpZiBoYXNPcHRcclxuICAgICAgIyMjXHJcbiAgICAgICMgZ2V0L3NldCBib3VuZCBvcHRpb25zXHJcbiAgICAgICNcclxuICAgICAgIyBPbmx5IGF2YWlsYWJsZSB3aGVuIG9wdGlvbnMgaGFzIGJlZW4gYm91bmRcclxuICAgICAgI1xyXG4gICAgICAjIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAgICAgIyBAcmV0dXJucyB7Kn0gYm91bmQgb3B0aW9uc1xyXG4gICAgICAjIyNcclxuICAgICAgYXBpLm9wdGlvbnMgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCA9PSAwXHJcbiAgICAgICAgICByZXR1cm4gb3B0XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuIG9wdCA9IHZhbHVlXHJcblxyXG4gICAgIyBjb3B5IHRoZSByZW1haW5pbmcgbWV0aG9kcyB3aGljaCBkbyBub3QgbmVlZCBiaW5kaW5nXHJcbiAgICBmb3Igb3duIGtleSwgdmFsIG9mIEpzb25Qb2ludGVyXHJcbiAgICAgIGlmIG5vdCB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwaSwga2V5KVxyXG4gICAgICAgIGFwaVtrZXldID0gdmFsXHJcblxyXG4gICAgIyBmaW5hbCByZXN1bHRcclxuICAgIHJldHVybiBhcGlcclxuXHJcbiAgIyMjXHJcbiAgIyBFc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQgYXMgZGVzY3JpYmVkIGJ5IFJGQzY5MDEuXHJcbiAgI1xyXG4gICMgTm90YWJseSwgYCd+J2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34wJ2AgYW5kIGAnLydgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MSdgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEBlc2NhcGU6IChzZWdtZW50KSAtPlxyXG4gICAgc2VnbWVudC5yZXBsYWNlKC9+L2csICd+MCcpLnJlcGxhY2UoL1xcLy9nLCAnfjEnKVxyXG5cclxuICAjIyNcclxuICAjIEVzY2FwZXMgdGhlIGdpdmVuIHBhdGggZnJhZ21lbnQgc2VnbWVudCBhcyBkZXNjcmliZWQgYnkgUkZDNjkwMS5cclxuICAjXHJcbiAgIyBOb3RhYmx5LCBgJ34nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjAnYCBhbmQgYCcvJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34xJ2AgYW5kIGZpbmFsbHkgdGhlIHN0cmluZyBpcyBVUkkgZW5jb2RlZC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxyXG4gICMgQHJldHVybnMge3N0cmluZ31cclxuICAjIyNcclxuICBAZXNjYXBlRnJhZ21lbnQ6IChzZWdtZW50KSAtPlxyXG4gICAgZW5jb2RlVVJJQ29tcG9uZW50KEpzb25Qb2ludGVyLmVzY2FwZShzZWdtZW50KSlcclxuXHJcbiAgIyMjXHJcbiAgIyBVbi1Fc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQsIHJldmVyc2luZyB0aGUgYWN0aW9ucyBvZiBgLmVzY2FwZWAuXHJcbiAgI1xyXG4gICMgTm90YWJseSwgYCd+MSdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCcvJ2AgYW5kIGAnfjAnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfidgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEB1bmVzY2FwZTogKHNlZ21lbnQpIC0+XHJcbiAgICBzZWdtZW50LnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKVxyXG5cclxuICAjIyNcclxuICAjIFVuLUVzY2FwZXMgdGhlIGdpdmVuIHBhdGggZnJhZ21lbnQgc2VnbWVudCwgcmV2ZXJzaW5nIHRoZSBhY3Rpb25zIG9mIGAuZXNjYXBlRnJhZ21lbnRgLlxyXG4gICNcclxuICAjIE5vdGFibHksIHRoZSBzdHJpbmcgaXMgVVJJIGRlY29kZWQgYW5kIHRoZW4gYCd+MSdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCcvJ2AgYW5kIGAnfjAnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfidgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEB1bmVzY2FwZUZyYWdtZW50OiAoc2VnbWVudCkgLT5cclxuICAgIEpzb25Qb2ludGVyLnVuZXNjYXBlKGRlY29kZVVSSUNvbXBvbmVudChzZWdtZW50KSlcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBzdHJgIGlzIGEgdmFsaWQganNvbiBwb2ludGVyIHZhbHVlXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGlzUG9pbnRlcjogKHN0cikgLT5cclxuICAgIHN3aXRjaCBzdHIuY2hhckF0KDApXHJcbiAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gdHJ1ZVxyXG4gICAgICB3aGVuICcvJyB0aGVuIHJldHVybiB0cnVlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBzdHJgIGlzIGEgdmFsaWQganNvbiBmcmFnbWVudCBwb2ludGVyIHZhbHVlXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGlzRnJhZ21lbnQ6IChzdHIpIC0+XHJcbiAgICBzd2l0Y2ggc3RyLnN1YnN0cmluZygwLCAyKVxyXG4gICAgICB3aGVuICcjJyB0aGVuIHJldHVybiB0cnVlXHJcbiAgICAgIHdoZW4gJyMvJyB0aGVuIHJldHVybiB0cnVlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgIyBQYXJzZXMgYSBqc29uLXBvaW50ZXIgb3IganNvbiBmcmFnbWVudCBwb2ludGVyLCBhcyBkZXNjcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXHJcbiAgI1xyXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAgIyMjXHJcbiAgQHBhcnNlOiAoc3RyKSAtPlxyXG4gICAgc3dpdGNoIHN0ci5jaGFyQXQoMClcclxuICAgICAgd2hlbiAnJyB0aGVuIHJldHVybiBbXVxyXG4gICAgICB3aGVuICcvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDEpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlKVxyXG4gICAgICB3aGVuICcjJ1xyXG4gICAgICAgIHN3aXRjaCBzdHIuY2hhckF0KDEpXHJcbiAgICAgICAgICB3aGVuICcnIHRoZW4gcmV0dXJuIFtdXHJcbiAgICAgICAgICB3aGVuICcvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDIpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlRnJhZ21lbnQpXHJcbiAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIGZyYWdtZW50IHBvaW50ZXI6ICN7c3RyfVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gcG9pbnRlcjogI3tzdHJ9XCIpXHJcblxyXG4gICMjI1xyXG4gICMgUGFyc2VzIGEganNvbi1wb2ludGVyLCBhcyBkZXNjcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXHJcbiAgI1xyXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAgIyMjXHJcbiAgQHBhcnNlUG9pbnRlcjogKHN0cikgLT5cclxuICAgIHN3aXRjaCBzdHIuY2hhckF0KDApXHJcbiAgICAgIHdoZW4gJycgdGhlbiByZXR1cm4gW11cclxuICAgICAgd2hlbiAnLycgdGhlbiByZXR1cm4gc3RyLnN1YnN0cmluZygxKS5zcGxpdCgnLycpLm1hcChKc29uUG9pbnRlci51bmVzY2FwZSlcclxuICAgICAgZWxzZSB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBwb2ludGVyOiAje3N0cn1cIilcclxuXHJcbiAgIyMjXHJcbiAgIyBQYXJzZXMgYSBqc29uIGZyYWdtZW50IHBvaW50ZXIsIGFzIGRlc2NyaWJlZCBieSBSRkM5MDEsIGludG8gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cclxuICAjXHJcbiAgIyBAdGhyb3dzIHtKc29uUG9pbnRlckVycm9yfSBmb3IgaW52YWxpZCBqc29uLXBvaW50ZXJzLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICAjIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICAjIyNcclxuICBAcGFyc2VGcmFnbWVudDogKHN0cikgLT5cclxuICAgIHN3aXRjaCBzdHIuc3Vic3RyaW5nKDAsIDIpXHJcbiAgICAgIHdoZW4gJyMnIHRoZW4gcmV0dXJuIFtdXHJcbiAgICAgIHdoZW4gJyMvJyB0aGVuIHJldHVybiBzdHIuc3Vic3RyaW5nKDIpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlRnJhZ21lbnQpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIkludmFsaWQgSlNPTiBmcmFnbWVudCBwb2ludGVyOiAje3N0cn1cIilcclxuXHJcbiAgIyMjXHJcbiAgIyBDb252ZXJ0cyBhbiBhcnJheSBvZiBwYXRoIHNlZ21lbnRzIGludG8gYSBqc29uIHBvaW50ZXIuXHJcbiAgIyBUaGlzIG1ldGhvZCBpcyB0aGUgcmV2ZXJzZSBvZiBgLnBhcnNlUG9pbnRlcmAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgIyMjXHJcbiAgQGNvbXBpbGU6IChzZWdtZW50cykgLT5cclxuICAgIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKS5qb2luKCcnKVxyXG5cclxuICAjIyNcclxuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gcG9pbnRlci5cclxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VQb2ludGVyYC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHJldHVybnMge3N0cmluZ31cclxuICAjIyNcclxuICBAY29tcGlsZVBvaW50ZXI6IChzZWdtZW50cykgLT5cclxuICAgIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKS5qb2luKCcnKVxyXG5cclxuICAjIyNcclxuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gZnJhZ21lbnQgcG9pbnRlci5cclxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VGcmFnbWVudGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgIyMjXHJcbiAgQGNvbXBpbGVGcmFnbWVudDogKHNlZ21lbnRzKSAtPlxyXG4gICAgJyMnICsgc2VnbWVudHMubWFwKChzZWdtZW50KSAtPiAnLycgKyBKc29uUG9pbnRlci5lc2NhcGVGcmFnbWVudChzZWdtZW50KSkuam9pbignJylcclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBwcm9wZXJ0eS5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgaGFzUHJvcFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCBhbmQgYG9iamAgaXMgZWl0aGVyIGFuIEFycmF5IG9yIGFuIE9iamVjdC5cclxuICAjIElnbm9yZXMgdGhlIHByb3RvdHlwZSBjaGFpbi5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5oYXNQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAjIyNcclxuICBAaGFzSnNvblByb3A6IChvYmosIGtleSkgLT5cclxuICAgIGlmIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICByZXR1cm4gKHR5cGVvZiBrZXkgPT0gJ251bWJlcicpIGFuZCAoa2V5IDwgb2JqLmxlbmd0aClcclxuICAgIGVsc2UgaWYgdHlwZW9mIG9iaiA9PSAnb2JqZWN0J1xyXG4gICAgICByZXR1cm4ge30uaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgZGlzcmVnYXJkaW5nIHRoZSBwcm90b3R5cGUgY2hhaW4uXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGhhc093blByb3A6IChvYmosIGtleSkgLT5cclxuICAgIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgaW5jbHVkaW5nIHZpYSB0aGUgcHJvdG90eXBlIGNoYWluLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICMjI1xyXG4gIEBoYXNQcm9wOiAob2JqLCBrZXkpIC0+XHJcbiAgICBrZXkgb2Ygb2JqXHJcblxyXG4gICMjI1xyXG4gICMgQ2FsbGJhY2sgdXNlZCB0byByZXRyaWV2ZSBhIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0XHJcbiAgI1xyXG4gICMgQGNhbGxiYWNrIGdldFByb3BcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIEZpbmRzIHRoZSBnaXZlbiBga2V5YCBpbiBgb2JqYC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5nZXRQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAZ2V0UHJvcDogKG9iaiwga2V5KSAtPlxyXG4gICAgb2JqW2tleV1cclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgc2V0UHJvcFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgU2V0cyB0aGUgZ2l2ZW4gYGtleWAgaW4gYG9iamAgdG8gYHZhbHVlYC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXRQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcGFyYW0geyp9IHZhbHVlXHJcbiAgIyBAcmV0dXJucyB7Kn0gYHZhbHVlYFxyXG4gICMjI1xyXG4gIEBzZXRQcm9wOiAob2JqLCBrZXksIHZhbHVlKSAtPlxyXG4gICAgb2JqW2tleV0gPSB2YWx1ZVxyXG5cclxuICAjIyNcclxuICAjIENhbGxiYWNrIHVzZWQgdG8gbW9kaWZ5IGJlaGF2aW91ciB3aGVuIGEgZ2l2ZW4gcGF0aCBzZWdtZW50IGNhbm5vdCBiZSBmb3VuZC5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgbm90Rm91bmRcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdGhlIHZhbHVlIHRvIHVzZSB3aGVuIGAuZ2V0YCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZ2V0Tm90Rm91bmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBnZXROb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgdW5kZWZpbmVkXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0aGUgdmFsdWUgdG8gdXNlIHdoZW4gYC5zZXRgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXROb3RGb3VuZGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcclxuICAjIEBwYXJhbSB7Kn0gcm9vdFxyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcclxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgIyMjXHJcbiAgQHNldE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICBpZiBzZWdtZW50c1tpU2VnbWVudCArIDFdLm1hdGNoKC9eKD86MHxbMS05XVxcZCp8LSkkLylcclxuICAgICAgcmV0dXJuIG9ialtzZWdtZW50XSA9IFtdXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBvYmpbc2VnbWVudF0gPSB7fVxyXG5cclxuICAjIyNcclxuICAjIFBlcmZvcm1zIGFuIGFjdGlvbiB3aGVuIGAuZGVsYCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZGVsTm90Rm91bmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBkZWxOb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgdW5kZWZpbmVkXHJcblxyXG4gICMjI1xyXG4gICMgUmFpc2VzIGEgSnNvblBvaW50ZXJFcnJvciB3aGVuIHRoZSBnaXZlbiBwb2ludGVyIHNlZ21lbnQgaXMgbm90IGZvdW5kLlxyXG4gICNcclxuICAjIE1heSBiZSB1c2VkIGluIHBsYWNlIG9mIHRoZSBhYm92ZSBtZXRob2RzIHZpYSB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IG9mIGAuLy5nZXQvLnNldC8uaGFzLy5kZWwvLnNpbXBsZUJpbmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBlcnJvck5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIlVuYWJsZSB0byBmaW5kIGpzb24gcGF0aDogI3tKc29uUG9pbnRlci5jb21waWxlKHNlZ21lbnRzLnNsaWNlKDAsIGlTZWdtZW50KzEpKX1cIilcclxuXHJcbiAgIyMjXHJcbiAgIyBTZXRzIHRoZSBsb2NhdGlvbiBpbiBgb2JqZWN0YCwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgdG8gYHZhbHVlYC5cclxuICAjIElmIGBwb2ludGVyYCByZWZlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LCBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgbW9kaWZ5aW5nIGBvYmplY3RgLFxyXG4gICMgb3RoZXJ3aXNlLCBgb2JqZWN0YCBtb2RpZmllZCBhbmQgcmV0dXJuZWQuXHJcbiAgI1xyXG4gICMgQnkgZGVmYXVsdCwgaWYgYW55IGxvY2F0aW9uIHNwZWNpZmllZCBieSBgcG9pbnRlcmAgZG9lcyBub3QgZXhpc3QsIHRoZSBsb2NhdGlvbiBpcyBjcmVhdGVkIHVzaW5nIG9iamVjdHMgYW5kIGFycmF5cy5cclxuICAjIEFycmF5cyBhcmUgdXNlZCBvbmx5IHdoZW4gdGhlIGltbWVkaWF0ZWx5IGZvbGxvd2luZyBwYXRoIHNlZ21lbnQgaXMgYW4gYXJyYXkgZWxlbWVudCBhcyBkZWZpbmVkIGJ5IHRoZSBzdGFuZGFyZC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxyXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcclxuICAjIEBwYXJhbSB7c2V0UHJvcH0gb3B0aW9ucy5zZXRQcm9wXHJcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmdldE5vdEZvdW5kXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAc2V0OiAob2JqLCBwb2ludGVyLCB2YWx1ZSwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuIHZhbHVlXHJcblxyXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxyXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXHJcbiAgICBzZXRQcm9wID0gb3B0aW9ucz8uc2V0UHJvcCA/IEpzb25Qb2ludGVyLnNldFByb3BcclxuICAgIHNldE5vdEZvdW5kID0gb3B0aW9ucz8uc2V0Tm90Rm91bmQgPyBKc29uUG9pbnRlci5zZXROb3RGb3VuZFxyXG5cclxuICAgIHJvb3QgPSBvYmpcclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuXHJcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cclxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXHJcbiAgICAgICsraVNlZ21lbnRcclxuXHJcbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxyXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcclxuXHJcbiAgICAgIGlmIGlTZWdtZW50ID09IGxlblxyXG4gICAgICAgIHNldFByb3Aob2JqLCBzZWdtZW50LCB2YWx1ZSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBlbHNlIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcclxuICAgICAgICBvYmogPSBzZXROb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiByb290XHJcblxyXG4gICMjI1xyXG4gICMgRmluZHMgdGhlIHZhbHVlIGluIGBvYmpgIGFzIHNwZWNpZmllZCBieSBgcG9pbnRlcmBcclxuICAjXHJcbiAgIyBCeSBkZWZhdWx0LCByZXR1cm5zIHVuZGVmaW5lZCBmb3IgdmFsdWVzIHdoaWNoIGNhbm5vdCBiZSBmb3VuZFxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5nZXROb3RGb3VuZFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGdldDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG4gICAgZ2V0Tm90Rm91bmQgPSBvcHRpb25zPy5nZXROb3RGb3VuZCA/IEpzb25Qb2ludGVyLmdldE5vdEZvdW5kXHJcblxyXG4gICAgcm9vdCA9IG9ialxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgcmV0dXJuIGdldE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIG9ialxyXG5cclxuICAjIyNcclxuICAjIFJlbW92ZXMgdGhlIGxvY2F0aW9uLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCBmcm9tIGBvYmplY3RgLlxyXG4gICMgUmV0dXJucyB0aGUgbW9kaWZpZWQgYG9iamVjdGAsIG9yIHVuZGVmaW5lZCBpZiB0aGUgYHBvaW50ZXJgIGlzIGVtcHR5LlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5kZWxOb3RGb3VuZFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGRlbDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG4gICAgZGVsTm90Rm91bmQgPSBvcHRpb25zPy5kZWxOb3RGb3VuZCA/IEpzb25Qb2ludGVyLmRlbE5vdEZvdW5kXHJcblxyXG4gICAgcm9vdCA9IG9ialxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgZGVsTm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZWxzZSBpZiBpU2VnbWVudCA9PSBsZW5cclxuICAgICAgICBkZWxldGUgb2JqW3NlZ21lbnRdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiByb290XHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiB0aGUgbG9jYXRpb24sIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIGV4aXN0cyBpbiBgb2JqZWN0YFxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGhhczogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG5cclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxyXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cclxuICAgICAgKytpU2VnbWVudFxyXG5cclxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXHJcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxyXG5cclxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIHRydWVcclxuIl19