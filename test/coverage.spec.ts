import * as chai from 'chai';
import jsonPointer from '../src';

const expect = chai.expect;

describe("coverage", () => {

    describe("escape", () => {
        it("none", () => expect(jsonPointer.escapeSegment('abc123[]%\"\'')).to.deep.equal( 'abc123[]%\"\'', "incorrect escaping"));
        it("slash", () => expect(jsonPointer.escapeSegment("//")).to.deep.equal( "~1~1", "incorrect escaping"));
        it("tilda", () => expect(jsonPointer.escapeSegment("~~")).to.deep.equal( "~0~0", "incorrect escaping"));
        it("mixed", () => {
            expect(jsonPointer.escapeSegment("abc123[]%\"\'/~/~")).to.deep.equal( "abc123[]%\"\'~1~0~1~0", "incorrect escaping");
            expect(jsonPointer.escapeSegment("abc123[]%\"\'~/~/")).to.deep.equal( "abc123[]%\"\'~0~1~0~1", "incorrect escaping");
        });
    });

    describe("escapeFragment", () => it("mixed", () => expect(jsonPointer.escapeFragment("~/ %\"\'")).to.deep.equal( "~0~1%20%25%22\'", "incorrect escaping")));

    describe("unescape", () => {
        it("none", () => expect(jsonPointer.unescapeSegment("abc123[]%\"\'")).to.deep.equal( "abc123[]%\"\'", "incorrect escaping"));
        it("slash", () => expect(jsonPointer.unescapeSegment("~1~1")).to.deep.equal( "//", "incorrect escaping"));
        it("tilda", () => expect(jsonPointer.unescapeSegment("~0~0")).to.deep.equal( "~~", "incorrect escaping"));
        it("mixed", () => {
            expect(jsonPointer.unescapeSegment("abc123[]%\"\'~1~0~1~0")).to.deep.equal( "abc123[]%\"\'/~/~", "incorrect escaping");
            expect(jsonPointer.unescapeSegment("abc123[]%\"\'~0~1~0~1")).to.deep.equal( "abc123[]%\"\'~/~/", "incorrect escaping");
        });
    });

    describe("unescapeFragment", () => it("mixed", () => expect(jsonPointer.unescapeFragment("~0%7E%7e~1%2F%2f%20%25%22")).to.deep.equal( "~~~/// %\"", "incorrect escaping")));

    describe("parse", () => {
        describe("pointer", () => {
            it("empty", () => expect(jsonPointer.parse("")).to.deep.equal( [], "incorrect parse result"));

            it("invalid", () => {
                expect(() => jsonPointer.parse("a")).to.throw(jsonPointer.JsonPointerError, "Invalid JSON pointer: a");
            });

            it("simple", () => expect(jsonPointer.parse("/a/b/")).to.deep.equal( ["a", "b", ""], "incorrect parse result"));

            it("escaped", () => expect(jsonPointer.parse("/~0/~1")).to.deep.equal( ["~", "/"], "incorrect parse result"));
        });

        describe("fragment", () => {
            it("empty", () => expect(jsonPointer.parse("#")).to.deep.equal( [], "incorrect parse result"));

            it("invalid", () => {
                expect(() => jsonPointer.parse("#a")).to.throw(jsonPointer.JsonPointerError, "Invalid JSON fragment pointer: #a");
            });

            it("simple", () => expect(jsonPointer.parse("#/a/b/")).to.deep.equal( ["a", "b", ""], "incorrect parse result"));

            it("escaped", () => expect(jsonPointer.parse("#/~0%20/~1%20")).to.deep.equal( ["~ ", "/ "], "incorrect parse result"));
        });
    });

    describe("parsePointer", () => {
        it("empty", () => expect(jsonPointer.parsePointer("")).to.deep.equal( [], "incorrect parse result"));

        it("invalid", () => {
            expect(() => jsonPointer.parsePointer("a")).to.throw(jsonPointer.JsonPointerError, "Invalid JSON pointer: a");
        });

        it("simple", () => expect(jsonPointer.parsePointer("/a/b/")).to.deep.equal( ["a", "b", ""], "incorrect parse result"));

        it("escaped", () => expect(jsonPointer.parsePointer("/~0/~1")).to.deep.equal( ["~", "/"], "incorrect parse result"));
    });

    describe("parseFragment", () => {
        it("empty", () => expect(jsonPointer.parseFragment("#")).to.deep.equal( [], "incorrect parse result"));

        it("invalid", () => {
            expect(() => jsonPointer.parseFragment("#a")).to.throw(jsonPointer.JsonPointerError, "Invalid JSON fragment pointer: #a");
        });

        it("simple", () => expect(jsonPointer.parseFragment("#/a/b/")).to.deep.equal( ["a", "b", ""], "incorrect parse result"));

        it("escaped", () => expect(jsonPointer.parseFragment("#/~0%20/~1%20")).to.deep.equal( ["~ ", "/ "], "incorrect parse result"));
    });

    describe("isPointer", () => {
        it("empty", () => expect(jsonPointer.isPointer(""), "invalid result").to.be.true);
        it("valid", () => expect(jsonPointer.isPointer("/"), "invalid result").to.be.true);
        it("invalid", () => expect(!jsonPointer.isPointer("a"), "invalid result").to.be.true);
    });

    describe("isFragment", () => {
        it("empty fragment", () => expect(jsonPointer.isFragment("#"), "invalid result").to.be.true);
        it("valid fragment pointer", () => expect(jsonPointer.isFragment("#/"), "invalid result").to.be.true);
        it("invalid (empty)", () => expect(!jsonPointer.isFragment(""), "invalid result").to.be.true);
        it("invalid (not a fragment)", () => expect(!jsonPointer.isFragment("a"), "invalid result").to.be.true);
        it("invalid (not a fragment pointer)", () => expect(!jsonPointer.isFragment("#a"), "invalid result").to.be.true);
    });

    describe("compilePointer", () => {
        it("empty", () => expect(jsonPointer.compilePointer([])).to.deep.equal( "", "incorrect compile result"));

        it("simple", () => expect(jsonPointer.compilePointer(["a", "b", ""])).to.deep.equal( "/a/b/", "incorrect compile result"));

        it("escape", () => expect(jsonPointer.compilePointer(["~", "/"])).to.deep.equal( "/~0/~1", "incorrect compile result"));
    });

    describe("compileFragment", () => {
        it("empty", () => expect(jsonPointer.compileFragment([])).to.deep.equal( "#", "incorrect compile result"));

        it("simple", () => expect(jsonPointer.compileFragment(["a", "b", ""])).to.deep.equal( "#/a/b/", "incorrect compile result"));

        it("escape", () => expect(jsonPointer.compileFragment(["~ ", "/ "])).to.deep.equal( "#/~0%20/~1%20", "incorrect compile result"));
    });

    describe("hasChildProp", () => {
        it("has", () => expect(jsonPointer.hasChildProp({
            a: 1
        }, "a"), "invalid result").to.be.true);
        it("has not", () => expect(!jsonPointer.hasChildProp({
            a: 1
        }, "b"), "invalid result").to.be.true);
        it("prototype", () => expect(!jsonPointer.hasChildProp([], "push"), "invalid result").to.be.true);
        it("non json array prop", () => expect(jsonPointer.hasChildProp([], "length"), "invalid result").to.be.false);
        it("non json string prop", () => expect(jsonPointer.hasChildProp("0", 0), "invalid result").to.be.false);
    });

    describe("hasOwnProp", () => {
        it("has", () => expect(jsonPointer.hasOwnProp({
            a: 1
        }, "a"), "invalid result").to.be.true);
        it("has not", () => expect(!jsonPointer.hasOwnProp({
            a: 1
        }, "b"), "invalid result").to.be.true);
        it("prototype", () => expect(!jsonPointer.hasOwnProp([], "push"), "invalid result").to.be.true);
    });

    describe("hasProp", () => {
        it("has", () => expect(jsonPointer.hasProp({
            a: 1
        }, "a"), "invalid result").to.be.true);
        it("has not", () => expect(!jsonPointer.hasProp({
            a: 1
        }, "b"), "invalid result").to.be.true);
        it("prototype", () => expect(jsonPointer.hasProp([], "push"), "invalid result").to.be.true);
    });

    describe("get", () => {
        var gets, object, path, result, _results;
        object = {
            "foo": ["bar", "baz"],
            "": 0,
            "a/b": 1,
            "c%d": 2,
            "e^f": 3,
            "g|h": 4,
            "i\\j": 5,
            "k\"l": 6,
            " ": 7,
            "m~n": 8
        };

        gets = {
            "": object,
            "/foo": object.foo,
            "/foo/0": object.foo[0],
            "/": object[""],
            "/a~1b": object["a/b"],
            "/c%d": object["c%d"],
            "/e^f": object["e^f"],
            "/g|h": object["g|h"],
            "/i\\j": object["i\\j"],
            "/k\"l": object["k\"l"],
            "/ ": object[" "],
            "/m~0n": object["m~n"],
            "/foo/-": void 0
        };

        for (const [path,result] of Object.entries(gets)) {
            ((path, result) => {
                it("path (" + path + ")", () =>
                    expect(jsonPointer.get(object, path)).to.deep.equal( result, "incorrect result"))
            })(path, result);
        }
    });

    describe("has", () => {
        var object;
        object = {
            a: 1,
            b: [2, 3]
        };

        it("root", () => expect(jsonPointer.has(object, ""), "incorrect result").to.be.true);

        it("object has", () => expect(jsonPointer.has(object, "/a"), "incorrect result").to.be.true);

        it("array has", () => expect(jsonPointer.has(object, "/b/0"), "incorrect result").to.be.true);

        it("object has not", () => expect(!jsonPointer.has(object, "/c"), "incorrect result").to.be.true);

        it("array has not element", () => expect(!jsonPointer.has(object, "/b/-"), "incorrect result").to.be.true);
    });

    describe("set", () => {
        it("root", () => expect(jsonPointer.set({}, "", 1)).to.deep.equal( 1, "incorrect result"));

        it("object", () => expect(jsonPointer.set({}, "/a", 1)).to.deep.equal( {
            a: 1
        }, "incorrect result"));

        it("object deep", () => expect(jsonPointer.set({
            a: {}
        }, "/a/b/c", 1)).to.deep.equal( {
            a: {
                b: {
                    c: 1
                }
            }
        }, "incorrect result"));

        it("array", () => expect(jsonPointer.set([], "/-", 1)).to.deep.equal( [1], "incorrect result"));

        it("array deep", () =>
            expect(jsonPointer.set([[]], "/0/-/-", 1)).to.deep.equal( [[[1]]], "incorrect result"));
    });

    describe("del", () => {
        it("root", () => expect(jsonPointer.del({}, "")).to.deep.equal( void 0, "incorrect result"));

        it("object", () => expect(jsonPointer.del({
            a: 1
        }, "/a")).to.deep.equal( {}, "incorrect result"));

        it("object deep", () => expect(jsonPointer.del({
            a: {
                b: {
                    c: 1
                }
            }
        }, "/a/b/c")).to.deep.equal( {
            a: {
                b: {}
            }
        }, "incorrect result"));

        it("object not found", () => expect(jsonPointer.del({
            a: 1
        }, "/b")).to.deep.equal( {
            a: 1
        }, "incorrect result"));

        it("array", () => expect(jsonPointer.del([1], "/0")).to.deep.equal( [], "incorrect result"));

        it("array deep", () => expect(jsonPointer.del([[[1]]], "/0/0/0")).to.deep.equal( [[[]]], "incorrect result"));

        it("array not found", () => expect(jsonPointer.del([1], "/-")).to.deep.equal( [1], "incorrect result"));
    });

    describe("simplified", () => {
        it("set", () => expect(jsonPointer({}, "/a", 1)).to.deep.equal( {
            a: 1
        }, "incorrect result"));

        it("get", () => expect(jsonPointer({
            b: 2
        }, "/b")).to.deep.equal( 2, "incorrect result"));

        it("bind", () => expect(jsonPointer({
            b: 2
        }).set("/b", 3, {})).to.deep.equal( {
            b: 3
        }, "incorrect result"));
    });

    describe("bind", () => {
        function clone(x) {
            return JSON.parse(JSON.stringify(x));
        }

        [true, false].forEach((bindObject) => ((bindObject) => describe("object " + (bindObject ? "bound" : "unbound"), () => [true, false].map((bindPointer) => [true, false].map((has) => ((bindPointer, has) => describe((has ? "has" : "has not") + " pointer " + (bindPointer ? "bound" : "unbound"), () => {
            var object, pointer;
            object = {
                a: 1
            };
            pointer = has ? "/a" : "/b";

            function binding(options?) {
                var b;
                b = {};
                if (bindObject) {
                    b.object = clone(object);
                }
                if (bindPointer) {
                    b.pointer = pointer;
                }
                if (options != null) {
                    b.options = options;
                }



                return b;
            }

            function boundArgs() {
                var args;
                args = [];
                if (!bindObject) {
                    args.push(clone(object));
                }
                if (!bindPointer) {
                    args.push(pointer);
                }
                return args;
            }

            function unboundArgs() {
                var args;
                return args = [clone(object), pointer];
            }

            describe("no options", () => {
                it("has", () => expect(jsonPointer.smartBind(binding()).has.apply(null, boundArgs())).to.deep.equal(jsonPointer.has.apply(null, unboundArgs()), "incorrect result"));

                it("get", () => expect(jsonPointer.smartBind(binding()).get.apply(null, boundArgs())).to.deep.equal(jsonPointer.get.apply(null, unboundArgs()), "incorrect result"));

                it("set", () => expect(jsonPointer.smartBind(binding()).set.apply(null, boundArgs().concat(["set"]))).to.deep.equal(jsonPointer.set.apply(null, unboundArgs().concat(["set"])), "incorrect result"));

                it("del", () => expect(jsonPointer.smartBind(binding()).del.apply(null, boundArgs())).to.deep.equal(jsonPointer.del.apply(null, unboundArgs()), "incorrect result"));

                it("simple get", () => expect(jsonPointer.smartBind(binding()).apply(null, boundArgs())).to.deep.equal(jsonPointer.apply(null, unboundArgs()), "incorrect result"));

                it("simple set", () => expect(jsonPointer.smartBind(binding()).apply(null, boundArgs().concat(["set"]))).to.deep.equal(jsonPointer.apply(null, unboundArgs().concat(["set"])), "incorrect result"));

                it("simple invalid", () => expect(jsonPointer.smartBind(binding()).call(null, 1, 2, 3, 4)).to.deep.equal( jsonPointer.call(null, 1, 2, 3, 4), "incorrect result"));
            });

            describe("options", () => {
                const options = {};

                it("has", () => expect(jsonPointer.smartBind(binding(options)).has.apply(null, boundArgs())).to.deep.equal(jsonPointer.has.apply(null, unboundArgs().concat([options])), "incorrect result"));

                it("get", () => expect(jsonPointer.smartBind(binding(options)).get.apply(null, boundArgs())).to.deep.equal(jsonPointer.get.apply(null, unboundArgs().concat([options])), "incorrect result"));

                it("set", () => expect(jsonPointer.smartBind(binding(options)).set.apply(null, boundArgs().concat(["set"]))).to.deep.equal(jsonPointer.set.apply(null, unboundArgs().concat(["set", options])), "incorrect result"));

                it("del", () => expect(jsonPointer.smartBind(binding(options)).del.apply(null, boundArgs())).to.deep.equal(jsonPointer.del.apply(null, unboundArgs().concat([options])), "incorrect result"));

                it("simple get", () => expect(jsonPointer.smartBind(binding(options)).apply(null, boundArgs())).to.deep.equal(jsonPointer.apply(null, unboundArgs()), "incorrect result"));

                it("simple set", () => expect(jsonPointer.smartBind(binding(options)).apply(null, boundArgs().concat(["set"]))).to.deep.equal(jsonPointer.apply(null, unboundArgs().concat(["set"])), "incorrect result"));

                it("simple invalid", () => expect(jsonPointer.smartBind(binding(options)).call(null, 1, 2, 3, 4)).to.deep.equal( jsonPointer.call(null, 1, 2, 3, 4), "incorrect result"));

                if (!has) {
                    it("get error not found", () => {
                        var ex, exBound, exUnbound, options2;
                        options2 = {
                            getNotFound: jsonPointer.errorNotFound
                        };

                        exBound = null;
                        exUnbound = null;

                        try {
                            jsonPointer.smartBind(binding(options2)).get.apply(null, boundArgs());
                        } catch (_error) {
                            ex = _error;
                            if (!(ex instanceof jsonPointer.JsonPointerError)) {
                                throw ex;
                            }
                            exBound = ex;
                        }

                        try {
                            jsonPointer.get.apply(null, unboundArgs().concat([options2]));
                        } catch (_error) {
                            ex = _error;
                            if (!(ex instanceof jsonPointer.JsonPointerError)) {
                                throw ex;
                            }
                            exUnbound = ex;
                        }

                        expect(exBound != null).to.deep.equal( exUnbound != null, "unmatched exceptions");
                        expect(exBound.name).to.deep.equal( exUnbound.name, "unmatched exceptions");
                        expect(exBound.message).to.deep.equal( exUnbound.message, "unmatched exceptions");
                    });
                }
            });
        }))(bindPointer, has)))))(bindObject));

        describe("rebind", () => {
            it("all, all", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                pointer: "/a",
                options: {}
            }).smartBind({
                object: {
                    b: 1
                },
                pointer: "/a",
                options: {}
            })()).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/a", {}), "invalid result"));

            it("all, obj", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                pointer: "/a",
                options: {}
            }).smartBind({
                object: {
                    b: 1
                }
            })()).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/a", {}), "invalid result"));
            it("all, ptr", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                pointer: "/b",
                options: {}
            }).smartBind({
                pointer: "/a"
            })()).to.deep.equal(jsonPointer.get({
                a: 1
            }, "/a", {}), "invalid result"));
            it("all, opt", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                pointer: "/a",
                options: {}
            }).smartBind({
                options: {}
            })()).to.deep.equal(jsonPointer.get({
                a: 1
            }, "/a", {}), "invalid result"));

            it("no obj, no obj", () => expect(jsonPointer.smartBind({
                pointer: "/a",
                options: {}
            }).smartBind({
                pointer: "/b"
            })({
                b: 1
            })).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/b", {}), "invalid result"));
            it("no ptr, no ptr", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                options: {}
            }).smartBind({
                object: {
                    b: 1
                }
            })("/b")).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/b", {}), "invalid result"));
            it("no opt, no opt", () => expect(jsonPointer.smartBind({
                object: {
                    a: 1
                },
                pointer: "/b"
            }).smartBind({
                object: {
                    b: 1
                }
            })()).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/b", {}), "invalid result"));

            it("opt, simple obj", () => expect(jsonPointer.smartBind({
                options: {}
            })({
                b: 1
            })("/b")).to.deep.equal(jsonPointer.get({
                b: 1
            }, "/b", {}), "invalid result"));
        });
    });

    describe("bound meta data", () => {
        it("object", () => {
            const p = jsonPointer.smartBind({
                object: {
                    a: 1
                }
            });

            expect(p.object()).to.deep.equal( {
                a: 1
            }, "incorrect meta data");

            expect(p.object({
                b: 2
            })).to.deep.equal( {
                b: 2
            }, "incorrect assignment result");

            expect(p.object()).to.deep.equal( {
                b: 2
            }, "incorrect meta data");

            expect(p("/b")).to.deep.equal( 2, "incorrect result");
        });

        it("pointer", () => {
            const p = jsonPointer.smartBind({
                pointer: "/a"
            });

            expect(p.pointer()).to.deep.equal( "/a", "incorrect meta data");

            expect(p.pointer("/b")).to.deep.equal( "/b", "incorrect assignment result");

            expect(p.pointer()).to.deep.equal( "/b", "incorrect meta data");

            expect(p({
                a: 1,
                b: 2
            })).to.deep.equal( 2, "incorrect result");
        });

        it("options", () => {
            const p = jsonPointer.smartBind({
                options: {
                    hasProp: jsonPointer.hasOwnProp
                }
            });

            expect(p.options()).to.deep.equal( {
                hasProp: jsonPointer.hasOwnProp
            }, "incorrect meta data");

            expect(p.options({
                hasProp: jsonPointer.hasProp
            })).to.deep.equal( {
                hasProp: jsonPointer.hasProp
            }, "incorrect meta data");

            expect(p.options()).to.deep.equal( {
                hasProp: jsonPointer.hasProp
            }, "incorrect meta data");

            expect(p([], "/push")).to.deep.equal( [].push, "incorrect result");
        });
    });
});
