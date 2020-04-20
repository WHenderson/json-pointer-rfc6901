import {JsonPointerError} from "./json-pointer-error";
import {JsonValue} from "./json";
import compile = WebAssembly.compile;

export type HasProp = (obj: JsonValue, key: string | number) => boolean;
export type GetProp = (obj: JsonValue, key: string | number) => JsonValue;
export type DelProp = (obj: JsonValue, key: string | number) => void;
export type SetProp = (obj: JsonValue, key: string | number, val: JsonValue) => JsonValue;
export type SetNotFound = (obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) => JsonValue;
export type GetNotFound = (obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) => JsonValue;
export type DelNotFound = (obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) => JsonValue;
export type SetRoot = (root: JsonValue, val: JsonValue) => JsonValue;
export type DelRoot = (root: JsonValue) => JsonValue;

export function escapeSegment(segment: string | number) : string {
    if (typeof segment === 'number')
        return `${segment}`;
    return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}

export function unescapeSegment(segment: string) : string {
    return segment.replace(/~1/g, "/").replace(/~0/g, "~");
}

export function escapeFragment(segment: string | number) : string {
    if (typeof segment === 'number')
        return `${segment}`;

    return encodeURIComponent(escapeSegment(segment));
}

export function unescapeFragment(segment: string) : string {
    return unescapeSegment(decodeURIComponent(segment));
}

export function isPointer(path: string) : boolean {
    return /^(?:\/|$)/.test(path);
}

export function isFragment(path: string) : boolean {
    return /^#(?:\/|$)/.test(path);
}

export function parsePointer(path: string) : string[] {
    if (path === '')
        return [];
    if (path.startsWith('/'))
        return path.substring(1).split('/').map(unescapeSegment);

    throw new JsonPointerError(`Invalid JSON pointer: ${path}`);
}

export function parseFragment(path: string) : string[] {
    if (path === '#')
        return [];
    if (path.startsWith('#/'))
        return path.substring(2).split('/').map(unescapeFragment);

    throw new JsonPointerError(`Invalid JSON fragment pointer: ${path}`);
}

