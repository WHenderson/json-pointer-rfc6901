;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.JSON.pointer = factory();
  }
}(this, function () {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzb24tcG9pbnRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztPQUFBLElBQUEsNkJBQUE7RUFBQTs7O0FBQU07OztFQUNTLDBCQUFDLE9BQUQ7QUFDWCxRQUFBO0lBQUEsSUFBQSxHQUFPLGtEQUFNLE9BQU47SUFFUCxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQztJQUNoQixJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQztJQUNkLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLFdBQVcsQ0FBQztFQUxWOzs7O0dBRGdCOztBQVF6QjtFQUNKLFdBQUMsQ0FBQSxnQkFBRCxHQUFtQjs7O0FBRW5COzs7Ozs7Ozs7RUFRYSxxQkFBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixLQUFsQjtBQUNKLFlBQU8sU0FBUyxDQUFDLE1BQWpCO0FBQUEsV0FDQSxDQURBO2VBQ08sV0FBVyxDQUFDLEdBQVosQ0FBZ0IsTUFBaEIsRUFBd0IsT0FBeEIsRUFBaUMsS0FBakM7QUFEUCxXQUVBLENBRkE7ZUFFTyxXQUFXLENBQUMsR0FBWixDQUFnQixNQUFoQixFQUF3QixPQUF4QjtBQUZQLFdBR0EsQ0FIQTtlQUdPLFdBQVcsQ0FBQyxTQUFaLENBQXNCO1VBQUUsTUFBQSxFQUFRLE1BQVY7U0FBdEI7QUFIUDtlQUlBO0FBSkE7RUFESTs7O0FBT2I7Ozs7Ozs7Ozs7O0VBVUEsV0FBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLEdBQUQ7QUFFVixRQUFBO0lBRnFCLFVBQVIsUUFBc0IsVUFBVCxTQUF1QixVQUFUO0lBRXhDLE1BQUEsR0FBUyxHQUFBLEtBQU87SUFDaEIsTUFBQSxHQUFTO0lBQ1QsTUFBQSxHQUFTO0lBR1QsSUFBRyxPQUFPLEdBQVAsS0FBYyxRQUFqQjtNQUNFLEdBQUEsR0FBTSxJQUFDLENBQUEsS0FBRCxDQUFPLEdBQVAsRUFEUjs7SUFJQSxZQUFBLEdBQWUsU0FBQyxRQUFEO0FBQ2IsVUFBQTs7UUFEYyxXQUFXOztNQUN6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QXRCO1FBQ0UsT0FBQSxHQUFVLEdBQUcsQ0FBQyxPQURoQjtPQUFBLE1BRUssSUFBRyxPQUFPLENBQUMsS0FBUixDQUFjLGtCQUFkLENBQUEsSUFBc0MsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLENBQXpDO1FBQ0gsT0FBQSxHQUFVLFFBQUEsQ0FBUyxPQUFULEVBQWtCLEVBQWxCLEVBRFA7O01BR0wsSUFBRyxDQUFJLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixDQUFQO0FBQ0UsZUFBTyxNQURUOztNQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWI7SUFaUjtBQWNBLFdBQU87RUF2QkgiLCJmaWxlIjoianNvbi1wb2ludGVyLndlYi5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEpzb25Qb2ludGVyRXJyb3IgZXh0ZW5kcyBFcnJvclxyXG4gIGNvbnN0cnVjdG9yOiAobWVzc2FnZSkgLT5cclxuICAgIGJhc2UgPSBzdXBlcihtZXNzYWdlKVxyXG5cclxuICAgIEBtZXNzYWdlID0gYmFzZS5tZXNzYWdlXHJcbiAgICBAc3RhY2sgPSBiYXNlLnN0YWNrXHJcbiAgICBAbmFtZSA9IEBjb25zdHJ1Y3Rvci5uYW1lXHJcblxyXG5jbGFzcyBKc29uUG9pbnRlclxyXG4gIEBKc29uUG9pbnRlckVycm9yOiBKc29uUG9pbnRlckVycm9yXHJcblxyXG4gICMjI1xyXG4gICMgQ29udmVuaWVuY2UgZnVuY3Rpb24gZm9yIGNob29zaW5nIGJldHdlZW4gYC5zbWFydEJpbmRgLCBgLmdldGAsIGFuZCBgLnNldGAsIGRlcGVuZGluZyBvbiB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cy5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9iamVjdFxyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAjIEByZXR1cm5zIHsqfSBldmFsdWF0aW9uIG9mIHRoZSBwcm94aWVkIG1ldGhvZFxyXG4gICMjI1xyXG4gIGNvbnN0cnVjdG9yOiAob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSkgLT5cclxuICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICB3aGVuIDMgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqZWN0LCBwb2ludGVyLCB2YWx1ZSlcclxuICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iamVjdCwgcG9pbnRlcilcclxuICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc21hcnRCaW5kKHsgb2JqZWN0OiBvYmplY3QgfSlcclxuICAgICAgZWxzZSBudWxsXHJcblxyXG4gICMjI1xyXG4gICMgQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBhcGksIHdpdGggYC4vLmdldC8uaGFzLy5zZXQvLmRlbC8uc21hcnRCaW5kYCBtZXRob2Qgc2lnbmF0dXJlcyBhZGp1c3RlZC5cclxuICAjIFRoZSBzbWFydEJpbmQgbWV0aG9kIGlzIGN1bXVsYXRpdmUsIG1lYW5pbmcgdGhhdCBgLnNtYXJ0QmluZCh7IG9iamVjdDogeH0pLnNtYXJ0QmluZCh7IHBvaW50ZXI6IHkgfSlgIHdpbGwgYmVoYXZlIGFzIGV4cGVjdGVkLlxyXG4gICNcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBiaW5kaW5nc1xyXG4gICMgQHBhcmFtIHsqfSBiaW5kaW5ncy5vYmplY3RcclxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBiaW5kaW5ncy5wb2ludGVyXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gYmluZGluZ3Mub3B0aW9uc1xyXG4gICMgQHJldHVybnMge0pzb25Qb2ludGVyfVxyXG4gICMjI1xyXG4gIEBzbWFydEJpbmQ6ICh7IG9iamVjdDogb2JqLCBwb2ludGVyOiBwdHIsIG9wdGlvbnM6IG9wdCB9KSAtPlxyXG4gICAgIyBXaGF0IGFyZSBiaW5kaW5nP1xyXG4gICAgaGFzT2JqID0gb2JqICE9IHVuZGVmaW5lZFxyXG4gICAgaGFzUHRyID0gcHRyP1xyXG4gICAgaGFzT3B0ID0gb3B0P1xyXG5cclxuICAgICMgTGV0cyBub3QgcGFyc2UgdGhpcyBldmVyeSB0aW1lIVxyXG4gICAgaWYgdHlwZW9mIHB0ciA9PSAnc3RyaW5nJ1xyXG4gICAgICBwdHIgPSBAcGFyc2UocHRyKVxyXG5cclxuICAgICMgZGVmYXVsdCBvcHRpb25zIGhhdmUgY2hhbmdlZFxyXG4gICAgbWVyZ2VPcHRpb25zID0gKG92ZXJyaWRlID0ge30pIC0+XHJcbiAgICAgIG8gPSB7fVxyXG5cclxuICAgICAgby5oYXNPd25Qcm9wID0gb3ZlcnJpZGUuaGFzT3duUHJvcCA/IG9wdC5oYXNPd25Qcm9wXHJcbiAgICAgIG8uZ2V0UHJvcCA9IG92ZXJyaWRlLmdldFByb3AgPyBvcHQuZ2V0UHJvcFxyXG4gICAgICBvLnNldFByb3AgPSBvdmVycmlkZS5zZXRQcm9wID8gb3B0LnNldFByb3BcclxuICAgICAgby5nZXROb3RGb3VuZCA9IG92ZXJyaWRlLmdldE5vdEZvdW5kID8gb3B0LmdldE5vdEZvdW5kXHJcbiAgICAgIG8uc2V0Tm90Rm91bmQgPSBvdmVycmlkZS5zZXROb3RGb3VuZCA/IG9wdC5zZXROb3RGb3VuZFxyXG4gICAgICBvLmRlbE5vdEZvdW5kID0gb3ZlcnJpZGUuZGVsTm90Rm91bmQgPyBvcHQuZGVsTm90Rm91bmRcclxuXHJcbiAgICAgIHJldHVybiBvXHJcblxyXG4gICAgYXBpID0gdW5kZWZpbmVkXHJcblxyXG4gICAgIyBFdmVyeSBjb21iaW5hdGlvbiBvZiBiaW5kaW5nc1xyXG4gICAgaWYgaGFzT2JqIGFuZCBoYXNQdHIgYW5kIGhhc09wdFxyXG4gICAgICBhcGkgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDAgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9ICh2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmhhcyA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZGVsID0gKG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc09iaiBhbmQgaGFzUHRyXHJcbiAgICAgIGFwaSA9ICh2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXHJcbiAgICAgICAgICB3aGVuIDAgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAodmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmdldCA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmhhcyA9IChvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmRlbCA9IChvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgIGVsc2UgaWYgaGFzT2JqIGFuZCBoYXNPcHRcclxuICAgICAgYXBpID0gKHB0ciwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChwdHIsIHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmdldCA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5oYXMgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZGVsID0gKHB0ciwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgIGVsc2UgaWYgaGFzUHRyIGFuZCBoYXNPcHRcclxuICAgICAgYXBpID0gKG9iaiwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChvYmosIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmdldCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZGVsID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgIGVsc2UgaWYgaGFzT3B0XHJcbiAgICAgIGFwaSA9IChvYmosIHB0ciwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDMgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG9wdClcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIGFwaS5zbWFydEJpbmQoeyBvYmplY3Q6IG9iaiB9KVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5oYXMgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc09ialxyXG4gICAgICBhcGkgPSAocHRyLCB2YWx1ZSkgLT5cclxuICAgICAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAocHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZ2V0ID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5oYXMgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmRlbCA9IChwdHIsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgZWxzZSBpZiBoYXNQdHJcclxuICAgICAgYXBpID0gKG9iaiwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKG9iaiwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmdldCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuaGFzID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5kZWwgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIEBcclxuXHJcbiAgICAjIHNtYXJ0QmluZCBoYXMgbmV3IGRlZmF1bHRzXHJcbiAgICBhcGkuc21hcnRCaW5kID0gKG92ZXJyaWRlKSAtPlxyXG4gICAgICBvID0ge31cclxuXHJcbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdvYmplY3QnKVxyXG4gICAgICAgIG8ub2JqZWN0ID0gb3ZlcnJpZGUub2JqZWN0XHJcbiAgICAgIGVsc2UgaWYgaGFzT2JqXHJcbiAgICAgICAgby5vYmplY3QgPSBvYmpcclxuXHJcbiAgICAgIGlmIHt9Lmhhc093blByb3BlcnR5LmNhbGwob3ZlcnJpZGUsICdwb2ludGVyJylcclxuICAgICAgICBvLnBvaW50ZXIgPSBvdmVycmlkZS5wb2ludGVyXHJcbiAgICAgIGVsc2UgaWYgaGFzUHRyXHJcbiAgICAgICAgby5wb2ludGVyID0gcHRyXHJcblxyXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAnb3B0aW9ucycpXHJcbiAgICAgICAgby5vcHRpb25zID0gbWVyZ2VPcHRpb25zKG92ZXJyaWRlLm9wdGlvbnMpXHJcbiAgICAgIGVsc2UgaWYgaGFzT2JqXHJcbiAgICAgICAgby5vcHRpb25zID0gb3B0XHJcblxyXG4gICAgICByZXR1cm4gSnNvblBvaW50ZXIuc21hcnRCaW5kKG8pXHJcblxyXG4gICAgIyBjb3B5IHRoZSByZW1haW5pbmcgbWV0aG9kcyB3aGljaCBkbyBub3QgbmVlZCBiaW5kaW5nXHJcbiAgICBmb3Igb3duIGtleSwgdmFsIG9mIEpzb25Qb2ludGVyXHJcbiAgICAgIGlmIG5vdCB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwaSwga2V5KVxyXG4gICAgICAgIGFwaVtrZXldID0gdmFsXHJcblxyXG4gICAgIyBmaW5hbCByZXN1bHRcclxuICAgIHJldHVybiBhcGlcclxuXHJcbiAgIyMjXHJcbiAgIyBFc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQgYXMgZGVzY3JpYmVkIGJ5IFJGQzY5MDEuXHJcbiAgI1xyXG4gICMgTm90YWJseSwgYCd+J2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJ34wJ2AgYW5kIGAnLydgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MSdgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEBlc2NhcGU6IChzZWdtZW50KSAtPlxyXG4gICAgc2VnbWVudC5yZXBsYWNlKC9+L2csICd+MCcpLnJlcGxhY2UoL1xcLy9nLCAnfjEnKVxyXG5cclxuICAjIyNcclxuICAjIFVuLUVzY2FwZXMgdGhlIGdpdmVuIHBhdGggc2VnbWVudCwgcmV2ZXJzaW5nIHRoZSBhY3Rpb25zIG9mIGAuZXNjYXBlYC5cclxuICAjXHJcbiAgIyBOb3RhYmx5LCBgJ34xJ2AncyBhcmUgcmVwbGFjZWQgd2l0aCBgJy8nYCBhbmQgYCd+MCdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+J2AuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmd9IHNlZ21lbnRcclxuICAjIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgIyMjXHJcbiAgQHVuZXNjYXBlOiAoc2VnbWVudCkgLT5cclxuICAgIHNlZ21lbnQucmVwbGFjZSgvfjEvZywgJy8nKS5yZXBsYWNlKC9+MC9nLCAnficpXHJcblxyXG4gICMjI1xyXG4gICMgUGFyc2VzIGEganNvbi1wb2ludGVyLCBhcyBkZXNyaWJlZCBieSBSRkM5MDEsIGludG8gYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cy5cclxuICAjXHJcbiAgIyBAdGhyb3dzIHtKc29uUG9pbnRlckVycm9yfSBmb3IgaW52YWxpZCBqc29uLXBvaW50ZXJzLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzdHJcclxuICAjIEByZXR1cm5zIHtzdHJpbmdbXX1cclxuICAjIyNcclxuICBAcGFyc2U6IChzdHIpIC0+XHJcbiAgICBpZiBzdHIgPT0gJydcclxuICAgICAgcmV0dXJuIFtdXHJcblxyXG4gICAgaWYgc3RyLmNoYXJBdCgwKSAhPSAnLydcclxuICAgICAgdGhyb3cgbmV3IEpzb25Qb2ludGVyRXJyb3IoXCJJbnZhbGlkIEpTT04gcG9pbnRlcjogI3tzdHJ9XCIpXHJcblxyXG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMSkuc3BsaXQoJy8nKS5tYXAoSnNvblBvaW50ZXIudW5lc2NhcGUpXHJcblxyXG4gICMjI1xyXG4gICMgQ29udmVydHMgYW4gYXJyYXkgb2YgcGF0aCBzZWdtZW50cyBpbnRvIGEganNvbiBwYXRoLlxyXG4gICMgVGhpcyBtZXRob2QgaXMgdGhlIHJldmVyc2Ugb2YgYC5wYXJzZWAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgIyMjXHJcbiAgQGNvbXBpbGU6IChzZWdtZW50cykgLT5cclxuICAgIHNlZ21lbnRzLm1hcCgoc2VnbWVudCkgLT4gJy8nICsgSnNvblBvaW50ZXIuZXNjYXBlKHNlZ21lbnQpKS5qb2luKCcnKVxyXG5cclxuICAjIyNcclxuICAjIENhbGxiYWNrIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBjb250YWlucyBhIGdpdmVuIHByb3BlcnR5LlxyXG4gICNcclxuICAjIEBjYWxsYmFjayBoYXNQcm9wXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAjIyNcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgIGFuZCBgb2JqYCBpcyBlaXRoZXIgYW4gQXJyYXkgb3IgYW4gT2JqZWN0LlxyXG4gICMgSWdub3JlcyB0aGUgcHJvdG90eXBlIGNoYWluLlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmhhc1Byb3BgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICMjI1xyXG4gIEBoYXNKc29uUHJvcDogKG9iaiwga2V5KSAtPlxyXG4gICAgaWYgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgIHJldHVybiAodHlwZW9mIGtleSA9PSAnbnVtYmVyJykgYW5kIChrZXkgPCBvYmoubGVuZ3RoKVxyXG4gICAgZWxzZSBpZiB0eXBlb2Ygb2JqID09ICdvYmplY3QnXHJcbiAgICAgIHJldHVybiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KVxyXG4gICAgZWxzZVxyXG4gICAgICByZXR1cm4gZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgLCBkaXNyZWdhcmRpbmcgdGhlIHByb3RvdHlwZSBjaGFpbi5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAjIyNcclxuICBAaGFzT3duUHJvcDogKG9iaiwga2V5KSAtPlxyXG4gICAge30uaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIGBvYmpgIGNvbnRhaW5zIGBrZXlgLCBpbmNsdWRpbmcgdmlhIHRoZSBwcm90b3R5cGUgY2hhaW4uXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGhhc1Byb3A6IChvYmosIGtleSkgLT5cclxuICAgIGtleSBvZiBvYmpcclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIHJldHJpZXZlIGEgcHJvcGVydHkgZnJvbSBhbiBvYmplY3RcclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgRmluZHMgdGhlIGdpdmVuIGBrZXlgIGluIGBvYmpgLlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLmdldFByb3BgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG4gIEBnZXRQcm9wOiAob2JqLCBrZXkpIC0+XHJcbiAgICBvYmpba2V5XVxyXG5cclxuICAjIyNcclxuICAjIENhbGxiYWNrIHVzZWQgdG8gc2V0IGEgcHJvcGVydHkgb24gYW4gb2JqZWN0LlxyXG4gICNcclxuICAjIEBjYWxsYmFjayBzZXRQcm9wXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcGFyYW0geyp9IHZhbHVlXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuXHJcbiAgIyMjXHJcbiAgIyBTZXRzIHRoZSBnaXZlbiBga2V5YCBpbiBgb2JqYCB0byBgdmFsdWVgLlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLnNldFByb3BgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEBwYXJhbSB7Kn0gdmFsdWVcclxuICAjIEByZXR1cm5zIHsqfSBgdmFsdWVgXHJcbiAgIyMjXHJcbiAgQHNldFByb3A6IChvYmosIGtleSwgdmFsdWUpIC0+XHJcbiAgICBvYmpba2V5XSA9IHZhbHVlXHJcblxyXG4gICMjI1xyXG4gICMgQ2FsbGJhY2sgdXNlZCB0byBtb2RpZnkgYmVoYXZpb3VyIHdoZW4gYSBnaXZlbiBwYXRoIHNlZ21lbnQgY2Fubm90IGJlIGZvdW5kLlxyXG4gICNcclxuICAjIEBjYWxsYmFjayBub3RGb3VuZFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0aGUgdmFsdWUgdG8gdXNlIHdoZW4gYC5nZXRgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5nZXROb3RGb3VuZGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcclxuICAjIEBwYXJhbSB7Kn0gcm9vdFxyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcclxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgIyMjXHJcbiAgQGdldE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICB1bmRlZmluZWRcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRoZSB2YWx1ZSB0byB1c2Ugd2hlbiBgLnNldGAgZmFpbHMgdG8gbG9jYXRlIGEgcG9pbnRlciBzZWdtZW50LlxyXG4gICNcclxuICAjIERlZmF1bHQgdmFsdWUgZm9yIGBvcHRpb25zLnNldE5vdEZvdW5kYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0gc2VnbWVudFxyXG4gICMgQHBhcmFtIHsqfSByb290XHJcbiAgIyBAcGFyYW0ge3N0cmluZ1tdfSBzZWdtZW50c1xyXG4gICMgQHBhcmFtIHtpbnRlZ2VyfSBpU2VnbWVudFxyXG4gICMgQHJldHVybnMge3VuZGVmaW5lZH1cclxuICAjIyNcclxuICBAc2V0Tm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cclxuICAgIGlmIHNlZ21lbnRzW2lTZWdtZW50ICsgMV0ubWF0Y2goL14oPzowfFsxLTldXFxkKnwtKSQvKVxyXG4gICAgICByZXR1cm4gb2JqW3NlZ21lbnRdID0gW11cclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIG9ialtzZWdtZW50XSA9IHt9XHJcblxyXG4gICMjI1xyXG4gICMgUGVyZm9ybXMgYW4gYWN0aW9uIHdoZW4gYC5kZWxgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5kZWxOb3RGb3VuZGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcclxuICAjIEBwYXJhbSB7Kn0gcm9vdFxyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcclxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgIyMjXHJcbiAgQGRlbE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICB1bmRlZmluZWRcclxuXHJcbiAgIyMjXHJcbiAgIyBSYWlzZXMgYSBKc29uUG9pbnRlckVycm9yIHdoZW4gdGhlIGdpdmVuIHBvaW50ZXIgc2VnbWVudCBpcyBub3QgZm91bmQuXHJcbiAgI1xyXG4gICMgTWF5IGJlIHVzZWQgaW4gcGxhY2Ugb2YgdGhlIGFib3ZlIG1ldGhvZHMgdmlhIHRoZSBgb3B0aW9uc2AgYXJndW1lbnQgb2YgYC4vLmdldC8uc2V0Ly5oYXMvLmRlbC8uc2ltcGxlQmluZGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcclxuICAjIEBwYXJhbSB7Kn0gcm9vdFxyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcclxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgIyMjXHJcbiAgQGVycm9yTm90Rm91bmQ6IChvYmosIHNlZ21lbnQsIHJvb3QsIHNlZ21lbnRzLCBpU2VnbWVudCkgLT5cclxuICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiVW5hYmxlIHRvIGZpbmQganNvbiBwYXRoOiAje0pzb25Qb2ludGVyLmNvbXBpbGUoc2VnbWVudHMuc2xpY2UoMCwgaVNlZ21lbnQrMSkpfVwiKVxyXG5cclxuICAjIyNcclxuICAjIFNldHMgdGhlIGxvY2F0aW9uIGluIGBvYmplY3RgLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCB0byBgdmFsdWVgLlxyXG4gICMgSWYgYHBvaW50ZXJgIHJlZmVycyB0byB0aGUgd2hvbGUgZG9jdW1lbnQsIGB2YWx1ZWAgaXMgcmV0dXJuZWQgd2l0aG91dCBtb2RpZnlpbmcgYG9iamVjdGAsXHJcbiAgIyBvdGhlcndpc2UsIGBvYmplY3RgIG1vZGlmaWVkIGFuZCByZXR1cm5lZC5cclxuICAjXHJcbiAgIyBCeSBkZWZhdWx0LCBpZiBhbnkgbG9jYXRpb24gc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCBkb2VzIG5vdCBleGlzdCwgdGhlIGxvY2F0aW9uIGlzIGNyZWF0ZWQgdXNpbmcgb2JqZWN0cyBhbmQgYXJyYXlzLlxyXG4gICMgQXJyYXlzIGFyZSB1c2VkIG9ubHkgd2hlbiB0aGUgaW1tZWRpYXRlbHkgZm9sbG93aW5nIHBhdGggc2VnbWVudCBpcyBhbiBhcnJheSBlbGVtZW50IGFzIGRlZmluZWQgYnkgdGhlIHN0YW5kYXJkLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHtzZXRQcm9wfSBvcHRpb25zLnNldFByb3BcclxuICAjIEBwYXJhbSB7bm90Rm91bmR9IG9wdGlvbnMuZ2V0Tm90Rm91bmRcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG4gIEBzZXQ6IChvYmosIHBvaW50ZXIsIHZhbHVlLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcclxuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXHJcblxyXG4gICAgaWYgcG9pbnRlci5sZW5ndGggPT0gMFxyXG4gICAgICByZXR1cm4gdmFsdWVcclxuXHJcbiAgICBoYXNQcm9wID0gb3B0aW9ucz8uaGFzUHJvcCA/IEpzb25Qb2ludGVyLmhhc0pzb25Qcm9wXHJcbiAgICBnZXRQcm9wID0gb3B0aW9ucz8uZ2V0UHJvcCA/IEpzb25Qb2ludGVyLmdldFByb3BcclxuICAgIHNldFByb3AgPSBvcHRpb25zPy5zZXRQcm9wID8gSnNvblBvaW50ZXIuc2V0UHJvcFxyXG4gICAgc2V0Tm90Rm91bmQgPSBvcHRpb25zPy5zZXROb3RGb3VuZCA/IEpzb25Qb2ludGVyLnNldE5vdEZvdW5kXHJcblxyXG4gICAgcm9vdCA9IG9ialxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG5cclxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxyXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cclxuICAgICAgKytpU2VnbWVudFxyXG5cclxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXHJcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxyXG5cclxuICAgICAgaWYgaVNlZ21lbnQgPT0gbGVuXHJcbiAgICAgICAgc2V0UHJvcChvYmosIHNlZ21lbnQsIHZhbHVlKVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGVsc2UgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxyXG4gICAgICAgIG9iaiA9IHNldE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIHJvb3RcclxuXHJcbiAgIyMjXHJcbiAgIyBGaW5kcyB0aGUgdmFsdWUgaW4gYG9iamAgYXMgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYFxyXG4gICNcclxuICAjIEJ5IGRlZmF1bHQsIHJldHVybnMgdW5kZWZpbmVkIGZvciB2YWx1ZXMgd2hpY2ggY2Fubm90IGJlIGZvdW5kXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcclxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXHJcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmdldE5vdEZvdW5kXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAZ2V0OiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcclxuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXHJcblxyXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxyXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXHJcbiAgICBnZXROb3RGb3VuZCA9IG9wdGlvbnM/LmdldE5vdEZvdW5kID8gSnNvblBvaW50ZXIuZ2V0Tm90Rm91bmRcclxuXHJcbiAgICByb290ID0gb2JqXHJcbiAgICBpU2VnbWVudCA9IDBcclxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXHJcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cclxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXHJcbiAgICAgICsraVNlZ21lbnRcclxuXHJcbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxyXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcclxuXHJcbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcclxuICAgICAgICByZXR1cm4gZ2V0Tm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcclxuXHJcbiAgICByZXR1cm4gb2JqXHJcblxyXG4gICMjI1xyXG4gICMgUmVtb3ZlcyB0aGUgbG9jYXRpb24sIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIGZyb20gYG9iamVjdGAuXHJcbiAgIyBSZXR1cm5zIHRoZSBtb2RpZmllZCBgb2JqZWN0YCwgb3IgdW5kZWZpbmVkIGlmIHRoZSBgcG9pbnRlcmAgaXMgZW1wdHkuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcclxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXHJcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmRlbE5vdEZvdW5kXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAZGVsOiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcclxuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXHJcblxyXG4gICAgaWYgcG9pbnRlci5sZW5ndGggPT0gMFxyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkXHJcblxyXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxyXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXHJcbiAgICBkZWxOb3RGb3VuZCA9IG9wdGlvbnM/LmRlbE5vdEZvdW5kID8gSnNvblBvaW50ZXIuZGVsTm90Rm91bmRcclxuXHJcbiAgICByb290ID0gb2JqXHJcbiAgICBpU2VnbWVudCA9IDBcclxuICAgIGxlbiA9IHBvaW50ZXIubGVuZ3RoXHJcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cclxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXHJcbiAgICAgICsraVNlZ21lbnRcclxuXHJcbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxyXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcclxuXHJcbiAgICAgIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcclxuICAgICAgICBkZWxOb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBlbHNlIGlmIGlTZWdtZW50ID09IGxlblxyXG4gICAgICAgIGRlbGV0ZSBvYmpbc2VnbWVudF1cclxuICAgICAgICBicmVha1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIHJvb3RcclxuXHJcbiAgIyMjXHJcbiAgIyBSZXR1cm5zIHRydWUgaWZmIHRoZSBsb2NhdGlvbiwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgZXhpc3RzIGluIGBvYmplY3RgXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwb2ludGVyXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICMgQHBhcmFtIHtoYXNQcm9wfSBvcHRpb25zLmhhc1Byb3BcclxuICAjIEBwYXJhbSB7Z2V0UHJvcH0gb3B0aW9ucy5nZXRQcm9wXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAaGFzOiAob2JqLCBwb2ludGVyLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgdHlwZW9mIHBvaW50ZXIgPT0gJ3N0cmluZydcclxuICAgICAgcG9pbnRlciA9IEpzb25Qb2ludGVyLnBhcnNlKHBvaW50ZXIpXHJcblxyXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxyXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXHJcblxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICAgICBvYmogPSBnZXRQcm9wKG9iaiwgc2VnbWVudClcclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4iXX0=