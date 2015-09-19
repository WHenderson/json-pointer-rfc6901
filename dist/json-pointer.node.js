(function (){
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

module.exports = JsonPointer;
})();

//# sourceMappingURL=data:application/json;base64,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Q0UsT0FBQSxHQUFVLEdBQUcsQ0FBQyxPQURoQjtPQUFBLE1BRUssSUFBRyxPQUFPLENBQUMsS0FBUixDQUFjLGtCQUFkLENBQUEsSUFBc0MsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLENBQXpDO1FBQ0gsT0FBQSxHQUFVLFFBQUEsQ0FBUyxPQUFULEVBQWtCLEVBQWxCLEVBRFA7O01BR0wsSUFBRyxDQUFJLE9BQUEsQ0FBUSxHQUFSLEVBQWEsT0FBYixDQUFQO0FBQ0UsZUFBTyxNQURUOztNQUdBLEdBQUEsR0FBTSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQWI7SUFaUjtBQWNBLFdBQU87RUF2QkgiLCJmaWxlIjoianNvbi1wb2ludGVyLm5vZGUuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBKc29uUG9pbnRlckVycm9yIGV4dGVuZHMgRXJyb3JcclxuICBjb25zdHJ1Y3RvcjogKG1lc3NhZ2UpIC0+XHJcbiAgICBiYXNlID0gc3VwZXIobWVzc2FnZSlcclxuXHJcbiAgICBAbWVzc2FnZSA9IGJhc2UubWVzc2FnZVxyXG4gICAgQHN0YWNrID0gYmFzZS5zdGFja1xyXG4gICAgQG5hbWUgPSBAY29uc3RydWN0b3IubmFtZVxyXG5cclxuY2xhc3MgSnNvblBvaW50ZXJcclxuICBASnNvblBvaW50ZXJFcnJvcjogSnNvblBvaW50ZXJFcnJvclxyXG5cclxuICAjIyNcclxuICAjIENvbnZlbmllbmNlIGZ1bmN0aW9uIGZvciBjaG9vc2luZyBiZXR3ZWVuIGAuc21hcnRCaW5kYCwgYC5nZXRgLCBhbmQgYC5zZXRgLCBkZXBlbmRpbmcgb24gdGhlIG51bWJlciBvZiBhcmd1bWVudHMuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmplY3RcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBwb2ludGVyXHJcbiAgIyBAcGFyYW0geyp9IHZhbHVlXHJcbiAgIyBAcmV0dXJucyB7Kn0gZXZhbHVhdGlvbiBvZiB0aGUgcHJveGllZCBtZXRob2RcclxuICAjIyNcclxuICBjb25zdHJ1Y3RvcjogKG9iamVjdCwgcG9pbnRlciwgdmFsdWUpIC0+XHJcbiAgICByZXR1cm4gc3dpdGNoIGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgd2hlbiAzIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iamVjdCwgcG9pbnRlciwgdmFsdWUpXHJcbiAgICAgIHdoZW4gMiB0aGVuIEpzb25Qb2ludGVyLmdldChvYmplY3QsIHBvaW50ZXIpXHJcbiAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLnNtYXJ0QmluZCh7IG9iamVjdDogb2JqZWN0IH0pXHJcbiAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAjIyNcclxuICAjIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYXBpLCB3aXRoIGAuLy5nZXQvLmhhcy8uc2V0Ly5kZWwvLnNtYXJ0QmluZGAgbWV0aG9kIHNpZ25hdHVyZXMgYWRqdXN0ZWQuXHJcbiAgIyBUaGUgc21hcnRCaW5kIG1ldGhvZCBpcyBjdW11bGF0aXZlLCBtZWFuaW5nIHRoYXQgYC5zbWFydEJpbmQoeyBvYmplY3Q6IHh9KS5zbWFydEJpbmQoeyBwb2ludGVyOiB5IH0pYCB3aWxsIGJlaGF2ZSBhcyBleHBlY3RlZC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge09iamVjdH0gYmluZGluZ3NcclxuICAjIEBwYXJhbSB7Kn0gYmluZGluZ3Mub2JqZWN0XHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gYmluZGluZ3MucG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IGJpbmRpbmdzLm9wdGlvbnNcclxuICAjIEByZXR1cm5zIHtKc29uUG9pbnRlcn1cclxuICAjIyNcclxuICBAc21hcnRCaW5kOiAoeyBvYmplY3Q6IG9iaiwgcG9pbnRlcjogcHRyLCBvcHRpb25zOiBvcHQgfSkgLT5cclxuICAgICMgV2hhdCBhcmUgYmluZGluZz9cclxuICAgIGhhc09iaiA9IG9iaiAhPSB1bmRlZmluZWRcclxuICAgIGhhc1B0ciA9IHB0cj9cclxuICAgIGhhc09wdCA9IG9wdD9cclxuXHJcbiAgICAjIExldHMgbm90IHBhcnNlIHRoaXMgZXZlcnkgdGltZSFcclxuICAgIGlmIHR5cGVvZiBwdHIgPT0gJ3N0cmluZydcclxuICAgICAgcHRyID0gQHBhcnNlKHB0cilcclxuXHJcbiAgICAjIGRlZmF1bHQgb3B0aW9ucyBoYXZlIGNoYW5nZWRcclxuICAgIG1lcmdlT3B0aW9ucyA9IChvdmVycmlkZSA9IHt9KSAtPlxyXG4gICAgICBvID0ge31cclxuXHJcbiAgICAgIG8uaGFzT3duUHJvcCA9IG92ZXJyaWRlLmhhc093blByb3AgPyBvcHQuaGFzT3duUHJvcFxyXG4gICAgICBvLmdldFByb3AgPSBvdmVycmlkZS5nZXRQcm9wID8gb3B0LmdldFByb3BcclxuICAgICAgby5zZXRQcm9wID0gb3ZlcnJpZGUuc2V0UHJvcCA/IG9wdC5zZXRQcm9wXHJcbiAgICAgIG8uZ2V0Tm90Rm91bmQgPSBvdmVycmlkZS5nZXROb3RGb3VuZCA/IG9wdC5nZXROb3RGb3VuZFxyXG4gICAgICBvLnNldE5vdEZvdW5kID0gb3ZlcnJpZGUuc2V0Tm90Rm91bmQgPyBvcHQuc2V0Tm90Rm91bmRcclxuICAgICAgby5kZWxOb3RGb3VuZCA9IG92ZXJyaWRlLmRlbE5vdEZvdW5kID8gb3B0LmRlbE5vdEZvdW5kXHJcblxyXG4gICAgICByZXR1cm4gb1xyXG5cclxuICAgIGFwaSA9IHVuZGVmaW5lZFxyXG5cclxuICAgICMgRXZlcnkgY29tYmluYXRpb24gb2YgYmluZGluZ3NcclxuICAgIGlmIGhhc09iaiBhbmQgaGFzUHRyIGFuZCBoYXNPcHRcclxuICAgICAgYXBpID0gKHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAodmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNPYmogYW5kIGhhc1B0clxyXG4gICAgICBhcGkgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxyXG4gICAgICAgICAgd2hlbiAwIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHZhbHVlLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5nZXQgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmdldChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5oYXMgPSAob3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5kZWwgPSAob3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICBlbHNlIGlmIGhhc09iaiBhbmQgaGFzT3B0XHJcbiAgICAgIGFwaSA9IChwdHIsIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAocHRyLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IG9iaiA9IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAocHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChwdHIsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc1B0ciBhbmQgaGFzT3B0XHJcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICBlbHNlIG51bGxcclxuXHJcbiAgICAgIGFwaS5zZXQgPSAob2JqLCB2YWx1ZSwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLnNldChvYmosIHB0ciwgdmFsdWUsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgbWVyZ2VPcHRpb25zKG92ZXJyaWRlKSlcclxuICAgICAgYXBpLmRlbCA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5kZWwob2JqLCBwdHIsIG1lcmdlT3B0aW9ucyhvdmVycmlkZSkpXHJcbiAgICBlbHNlIGlmIGhhc09wdFxyXG4gICAgICBhcGkgPSAob2JqLCBwdHIsIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAzIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3B0KVxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvcHQpXHJcbiAgICAgICAgICB3aGVuIDEgdGhlbiBhcGkuc21hcnRCaW5kKHsgb2JqZWN0OiBvYmogfSlcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChvYmosIHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZ2V0ID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuaGFzID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuaGFzKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgICBhcGkuZGVsID0gKG9iaiwgcHRyLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBtZXJnZU9wdGlvbnMob3ZlcnJpZGUpKVxyXG4gICAgZWxzZSBpZiBoYXNPYmpcclxuICAgICAgYXBpID0gKHB0ciwgdmFsdWUpIC0+XHJcbiAgICAgICAgcmV0dXJuIHN3aXRjaCBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICAgICB3aGVuIDIgdGhlbiBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlKVxyXG4gICAgICAgICAgd2hlbiAxIHRoZW4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyKVxyXG4gICAgICAgICAgZWxzZSBudWxsXHJcblxyXG4gICAgICBhcGkuc2V0ID0gKHB0ciwgdmFsdWUsIG92ZXJyaWRlKSAtPiBvYmogPSBKc29uUG9pbnRlci5zZXQob2JqLCBwdHIsIHZhbHVlLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmdldCA9IChwdHIsIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5nZXQob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuaGFzID0gKHB0ciwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmhhcyhvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5kZWwgPSAocHRyLCBvdmVycmlkZSkgLT4gb2JqID0gSnNvblBvaW50ZXIuZGVsKG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgIGVsc2UgaWYgaGFzUHRyXHJcbiAgICAgIGFwaSA9IChvYmosIHZhbHVlKSAtPlxyXG4gICAgICAgIHJldHVybiBzd2l0Y2ggYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAgICAgd2hlbiAyIHRoZW4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSlcclxuICAgICAgICAgIHdoZW4gMSB0aGVuIEpzb25Qb2ludGVyLmdldChvYmosIHB0cilcclxuICAgICAgICAgIGVsc2UgbnVsbFxyXG5cclxuICAgICAgYXBpLnNldCA9IChvYmosIHZhbHVlLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuc2V0KG9iaiwgcHRyLCB2YWx1ZSwgb3ZlcnJpZGUpXHJcbiAgICAgIGFwaS5nZXQgPSAob2JqLCBvdmVycmlkZSkgLT4gSnNvblBvaW50ZXIuZ2V0KG9iaiwgcHRyLCBvdmVycmlkZSlcclxuICAgICAgYXBpLmhhcyA9IChvYmosIG92ZXJyaWRlKSAtPiBKc29uUG9pbnRlci5oYXMob2JqLCBwdHIsIG92ZXJyaWRlKVxyXG4gICAgICBhcGkuZGVsID0gKG9iaiwgb3ZlcnJpZGUpIC0+IEpzb25Qb2ludGVyLmRlbChvYmosIHB0ciwgb3ZlcnJpZGUpXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBAXHJcblxyXG4gICAgIyBzbWFydEJpbmQgaGFzIG5ldyBkZWZhdWx0c1xyXG4gICAgYXBpLnNtYXJ0QmluZCA9IChvdmVycmlkZSkgLT5cclxuICAgICAgbyA9IHt9XHJcblxyXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAnb2JqZWN0JylcclxuICAgICAgICBvLm9iamVjdCA9IG92ZXJyaWRlLm9iamVjdFxyXG4gICAgICBlbHNlIGlmIGhhc09ialxyXG4gICAgICAgIG8ub2JqZWN0ID0gb2JqXHJcblxyXG4gICAgICBpZiB7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG92ZXJyaWRlLCAncG9pbnRlcicpXHJcbiAgICAgICAgby5wb2ludGVyID0gb3ZlcnJpZGUucG9pbnRlclxyXG4gICAgICBlbHNlIGlmIGhhc1B0clxyXG4gICAgICAgIG8ucG9pbnRlciA9IHB0clxyXG5cclxuICAgICAgaWYge30uaGFzT3duUHJvcGVydHkuY2FsbChvdmVycmlkZSwgJ29wdGlvbnMnKVxyXG4gICAgICAgIG8ub3B0aW9ucyA9IG1lcmdlT3B0aW9ucyhvdmVycmlkZS5vcHRpb25zKVxyXG4gICAgICBlbHNlIGlmIGhhc09ialxyXG4gICAgICAgIG8ub3B0aW9ucyA9IG9wdFxyXG5cclxuICAgICAgcmV0dXJuIEpzb25Qb2ludGVyLnNtYXJ0QmluZChvKVxyXG5cclxuICAgICMgY29weSB0aGUgcmVtYWluaW5nIG1ldGhvZHMgd2hpY2ggZG8gbm90IG5lZWQgYmluZGluZ1xyXG4gICAgZm9yIG93biBrZXksIHZhbCBvZiBKc29uUG9pbnRlclxyXG4gICAgICBpZiBub3Qge30uaGFzT3duUHJvcGVydHkuY2FsbChhcGksIGtleSlcclxuICAgICAgICBhcGlba2V5XSA9IHZhbFxyXG5cclxuICAgICMgZmluYWwgcmVzdWx0XHJcbiAgICByZXR1cm4gYXBpXHJcblxyXG4gICMjI1xyXG4gICMgRXNjYXBlcyB0aGUgZ2l2ZW4gcGF0aCBzZWdtZW50IGFzIGRlc2NyaWJlZCBieSBSRkM2OTAxLlxyXG4gICNcclxuICAjIE5vdGFibHksIGAnfidgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCd+MCdgIGFuZCBgJy8nYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfjEnYC5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc2VnbWVudFxyXG4gICMgQHJldHVybnMge3N0cmluZ31cclxuICAjIyNcclxuICBAZXNjYXBlOiAoc2VnbWVudCkgLT5cclxuICAgIHNlZ21lbnQucmVwbGFjZSgvfi9nLCAnfjAnKS5yZXBsYWNlKC9cXC8vZywgJ34xJylcclxuXHJcbiAgIyMjXHJcbiAgIyBVbi1Fc2NhcGVzIHRoZSBnaXZlbiBwYXRoIHNlZ21lbnQsIHJldmVyc2luZyB0aGUgYWN0aW9ucyBvZiBgLmVzY2FwZWAuXHJcbiAgI1xyXG4gICMgTm90YWJseSwgYCd+MSdgJ3MgYXJlIHJlcGxhY2VkIHdpdGggYCcvJ2AgYW5kIGAnfjAnYCdzIGFyZSByZXBsYWNlZCB3aXRoIGAnfidgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nfSBzZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEB1bmVzY2FwZTogKHNlZ21lbnQpIC0+XHJcbiAgICBzZWdtZW50LnJlcGxhY2UoL34xL2csICcvJykucmVwbGFjZSgvfjAvZywgJ34nKVxyXG5cclxuICAjIyNcclxuICAjIFBhcnNlcyBhIGpzb24tcG9pbnRlciwgYXMgZGVzcmliZWQgYnkgUkZDOTAxLCBpbnRvIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMuXHJcbiAgI1xyXG4gICMgQHRocm93cyB7SnNvblBvaW50ZXJFcnJvcn0gZm9yIGludmFsaWQganNvbi1wb2ludGVycy5cclxuICAjXHJcbiAgIyBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nW119XHJcbiAgIyMjXHJcbiAgQHBhcnNlOiAoc3RyKSAtPlxyXG4gICAgaWYgc3RyID09ICcnXHJcbiAgICAgIHJldHVybiBbXVxyXG5cclxuICAgIGlmIHN0ci5jaGFyQXQoMCkgIT0gJy8nXHJcbiAgICAgIHRocm93IG5ldyBKc29uUG9pbnRlckVycm9yKFwiSW52YWxpZCBKU09OIHBvaW50ZXI6ICN7c3RyfVwiKVxyXG5cclxuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDEpLnNwbGl0KCcvJykubWFwKEpzb25Qb2ludGVyLnVuZXNjYXBlKVxyXG5cclxuICAjIyNcclxuICAjIENvbnZlcnRzIGFuIGFycmF5IG9mIHBhdGggc2VnbWVudHMgaW50byBhIGpzb24gcGF0aC5cclxuICAjIFRoaXMgbWV0aG9kIGlzIHRoZSByZXZlcnNlIG9mIGAucGFyc2VgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcmV0dXJucyB7c3RyaW5nfVxyXG4gICMjI1xyXG4gIEBjb21waWxlOiAoc2VnbWVudHMpIC0+XHJcbiAgICBzZWdtZW50cy5tYXAoKHNlZ21lbnQpIC0+ICcvJyArIEpzb25Qb2ludGVyLmVzY2FwZShzZWdtZW50KSkuam9pbignJylcclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIGRldGVybWluZSBpZiBhbiBvYmplY3QgY29udGFpbnMgYSBnaXZlbiBwcm9wZXJ0eS5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgaGFzUHJvcFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCBhbmQgYG9iamAgaXMgZWl0aGVyIGFuIEFycmF5IG9yIGFuIE9iamVjdC5cclxuICAjIElnbm9yZXMgdGhlIHByb3RvdHlwZSBjaGFpbi5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5oYXNQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAjIyNcclxuICBAaGFzSnNvblByb3A6IChvYmosIGtleSkgLT5cclxuICAgIGlmIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICByZXR1cm4gKHR5cGVvZiBrZXkgPT0gJ251bWJlcicpIGFuZCAoa2V5IDwgb2JqLmxlbmd0aClcclxuICAgIGVsc2UgaWYgdHlwZW9mIG9iaiA9PSAnb2JqZWN0J1xyXG4gICAgICByZXR1cm4ge30uaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgZGlzcmVnYXJkaW5nIHRoZSBwcm90b3R5cGUgY2hhaW4uXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHJldHVybnMge0Jvb2xlYW59XHJcbiAgIyMjXHJcbiAgQGhhc093blByb3A6IChvYmosIGtleSkgLT5cclxuICAgIHt9Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiBgb2JqYCBjb250YWlucyBga2V5YCwgaW5jbHVkaW5nIHZpYSB0aGUgcHJvdG90eXBlIGNoYWluLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICMjI1xyXG4gIEBoYXNQcm9wOiAob2JqLCBrZXkpIC0+XHJcbiAgICBrZXkgb2Ygb2JqXHJcblxyXG4gICMjI1xyXG4gICMgQ2FsbGJhY2sgdXNlZCB0byByZXRyaWV2ZSBhIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0XHJcbiAgI1xyXG4gICMgQGNhbGxiYWNrIGdldFByb3BcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIEZpbmRzIHRoZSBnaXZlbiBga2V5YCBpbiBgb2JqYC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5nZXRQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAZ2V0UHJvcDogKG9iaiwga2V5KSAtPlxyXG4gICAgb2JqW2tleV1cclxuXHJcbiAgIyMjXHJcbiAgIyBDYWxsYmFjayB1c2VkIHRvIHNldCBhIHByb3BlcnR5IG9uIGFuIG9iamVjdC5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgc2V0UHJvcFxyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IGtleVxyXG4gICMgQHBhcmFtIHsqfSB2YWx1ZVxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcblxyXG4gICMjI1xyXG4gICMgU2V0cyB0aGUgZ2l2ZW4gYGtleWAgaW4gYG9iamAgdG8gYHZhbHVlYC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXRQcm9wYC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8aW50ZWdlcn0ga2V5XHJcbiAgIyBAcGFyYW0geyp9IHZhbHVlXHJcbiAgIyBAcmV0dXJucyB7Kn0gYHZhbHVlYFxyXG4gICMjI1xyXG4gIEBzZXRQcm9wOiAob2JqLCBrZXksIHZhbHVlKSAtPlxyXG4gICAgb2JqW2tleV0gPSB2YWx1ZVxyXG5cclxuICAjIyNcclxuICAjIENhbGxiYWNrIHVzZWQgdG8gbW9kaWZ5IGJlaGF2aW91ciB3aGVuIGEgZ2l2ZW4gcGF0aCBzZWdtZW50IGNhbm5vdCBiZSBmb3VuZC5cclxuICAjXHJcbiAgIyBAY2FsbGJhY2sgbm90Rm91bmRcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBrZXlcclxuICAjIEByZXR1cm5zIHsqfVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICAjIFJldHVybnMgdGhlIHZhbHVlIHRvIHVzZSB3aGVuIGAuZ2V0YCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZ2V0Tm90Rm91bmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBnZXROb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgdW5kZWZpbmVkXHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0aGUgdmFsdWUgdG8gdXNlIHdoZW4gYC5zZXRgIGZhaWxzIHRvIGxvY2F0ZSBhIHBvaW50ZXIgc2VnbWVudC5cclxuICAjXHJcbiAgIyBEZWZhdWx0IHZhbHVlIGZvciBgb3B0aW9ucy5zZXROb3RGb3VuZGAuXHJcbiAgI1xyXG4gICMgQHBhcmFtIHsqfSBvYmpcclxuICAjIEBwYXJhbSB7c3RyaW5nfGludGVnZXJ9IHNlZ21lbnRcclxuICAjIEBwYXJhbSB7Kn0gcm9vdFxyXG4gICMgQHBhcmFtIHtzdHJpbmdbXX0gc2VnbWVudHNcclxuICAjIEBwYXJhbSB7aW50ZWdlcn0gaVNlZ21lbnRcclxuICAjIEByZXR1cm5zIHt1bmRlZmluZWR9XHJcbiAgIyMjXHJcbiAgQHNldE5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICBpZiBzZWdtZW50c1tpU2VnbWVudCArIDFdLm1hdGNoKC9eKD86MHxbMS05XVxcZCp8LSkkLylcclxuICAgICAgcmV0dXJuIG9ialtzZWdtZW50XSA9IFtdXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldHVybiBvYmpbc2VnbWVudF0gPSB7fVxyXG5cclxuICAjIyNcclxuICAjIFBlcmZvcm1zIGFuIGFjdGlvbiB3aGVuIGAuZGVsYCBmYWlscyB0byBsb2NhdGUgYSBwb2ludGVyIHNlZ21lbnQuXHJcbiAgI1xyXG4gICMgRGVmYXVsdCB2YWx1ZSBmb3IgYG9wdGlvbnMuZGVsTm90Rm91bmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBkZWxOb3RGb3VuZDogKG9iaiwgc2VnbWVudCwgcm9vdCwgc2VnbWVudHMsIGlTZWdtZW50KSAtPlxyXG4gICAgdW5kZWZpbmVkXHJcblxyXG4gICMjI1xyXG4gICMgUmFpc2VzIGEgSnNvblBvaW50ZXJFcnJvciB3aGVuIHRoZSBnaXZlbiBwb2ludGVyIHNlZ21lbnQgaXMgbm90IGZvdW5kLlxyXG4gICNcclxuICAjIE1heSBiZSB1c2VkIGluIHBsYWNlIG9mIHRoZSBhYm92ZSBtZXRob2RzIHZpYSB0aGUgYG9wdGlvbnNgIGFyZ3VtZW50IG9mIGAuLy5nZXQvLnNldC8uaGFzLy5kZWwvLnNpbXBsZUJpbmRgLlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xpbnRlZ2VyfSBzZWdtZW50XHJcbiAgIyBAcGFyYW0geyp9IHJvb3RcclxuICAjIEBwYXJhbSB7c3RyaW5nW119IHNlZ21lbnRzXHJcbiAgIyBAcGFyYW0ge2ludGVnZXJ9IGlTZWdtZW50XHJcbiAgIyBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICMjI1xyXG4gIEBlcnJvck5vdEZvdW5kOiAob2JqLCBzZWdtZW50LCByb290LCBzZWdtZW50cywgaVNlZ21lbnQpIC0+XHJcbiAgICB0aHJvdyBuZXcgSnNvblBvaW50ZXJFcnJvcihcIlVuYWJsZSB0byBmaW5kIGpzb24gcGF0aDogI3tKc29uUG9pbnRlci5jb21waWxlKHNlZ21lbnRzLnNsaWNlKDAsIGlTZWdtZW50KzEpKX1cIilcclxuXHJcbiAgIyMjXHJcbiAgIyBTZXRzIHRoZSBsb2NhdGlvbiBpbiBgb2JqZWN0YCwgc3BlY2lmaWVkIGJ5IGBwb2ludGVyYCwgdG8gYHZhbHVlYC5cclxuICAjIElmIGBwb2ludGVyYCByZWZlcnMgdG8gdGhlIHdob2xlIGRvY3VtZW50LCBgdmFsdWVgIGlzIHJldHVybmVkIHdpdGhvdXQgbW9kaWZ5aW5nIGBvYmplY3RgLFxyXG4gICMgb3RoZXJ3aXNlLCBgb2JqZWN0YCBtb2RpZmllZCBhbmQgcmV0dXJuZWQuXHJcbiAgI1xyXG4gICMgQnkgZGVmYXVsdCwgaWYgYW55IGxvY2F0aW9uIHNwZWNpZmllZCBieSBgcG9pbnRlcmAgZG9lcyBub3QgZXhpc3QsIHRoZSBsb2NhdGlvbiBpcyBjcmVhdGVkIHVzaW5nIG9iamVjdHMgYW5kIGFycmF5cy5cclxuICAjIEFycmF5cyBhcmUgdXNlZCBvbmx5IHdoZW4gdGhlIGltbWVkaWF0ZWx5IGZvbGxvd2luZyBwYXRoIHNlZ21lbnQgaXMgYW4gYXJyYXkgZWxlbWVudCBhcyBkZWZpbmVkIGJ5IHRoZSBzdGFuZGFyZC5cclxuICAjXHJcbiAgIyBAcGFyYW0geyp9IG9ialxyXG4gICMgQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IHBvaW50ZXJcclxuICAjIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgIyBAcGFyYW0ge2hhc1Byb3B9IG9wdGlvbnMuaGFzUHJvcFxyXG4gICMgQHBhcmFtIHtnZXRQcm9wfSBvcHRpb25zLmdldFByb3BcclxuICAjIEBwYXJhbSB7c2V0UHJvcH0gb3B0aW9ucy5zZXRQcm9wXHJcbiAgIyBAcGFyYW0ge25vdEZvdW5kfSBvcHRpb25zLmdldE5vdEZvdW5kXHJcbiAgIyBAcmV0dXJucyB7Kn1cclxuICAjIyNcclxuICBAc2V0OiAob2JqLCBwb2ludGVyLCB2YWx1ZSwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuIHZhbHVlXHJcblxyXG4gICAgaGFzUHJvcCA9IG9wdGlvbnM/Lmhhc1Byb3AgPyBKc29uUG9pbnRlci5oYXNKc29uUHJvcFxyXG4gICAgZ2V0UHJvcCA9IG9wdGlvbnM/LmdldFByb3AgPyBKc29uUG9pbnRlci5nZXRQcm9wXHJcbiAgICBzZXRQcm9wID0gb3B0aW9ucz8uc2V0UHJvcCA/IEpzb25Qb2ludGVyLnNldFByb3BcclxuICAgIHNldE5vdEZvdW5kID0gb3B0aW9ucz8uc2V0Tm90Rm91bmQgPyBKc29uUG9pbnRlci5zZXROb3RGb3VuZFxyXG5cclxuICAgIHJvb3QgPSBvYmpcclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuXHJcbiAgICB3aGlsZSBpU2VnbWVudCAhPSBsZW5cclxuICAgICAgc2VnbWVudCA9IHBvaW50ZXJbaVNlZ21lbnRdXHJcbiAgICAgICsraVNlZ21lbnRcclxuXHJcbiAgICAgIGlmIHNlZ21lbnQgPT0gJy0nIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gb2JqLmxlbmd0aFxyXG4gICAgICBlbHNlIGlmIHNlZ21lbnQubWF0Y2goL14oPzowfFsxLTldXFxkKikkLykgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBwYXJzZUludChzZWdtZW50LCAxMClcclxuXHJcbiAgICAgIGlmIGlTZWdtZW50ID09IGxlblxyXG4gICAgICAgIHNldFByb3Aob2JqLCBzZWdtZW50LCB2YWx1ZSlcclxuICAgICAgICBicmVha1xyXG4gICAgICBlbHNlIGlmIG5vdCBoYXNQcm9wKG9iaiwgc2VnbWVudClcclxuICAgICAgICBvYmogPSBzZXROb3RGb3VuZChvYmosIHNlZ21lbnQsIHJvb3QsIHBvaW50ZXIsIGlTZWdtZW50IC0gMSlcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiByb290XHJcblxyXG4gICMjI1xyXG4gICMgRmluZHMgdGhlIHZhbHVlIGluIGBvYmpgIGFzIHNwZWNpZmllZCBieSBgcG9pbnRlcmBcclxuICAjXHJcbiAgIyBCeSBkZWZhdWx0LCByZXR1cm5zIHVuZGVmaW5lZCBmb3IgdmFsdWVzIHdoaWNoIGNhbm5vdCBiZSBmb3VuZFxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5nZXROb3RGb3VuZFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGdldDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG4gICAgZ2V0Tm90Rm91bmQgPSBvcHRpb25zPy5nZXROb3RGb3VuZCA/IEpzb25Qb2ludGVyLmdldE5vdEZvdW5kXHJcblxyXG4gICAgcm9vdCA9IG9ialxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgcmV0dXJuIGdldE5vdEZvdW5kKG9iaiwgc2VnbWVudCwgcm9vdCwgcG9pbnRlciwgaVNlZ21lbnQgLSAxKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIG9ialxyXG5cclxuICAjIyNcclxuICAjIFJlbW92ZXMgdGhlIGxvY2F0aW9uLCBzcGVjaWZpZWQgYnkgYHBvaW50ZXJgLCBmcm9tIGBvYmplY3RgLlxyXG4gICMgUmV0dXJucyB0aGUgbW9kaWZpZWQgYG9iamVjdGAsIG9yIHVuZGVmaW5lZCBpZiB0aGUgYHBvaW50ZXJgIGlzIGVtcHR5LlxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHBhcmFtIHtub3RGb3VuZH0gb3B0aW9ucy5kZWxOb3RGb3VuZFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGRlbDogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGlmIHBvaW50ZXIubGVuZ3RoID09IDBcclxuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG4gICAgZGVsTm90Rm91bmQgPSBvcHRpb25zPy5kZWxOb3RGb3VuZCA/IEpzb25Qb2ludGVyLmRlbE5vdEZvdW5kXHJcblxyXG4gICAgcm9vdCA9IG9ialxyXG4gICAgaVNlZ21lbnQgPSAwXHJcbiAgICBsZW4gPSBwb2ludGVyLmxlbmd0aFxyXG4gICAgd2hpbGUgaVNlZ21lbnQgIT0gbGVuXHJcbiAgICAgIHNlZ21lbnQgPSBwb2ludGVyW2lTZWdtZW50XVxyXG4gICAgICArK2lTZWdtZW50XHJcblxyXG4gICAgICBpZiBzZWdtZW50ID09ICctJyBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IG9iai5sZW5ndGhcclxuICAgICAgZWxzZSBpZiBzZWdtZW50Lm1hdGNoKC9eKD86MHxbMS05XVxcZCopJC8pIGFuZCBBcnJheS5pc0FycmF5KG9iailcclxuICAgICAgICBzZWdtZW50ID0gcGFyc2VJbnQoc2VnbWVudCwgMTApXHJcblxyXG4gICAgICBpZiBub3QgaGFzUHJvcChvYmosIHNlZ21lbnQpXHJcbiAgICAgICAgZGVsTm90Rm91bmQob2JqLCBzZWdtZW50LCByb290LCBwb2ludGVyLCBpU2VnbWVudCAtIDEpXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZWxzZSBpZiBpU2VnbWVudCA9PSBsZW5cclxuICAgICAgICBkZWxldGUgb2JqW3NlZ21lbnRdXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG9iaiA9IGdldFByb3Aob2JqLCBzZWdtZW50KVxyXG5cclxuICAgIHJldHVybiByb290XHJcblxyXG4gICMjI1xyXG4gICMgUmV0dXJucyB0cnVlIGlmZiB0aGUgbG9jYXRpb24sIHNwZWNpZmllZCBieSBgcG9pbnRlcmAsIGV4aXN0cyBpbiBgb2JqZWN0YFxyXG4gICNcclxuICAjIEBwYXJhbSB7Kn0gb2JqXHJcbiAgIyBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gcG9pbnRlclxyXG4gICMgQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcclxuICAjIEBwYXJhbSB7aGFzUHJvcH0gb3B0aW9ucy5oYXNQcm9wXHJcbiAgIyBAcGFyYW0ge2dldFByb3B9IG9wdGlvbnMuZ2V0UHJvcFxyXG4gICMgQHJldHVybnMgeyp9XHJcbiAgIyMjXHJcbiAgQGhhczogKG9iaiwgcG9pbnRlciwgb3B0aW9ucykgLT5cclxuICAgIGlmIHR5cGVvZiBwb2ludGVyID09ICdzdHJpbmcnXHJcbiAgICAgIHBvaW50ZXIgPSBKc29uUG9pbnRlci5wYXJzZShwb2ludGVyKVxyXG5cclxuICAgIGhhc1Byb3AgPSBvcHRpb25zPy5oYXNQcm9wID8gSnNvblBvaW50ZXIuaGFzSnNvblByb3BcclxuICAgIGdldFByb3AgPSBvcHRpb25zPy5nZXRQcm9wID8gSnNvblBvaW50ZXIuZ2V0UHJvcFxyXG5cclxuICAgIGlTZWdtZW50ID0gMFxyXG4gICAgbGVuID0gcG9pbnRlci5sZW5ndGhcclxuICAgIHdoaWxlIGlTZWdtZW50ICE9IGxlblxyXG4gICAgICBzZWdtZW50ID0gcG9pbnRlcltpU2VnbWVudF1cclxuICAgICAgKytpU2VnbWVudFxyXG5cclxuICAgICAgaWYgc2VnbWVudCA9PSAnLScgYW5kIEFycmF5LmlzQXJyYXkob2JqKVxyXG4gICAgICAgIHNlZ21lbnQgPSBvYmoubGVuZ3RoXHJcbiAgICAgIGVsc2UgaWYgc2VnbWVudC5tYXRjaCgvXig/OjB8WzEtOV1cXGQqKSQvKSBhbmQgQXJyYXkuaXNBcnJheShvYmopXHJcbiAgICAgICAgc2VnbWVudCA9IHBhcnNlSW50KHNlZ21lbnQsIDEwKVxyXG5cclxuICAgICAgaWYgbm90IGhhc1Byb3Aob2JqLCBzZWdtZW50KVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgb2JqID0gZ2V0UHJvcChvYmosIHNlZ21lbnQpXHJcblxyXG4gICAgcmV0dXJuIHRydWVcclxuIl19