export function parse(path: string) : string[] {
    if (/^#/.test(path))
        return parseFragment(path);
    else
        return parsePointer(path);
}

export function compilePointer(segments: (string | number)[]) : string {
    return segments.map(segment => `/${escapeSegment(segment)}`).join('');
}

export function compileFragment(segments: (string | number)[]) : string {
    return '#' + segments.map(segment => `/${escapeFragment(segment)}`).join('');
}

export function hasChildProp(obj: JsonValue, key: string | number) : boolean {
    if (Array.isArray(obj)) {
        if (!/^(?:0|[1-9][0-9]*)$/.test(`${key}`))
            return false;
        if (typeof key === 'number')
            return key < obj.length;
        return parseInt(key, 10) < obj.length;
    }

    return obj !== null && typeof obj === 'object' && {}.hasOwnProperty.call(obj, key);
}

export function hasOwnProp(obj: JsonValue, key: string | number) : boolean {
    return obj !== null && obj !== undefined && {}.hasOwnProperty.call(obj, key);
}

export function hasProp(obj: JsonValue, key: string | number) : boolean {
    return obj !== null && typeof obj === 'object' && key in obj;
}

export function getProp(obj: JsonValue, key: string | number) : JsonValue {
    return obj[key];
}

export function setProp(obj: JsonValue, key: string | number, val: JsonValue) : JsonValue {
    return obj[key] = val;
}

export function delProp(obj: JsonValue, key: string | number) : void {
    if (Array.isArray(obj) && /^(?:0|[1-9][0-9]*)$/.test(`${key}`)) {
        obj.splice(parseInt(key, 10), 1);
    }
    else {
        delete obj[key];
    }
}

export function getNotFound(obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) : JsonValue {
    return undefined;
}
export function setNotFound(obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) : JsonValue {
    if (iSegment + 1 < segments.length && `${segments[iSegment + 1]}`.match(/^(?:0|[1-9][0-9]*|-)$/)) {
        return obj[segment] = [];
    } else {
        return obj[segment] = {};
    }
}
export function delNotFound(obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) : JsonValue {
    return root;
}
export function errorNotFound(obj: JsonValue, segment: string | number, root: JsonValue, segments: (string | number)[], iSegment: number) : void {
    throw new JsonPointerError("Unable to find json path: " + (compilePointer(segments.slice(0, iSegment + 1))));
}

export function setRoot(root: JsonValue, val: JsonValue) : JsonValue {
    return val;
}

export function delRoot(root: JsonValue) : JsonValue {
    return undefined;
}

export interface GetOptions {
    hasProp?: HasProp;
    getProp?: GetProp;
    getNotFound?: GetNotFound;
}

export function get(obj: JsonValue, pointer: string | (string | number)[], options?: GetOptions) {
    const segments = typeof pointer === 'string' ? parse(pointer) : pointer;

    const _hasProp = (options && options.hasProp) || hasChildProp;
    const _getProp = (options && options.getProp) || getProp;
    const _getNotFound = (options && options.getNotFound) || getNotFound;

    const root = obj;
    let iSegment = 0;
    const len = segments.length;
    while (iSegment !== len) {
        let segment : string = `${segments[iSegment]}`;
        ++iSegment;

        if (obj !== null && Array.isArray(obj) && segment === '-')
            segment = `${obj.length}`;

        if (!_hasProp(obj, segment))
            return _getNotFound(obj, segment, root, segments, iSegment - 1);
        else
            obj = _getProp(obj, segment);
    }

    return obj;
}

export interface DelOptions {
    hasProp?: HasProp;
    getProp?: GetProp;
    delProp?: DelProp;
    delNotFound?: DelNotFound;
    delRoot?: DelRoot;
}

export function del(obj: JsonValue, pointer: string | (string | number)[], options?: DelOptions) : JsonValue {
    const segments = typeof pointer === 'string' ?  parse(pointer) : pointer;

    const _hasProp = (options && options.hasProp) || hasChildProp;
    const _getProp = (options && options.getProp) || getProp;
    const _delProp = (options && options.delProp) || delProp;
    const _delNotFound = (options && options.delNotFound) || delNotFound;
    const _delRoot = (options && options.delRoot) || delRoot;

    if (segments.length === 0)
        return _delRoot(obj);

    const root = obj;
    let iSegment = 0;
    const len = segments.length;
    while (iSegment !== len) {
        let segment : string = `${segments[iSegment]}`;
        ++iSegment;

        if (obj !== null && Array.isArray(obj) && segment === '-')
            segment = obj.length.toString();

        if (!_hasProp(obj, segment)) {
            return _delNotFound(obj, segment, root, segments, iSegment - 1);
        }
        else if (iSegment === len) {
            _delProp(obj, segment);
            return root;
        }
        else {
            obj = _getProp(obj, segment);
        }
    }

    return root;
}

export interface SetOptions {
    hasProp?: HasProp;
    getProp?: GetProp;
    setProp?: SetProp;
    setNotFound?: SetNotFound;
    setRoot?: SetRoot;
}

export function set(obj: JsonValue, pointer: string | (string | number)[], val: JsonValue, options?: SetOptions) : JsonValue {
    const segments = typeof pointer === 'string' ?  parse(pointer) : pointer;

    const _hasProp = (options && options.hasProp) || hasChildProp;
    const _getProp = (options && options.getProp) || getProp;
    const _setProp = (options && options.setProp) || setProp;
    const _setNotFound = (options && options.setNotFound) || setNotFound;
    const _setRoot = (options && options.setRoot) || setRoot;

    if (segments.length === 0)
        return _setRoot(obj, val);

    const root = obj;
    let iSegment = 0;
    const len = segments.length;
    while (iSegment !== len) {
        let segment : string = `${segments[iSegment]}`;
        ++iSegment;

        if (obj !== null && Array.isArray(obj) && segment === '-')
            segment = obj.length.toString();

        if (iSegment === len) {
            _setProp(obj, segment, val);
            return root;
        }
        else if (!_hasProp(obj, segment)) {
            obj = _setNotFound(obj, segment, root, segments, iSegment - 1);
        }
        else {
            obj = _getProp(obj, segment);
        }
    }

    return root;
}

export interface HasOptions {
    hasProp?: HasProp;
    getProp?: GetProp;
}

export function has(obj: JsonValue, pointer: string | (string | number)[], options?: HasOptions) {
    const segments = typeof pointer === 'string' ?  parse(pointer) : pointer;

    const _hasProp = (options && options.hasProp) || hasChildProp;
    const _getProp = (options && options.getProp) || getProp;

    let iSegment = 0;
    const len = segments.length;
    while (iSegment !== len) {
        let segment : string = `${segments[iSegment]}`;
        ++iSegment;

        if (obj !== null && Array.isArray(obj) && segment === '-')
            segment = obj.length.toString();

        if (!_hasProp(obj, segment))
            return false;
        else
            obj = _getProp(obj, segment);
    }

    return true;
}

export interface ApiBoundOptions {
    // set
    (object: JsonValue, pointer: string | (string | number)[], value: JsonValue) : JsonValue;
    // get
    (object: JsonValue, pointer: string | (string | number)[]) : JsonValue;
    // bindObject
    (object: JsonValue) : ApiBoundObject;

    get: (object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) => JsonValue;
    set: (object: JsonValue, pointer: string | (string | number)[], val: JsonValue, options: SetOptions) => JsonValue;
    del: (object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) => JsonValue;
    has: (object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) => boolean;

    object: {
        () : JsonValue;
        (object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject;
    }

    pointer: {
        (): string;
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>): ApiBoundPointer;
    }

    segments: {
        () : (string | number)[];
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
    }

    options: {
        () : Partial<AllOptions>;
        (options?: Partial<AllOptions>) : ApiBoundOptions;
    }

    smartBind: {
        (bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObject;
        (bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundPointer;
        (bind: { options?: Partial<AllOptions> }) : ApiBoundOptions;
        () : ApiBoundOptions;
    }
}

export interface ApiBoundObject {
    // set
    (pointer: string | (string | number)[], value: JsonValue) : JsonValue;
    // get
    (pointer: string | (string | number)[]) : JsonValue;

    get: (pointer: string | string[], options?: GetOptions) => JsonValue;
    set: (pointer: string | string[], val: JsonValue, options: SetOptions) => JsonValue;
    del: (pointer: string | string[], options?: GetOptions) => JsonValue;
    has: (pointer: string | string[], options?: GetOptions) => boolean;

    object: {
        () : JsonValue;
        (object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject;
    }

    pointer: {
        () : string;
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    segments: {
        () : (string | number)[];
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    options: {
        () : Partial<AllOptions>;
        (options?: Partial<AllOptions>) : ApiBoundObject;
    }

    smartBind: {
        (bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObject;
        (bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { options?: Partial<AllOptions> }) : ApiBoundObject;
        () : ApiBoundObject;
    }
}

export interface ApiBoundPointer {
    // set
    (object: JsonValue, value: JsonValue) : JsonValue;
    // get
    (object: JsonValue) : JsonValue;

    get: (object: JsonValue, options?: GetOptions) => JsonValue;
    set: (object: JsonValue, val: JsonValue, options: SetOptions) => JsonValue;
    del: (object: JsonValue, options?: GetOptions) => JsonValue;
    has: (object: JsonValue, options?: GetOptions) => boolean;

    object: {
        () : JsonValue;
        (object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    pointer: {
        () : string;
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
    }

    segments: {
        () : (string | number)[];
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
    }

    options: {
        () : Partial<AllOptions>;
        (options?: Partial<AllOptions>) : ApiBoundPointer;
    }

    smartBind: {
        (bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundPointer;
        (bind: { options?: Partial<AllOptions> }) : ApiBoundPointer;
        () : ApiBoundPointer;
    }
}

export interface ApiBoundObjectPointer {
    // set
    (value: JsonValue) : JsonValue;
    // get
    () : JsonValue;

    get: (options?: GetOptions) => JsonValue;
    set: (val: JsonValue, options: SetOptions) => JsonValue;
    del: (options?: GetOptions) => JsonValue;
    has: (options?: GetOptions) => boolean;

    object: {
        () : JsonValue,
        (object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer
    }

    pointer: {
        () : string;
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    segments: {
        () : (string | number)[];
        (pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    options: {
        () : Partial<AllOptions>;
        (options?: Partial<AllOptions>) : ApiBoundObjectPointer;
    }

    smartBind: {
        (bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        (bind: { options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        () : ApiBoundObjectPointer;
    }
}

export type AllOptions = GetOptions & SetOptions & DelOptions & HasOptions;

export function smartBind(bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
export function smartBind(bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObject;
export function smartBind(bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundPointer;
export function smartBind(bind: { options?: Partial<AllOptions> }) : ApiBoundOptions;
export function smartBind() : ApiBoundOptions;

export function smartBind(bind?: { object?: JsonValue, pointer?: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundOptions | ApiBoundObject | ApiBoundPointer | ApiBoundObjectPointer {
    bind = bind || {};
    let boundObject = bind.object;
    let boundSegments = bind.pointer ? (typeof bind.pointer === 'string' ? parse(bind.pointer) : bind.pointer) : undefined;
    let boundOptions = bind.options || {};


    if ('object' in bind && 'pointer' in bind) {
        function _smartBind(bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind() : ApiBoundObjectPointer;
        function _smartBind(bind?: { object?: JsonValue, pointer?: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer {
            return smartBind(Object.assign({}, { object: boundObject, pointer: boundSegments, options: boundOptions }, bind));
        }

        function object() : JsonValue;
        function object(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function object(object?: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer | JsonValue {
            if (arguments.length === 0)
                return boundObject;
            return smartBind({ object, pointer: boundSegments, options: Object.assign({}, boundOptions, options)});
        }

        function pointer() : string;
        function pointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function pointer(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer | string {
            if (arguments.length === 0)
                return compilePointer(boundSegments);
            return smartBind({ object: boundObject, pointer, options: Object.assign({}, boundOptions, options)});
        }

        function segments() : (string | number)[];
        function segments(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function segments(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer | (string | number)[] {
            if (arguments.length === 0)
                return boundSegments;
            return smartBind({ object: boundObject, pointer, options: Object.assign({}, boundOptions, options)});
        }

        function options() : Partial<AllOptions>;
        function options(options: Partial<AllOptions>) : ApiBoundObjectPointer;
        function options(options?: Partial<AllOptions>) : ApiBoundObjectPointer | Partial<AllOptions> {
            if (arguments.length === 0)
                return boundOptions;
            return smartBind({ object: boundObject, pointer: boundSegments, options: Object.assign({}, boundOptions, options)});
        }

        const api : ApiBoundObjectPointer = Object.assign(
            function (value?: JsonValue) {
                switch (arguments.length) {
                    case 1: return (boundObject = set(boundObject, boundSegments, value, boundOptions));
                    case 0: return get(boundObject, boundSegments, boundOptions);
                }
            },
            {
                get(options?: GetOptions) : JsonValue {
                    return get(boundObject, boundSegments, Object.assign({}, boundOptions, options));
                },
                set(val: JsonValue, options: SetOptions) : JsonValue {
                    return (boundObject = set(boundObject, boundSegments, val, Object.assign({}, boundOptions, options)));
                },
                del(options?: GetOptions) : JsonValue {
                    return (boundObject = del(boundObject, boundSegments, Object.assign({}, boundOptions, options)));
                },
                has(options?: GetOptions) : boolean {
                    return has(boundObject, boundSegments, Object.assign({}, boundOptions, options));
                },
                object,
                pointer,
                segments,
                options,
                smartBind: _smartBind
            }
        );
        return api;
    }
    else if ('object' in bind) {
        function _smartBind(bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObject;
        function _smartBind(bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { options?: Partial<AllOptions> }) : ApiBoundObject;
        function _smartBind() : ApiBoundObject;
        function _smartBind(bind?: { object?: JsonValue, pointer?: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer | ApiBoundObject {
            return smartBind(Object.assign({}, { object: boundObject, options: boundOptions }, bind));
        }

        function object() : JsonValue;
        function object(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject;
        function object(object?: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject | JsonValue {
            if (arguments.length === 0)
                return boundObject;
            return smartBind({ object, options: Object.assign({}, boundOptions, options)});
        }

        function pointer() : string;
        function pointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function pointer(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer | string {
            if (arguments.length === 0)
                return compilePointer(boundSegments);
            return smartBind({ object: boundObject, pointer, options: Object.assign({}, boundOptions, options)});
        }

        function segments() : (string | number)[];
        function segments(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function segments(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer | (string | number)[] {
            if (arguments.length === 0)
                return boundSegments;
            return smartBind({ object: boundObject, pointer, options: Object.assign({}, boundOptions, options)});
        }

        function options() : Partial<AllOptions>;
        function options(options: Partial<AllOptions>) : ApiBoundObject;
        function options(options?: Partial<AllOptions>) : ApiBoundObject | Partial<AllOptions> {
            if (arguments.length === 0)
                return boundOptions;
            return smartBind({ object: boundObject, options: Object.assign({}, boundOptions, options)});
        }

        const api : ApiBoundObject =  Object.assign(
            function (pointer: string | (string | number)[], value?: JsonValue) {
                switch (arguments.length) {
                    case 2: return (boundObject = set(boundObject, pointer, value, boundOptions));
                    case 1: return get(boundObject, pointer, boundOptions);
                }
            },
            {
                get(pointer: string | (string | number)[], options?: GetOptions) : JsonValue {
                    return get(boundObject, pointer, Object.assign({}, boundOptions, options));
                },
                set(pointer: string | (string | number)[], val: JsonValue, options: SetOptions) : JsonValue {
                    return (boundObject = set(boundObject, pointer, val, Object.assign({}, boundOptions, options)));
                },
                del(pointer: string | (string | number)[], options?: GetOptions) : JsonValue {
                    return (boundObject = del(boundObject, pointer, Object.assign({}, boundOptions, options)));
                },
                has(pointer: string | (string | number)[], options?: GetOptions) : boolean {
                    return has(boundObject, pointer, Object.assign({}, boundOptions, options));
                },

                object,
                pointer,
                segments,
                options,
                smartBind: _smartBind
            }
        );

        return api;
    }
    else if ('pointer' in bind) {
        function _smartBind(bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundPointer;
        function _smartBind(bind: { options?: Partial<AllOptions> }) : ApiBoundPointer;
        function _smartBind() : ApiBoundPointer;
        function _smartBind(bind?: { object?: JsonValue, pointer?: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer | ApiBoundPointer {
            return smartBind(Object.assign({}, { pointer: boundSegments, options: boundOptions }, bind));
        }

        function object() : JsonValue;
        function object(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer;
        function object(object?: JsonValue, options?: Partial<AllOptions>) : ApiBoundObjectPointer | JsonValue {
            if (arguments.length === 0)
                return boundObject;
            return smartBind({ object, pointer: boundSegments, options: Object.assign({}, boundOptions, options)});
        }

        function pointer() : string;
        function pointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
        function pointer(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | string {
            if (arguments.length === 0)
                return compilePointer(boundSegments);
            return smartBind({ pointer, options: Object.assign({}, boundOptions, options)});
        }

        function segments() : (string | number)[];
        function segments(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
        function segments(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | (string | number)[] {
            if (arguments.length === 0)
                return boundSegments;
            return smartBind({ pointer, options: Object.assign({}, boundOptions, options)});
        }

        function options() : Partial<AllOptions>;
        function options(options: Partial<AllOptions>) : ApiBoundPointer;
        function options(options?: Partial<AllOptions>) : ApiBoundPointer | Partial<AllOptions> {
            if (arguments.length === 0)
                return boundOptions;
            return smartBind({ pointer: boundSegments, options: Object.assign({}, boundOptions, options)});
        }

        const api : ApiBoundPointer =  Object.assign(
            function (object: JsonValue, value?: JsonValue) {
                switch (arguments.length) {
                    case 2: return (object = set(object, boundSegments, value, boundOptions));
                    case 1: return get(object, boundSegments, boundOptions);
                }
            },
            {
                get(object: JsonValue, options?: GetOptions) : JsonValue {
                    return get(object, boundSegments, Object.assign({}, boundOptions, options));
                },
                set(object: JsonValue, val: JsonValue, options: SetOptions) : JsonValue {
                    return (object = set(object, boundSegments, val, Object.assign({}, boundOptions, options)));
                },
                del(object: JsonValue, options?: GetOptions) : JsonValue {
                    return (object = del(object, boundSegments, Object.assign({}, boundOptions, options)));
                },
                has(object: JsonValue, options?: GetOptions) : boolean {
                    return has(object, boundSegments, Object.assign({}, boundOptions, options));
                },

                object,
                pointer,
                segments,
                options,
                smartBind: _smartBind
            }
        );

        return api;
    }
    else {
        function _smartBind(bind: { object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer;
        function _smartBind(bind: { object: JsonValue, options?: Partial<AllOptions> }) : ApiBoundObject;
        function _smartBind(bind: { pointer: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundPointer;
        function _smartBind(bind: { options?: Partial<AllOptions> }) : ApiBoundOptions;
        function _smartBind() : ApiBoundOptions;
        function _smartBind(bind?: { object?: JsonValue, pointer?: string | (string | number)[], options?: Partial<AllOptions> }) : ApiBoundObjectPointer | ApiBoundObject | ApiBoundPointer | ApiBoundOptions {
            return smartBind(Object.assign({}, { options: boundOptions }, bind));
        }

        function object() : JsonValue;
        function object(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject;
        function object(object?: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject | JsonValue {
            if (arguments.length === 0)
                return boundObject;
            return smartBind({ object, options: Object.assign({}, boundOptions, options)});
        }

        function pointer() : string;
        function pointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
        function pointer(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | string {
            if (arguments.length === 0)
                return compilePointer(boundSegments);
            return smartBind({ pointer, options: Object.assign({}, boundOptions, options)});
        }

        function segments() : (string | number)[];
        function segments(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
        function segments(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | (string | number)[] {
            if (arguments.length === 0)
                return boundSegments;
            return smartBind({ pointer, options: Object.assign({}, boundOptions, options)});
        }

        function options() : Partial<AllOptions>;
        function options(options: Partial<AllOptions>) : ApiBoundOptions;
        function options(options?: Partial<AllOptions>) : ApiBoundOptions | Partial<AllOptions> {
            if (arguments.length === 0)
                return boundOptions;
            return smartBind({ options: Object.assign({}, boundOptions, options)});
        }

        function api(object: JsonValue) : ApiBoundObject;
        function api(object: JsonValue, pointer: string | (string | number)[]) : JsonValue;
        function api(object: JsonValue, pointer: string | (string | number)[], value: JsonValue) : JsonValue;
        function api(object: JsonValue, pointer?: string | (string | number)[], value?: JsonValue) : JsonValue | ApiBoundObject {
            switch (arguments.length) {
                case 3: return (object = set(object, pointer, value, boundOptions));
                case 2: return get(object, pointer, boundOptions);
                case 1: return smartBind({ object, options: boundOptions });
            }
        }

        const _api : ApiBoundOptions =  Object.assign(
            api,
            {
                get(object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) : JsonValue {
                    return get(object, pointer, Object.assign({}, boundOptions, options));
                },
                set(object: JsonValue, pointer: string | (string | number)[], val: JsonValue, options: SetOptions) : JsonValue {
                    return (object = set(object, pointer, val, Object.assign({}, boundOptions, options)));
                },
                del(object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) : JsonValue {
                    return (object = del(object, pointer, Object.assign({}, boundOptions, options)));
                },
                has(object: JsonValue, pointer: string | (string | number)[], options?: GetOptions) : boolean {
                    return has(object, pointer, Object.assign({}, boundOptions, options));
                },

                object,
                pointer,
                segments,
                options,
                smartBind: _smartBind
            }
        );

        return _api;
    }
}

export function bindObject(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject {
    return smartBind({ object, options });
}
export function bindPointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer {
    return smartBind({ pointer, options });
}
export function bindObjectPointer(object: JsonValue, pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundObjectPointer {
    return smartBind({ object, pointer, options });
}

export function object() : JsonValue;
export function object(object: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject;
export function object(object?: JsonValue, options?: Partial<AllOptions>) : ApiBoundObject | JsonValue{
    if (arguments.length === 0)
        return undefined;
    return smartBind({ object, options });
}
export function pointer() : string;
export function pointer(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
export function pointer(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | string {
    if (arguments.length === 0)
        return undefined;
    return smartBind({ pointer, options })
}
export function segments() : (string | number)[];
export function segments(pointer: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer;
export function segments(pointer?: string | (string | number)[], options?: Partial<AllOptions>) : ApiBoundPointer | (string | number)[] {
    if (arguments.length === 0)
        return undefined;
    return smartBind({ pointer, options })
}
export function options() : Partial<AllOptions>;
export function options(options: Partial<AllOptions>) : ApiBoundOptions;
export function options(options?: Partial<AllOptions>) : ApiBoundOptions | Partial<AllOptions> {
    if (arguments.length === 0)
        return undefined;
    return smartBind({ options })
}

export function jsonPointer() : ApiBoundOptions;
export function jsonPointer(obj: JsonValue) : ApiBoundObject;
export function jsonPointer(obj: JsonValue, pointer: string | (string | number)[]) : JsonValue;
export function jsonPointer(obj: JsonValue, pointer: string | (string | number)[], value : JsonValue) : JsonValue;

export function jsonPointer(obj?: JsonValue, pointer?: string | string[], value? : JsonValue) : ApiBoundOptions | ApiBoundObject | JsonValue {
    switch (arguments.length) {
        case 3:
            return set(obj, pointer, value);
        case 2:
            return get(obj, pointer);
        case 1:
            return object(obj);
        case 0:
            return smartBind();
    }
}

const api = Object.assign(
    jsonPointer, {
        escapeSegment,
        unescapeSegment,
        escapeFragment,
        unescapeFragment,
        isPointer,
        isFragment,
        parse,
        parsePointer,
        parseFragment,
        compilePointer,
        compileFragment,
        hasChildProp,
        hasOwnProp,
        hasProp,
        getProp,
        setProp,
        delProp,
        getNotFound,
        setNotFound,
        delNotFound,
        errorNotFound,
        setRoot,
        delRoot,
        get,
        set,
        del,
        has,
        object,
        pointer,
        segments,
        options,
        smartBind,
        JsonPointerError
    }
);

export default api;
