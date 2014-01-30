(function() {
  _ = require('underscore');
  
  var DepArray, DepCell, DepMap, DepMgr, Ev, MappedDepArray, ObsArray, ObsCell, ObsMap, RawHtml, Recorder, SrcArray, SrcCell, SrcMap, asyncBind, bind, depMgr, ev, events, firstWhere, lagBind, mkMap, mktag, mkuid, nextUid, nthWhere, popKey, postLagBind, prop, propSet, props, recorder, rx, rxt, setProp, specialAttrs, tag, tags, _fn, _i, _len, _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    _this = this;

  if (typeof exports === 'undefined') {
    this.rx = rx = {};
  } else {
    rx = exports;
  }

  nextUid = 0;

  mkuid = function() {
    return nextUid += 1;
  };

  popKey = function(x, k) {
    var v;

    if (!k in x) {
      throw 'object has no key ' + k;
    }
    v = x[k];
    delete x[k];
    return v;
  };

  nthWhere = function(xs, n, f) {
    var i, x, _i, _len;

    for (i = _i = 0, _len = xs.length; _i < _len; i = ++_i) {
      x = xs[i];
      if (f(x) && (n -= 1) < 0) {
        return [x, i];
      }
    }
    return [null, -1];
  };

  firstWhere = function(xs, f) {
    return nthWhere(xs, 0, f);
  };

  mkMap = function() {
    return Object.create(null);
  };

  DepMgr = rx.DepMgr = (function() {
    function DepMgr() {
      this.uid2src = {};
    }

    DepMgr.prototype.sub = function(uid, src) {
      return this.uid2src[uid] = src;
    };

    DepMgr.prototype.unsub = function(uid) {
      return popKey(this.uid2src, uid);
    };

    return DepMgr;

  })();

  rx._depMgr = depMgr = new DepMgr();

  Ev = rx.Ev = (function() {
    function Ev(inits) {
      this.inits = inits;
      this.subs = [];
    }

    Ev.prototype.sub = function(listener) {
      var init, uid, _i, _len, _ref;

      uid = mkuid();
      if (this.inits != null) {
        _ref = this.inits();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          init = _ref[_i];
          listener(init);
        }
      }
      this.subs[uid] = listener;
      depMgr.sub(uid, this);
      return uid;
    };

    Ev.prototype.pub = function(data) {
      var listener, uid, _ref, _results;

      _ref = this.subs;
      _results = [];
      for (uid in _ref) {
        listener = _ref[uid];
        _results.push(listener(data));
      }
      return _results;
    };

    Ev.prototype.unsub = function(uid) {
      popKey(this.subs, uid);
      return depMgr.unsub(uid, this);
    };

    Ev.prototype.scoped = function(listener, context) {
      var uid;

      uid = this.sub(listener);
      try {
        return context();
      } finally {
        this.unsub(uid);
      }
    };

    return Ev;

  })();

  rx.skipFirst = function(f) {
    var first;

    first = true;
    return function(x) {
      if (first) {
        return first = false;
      } else {
        return f(x);
      }
    };
  };

  Recorder = rx.Recorder = (function() {
    function Recorder() {
      this.stack = [];
      this.isMutating = false;
      this.isIgnoring = false;
      this.onMutationWarning = new Ev();
    }

    Recorder.prototype.record = function(dep, f) {
      var wasIgnoring, wasMutating;

      if (this.stack.length > 0 && !this.isMutating) {
        _(this.stack).last().addNestedBind(dep);
      }
      this.stack.push(dep);
      wasMutating = this.isMutating;
      this.isMutating = false;
      wasIgnoring = this.isIgnoring;
      this.isIgnoring = false;
      try {
        return f();
      } finally {
        this.isIgnoring = wasIgnoring;
        this.isMutating = wasMutating;
        this.stack.pop();
      }
    };

    Recorder.prototype.sub = function(sub) {
      var handle, topCell;

      if (this.stack.length > 0 && !this.isIgnoring) {
        topCell = _(this.stack).last();
        return handle = sub(topCell);
      }
    };

    Recorder.prototype.addCleanup = function(cleanup) {
      if (this.stack.length > 0) {
        return _(this.stack).last().addCleanup(cleanup);
      }
    };

    Recorder.prototype.mutating = function(f) {
      var wasMutating;

      if (this.stack.length > 0) {
        console.warn('Mutation to observable detected during a bind context');
        this.onMutationWarning.pub(null);
      }
      wasMutating = this.isMutating;
      this.isMutating = true;
      try {
        return f();
      } finally {
        this.isMutating = wasMutating;
      }
    };

    Recorder.prototype.ignoring = function(f) {
      var wasIgnoring;

      wasIgnoring = this.isIgnoring;
      this.isIgnoring = true;
      try {
        return f();
      } finally {
        this.isIgnoring = wasIgnoring;
      }
    };

    return Recorder;

  })();

  rx._recorder = recorder = new Recorder();

  rx.asyncBind = asyncBind = function(init, f) {
    var dep;

    dep = new DepCell(f, init);
    dep.refresh();
    return dep;
  };

  rx.bind = bind = function(f) {
    return asyncBind(null, function() {
      return this.done(this.record(f));
    });
  };

  rx.lagBind = lagBind = function(lag, init, f) {
    var timeout;

    timeout = null;
    return asyncBind(init, function() {
      var _this = this;

      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(function() {
        return _this.done(_this.record(f));
      }, lag);
    });
  };

  rx.postLagBind = postLagBind = function(init, f) {
    var timeout;

    timeout = null;
    return asyncBind(init, function() {
      var ms, val, _ref,
        _this = this;

      _ref = this.record(f), val = _ref.val, ms = _ref.ms;
      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout((function() {
        return _this.done(val);
      }), ms);
    });
  };

  rx.snap = function(f) {
    return recorder.ignoring(f);
  };

  rx.onDispose = function(cleanup) {
    return recorder.addCleanup(cleanup);
  };

  rx.autoSub = function(ev, listener) {
    var subid;

    subid = ev.sub(listener);
    rx.onDispose(function() {
      return ev.unsub(subid);
    });
    return subid;
  };

  ObsCell = rx.ObsCell = (function() {
    function ObsCell(x) {
      var _ref,
        _this = this;

      this.x = x;
      this.x = (_ref = this.x) != null ? _ref : null;
      this.onSet = new Ev(function() {
        return [[null, _this.x]];
      });
    }

    ObsCell.prototype.get = function() {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onSet, function() {
          return target.refresh();
        });
      });
      return this.x;
    };

    return ObsCell;

  })();

  SrcCell = rx.SrcCell = (function(_super) {
    __extends(SrcCell, _super);

    function SrcCell() {
      _ref = SrcCell.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    SrcCell.prototype.set = function(x) {
      var _this = this;

      return recorder.mutating(function() {
        var old;

        if (_this.x !== x) {
          old = _this.x;
          _this.x = x;
          _this.onSet.pub([old, x]);
          return old;
        }
      });
    };

    return SrcCell;

  })(ObsCell);

  DepCell = rx.DepCell = (function(_super) {
    __extends(DepCell, _super);

    function DepCell(body, init) {
      this.body = body;
      DepCell.__super__.constructor.call(this, init != null ? init : null);
      this.refreshing = false;
      this.nestedBinds = [];
      this.cleanups = [];
    }

    DepCell.prototype.refresh = function() {
      var env, old,
        _this = this;

      if (!this.refreshing) {
        old = this.x;
        env = {
          _recorded: false,
          record: function(f) {
            if (!_this.refreshing) {
              _this.disconnect();
              _this.refreshing = true;
              if (env._recorded) {
                throw 'this refresh has already recorded its dependencies';
              }
              env._recorded = true;
              try {
                return recorder.record(_this, function() {
                  return f.call(env);
                });
              } finally {
                _this.refreshing = false;
              }
            }
          },
          done: function(x) {
            _this.x = x;
            if (old !== _this.x) {
              return _this.onSet.pub([old, _this.x]);
            }
          }
        };
        return this.body.call(env);
      }
    };

    DepCell.prototype.disconnect = function() {
      var cleanup, nestedBind, _i, _j, _len, _len1, _ref1, _ref2;

      _ref1 = this.cleanups;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cleanup = _ref1[_i];
        cleanup();
      }
      _ref2 = this.nestedBinds;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        nestedBind = _ref2[_j];
        nestedBind.disconnect();
      }
      this.nestedBinds = [];
      return this.cleanups = [];
    };

    DepCell.prototype.addNestedBind = function(nestedBind) {
      return this.nestedBinds.push(nestedBind);
    };

    DepCell.prototype.addCleanup = function(cleanup) {
      return this.cleanups.push(cleanup);
    };

    return DepCell;

  })(ObsCell);

  ObsArray = rx.ObsArray = (function() {
    function ObsArray(xs) {
      var _ref1,
        _this = this;

      this.xs = xs;
      this.xs = (_ref1 = this.xs) != null ? _ref1 : [];
      this.onChange = new Ev(function() {
        return [[0, [], _this.xs]];
      });
    }

    ObsArray.prototype.all = function() {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function() {
          return target.refresh();
        });
      });
      return _.clone(this.xs);
    };

    ObsArray.prototype.raw = function() {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function() {
          return target.refresh();
        });
      });
      return this.xs;
    };

    ObsArray.prototype.at = function(i) {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function(_arg) {
          var added, index, removed;

          index = _arg[0], removed = _arg[1], added = _arg[2];
          if (index === i) {
            return target.refresh();
          }
        });
      });
      return this.xs[i];
    };

    ObsArray.prototype.length = function() {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function(_arg) {
          var added, index, removed;

          index = _arg[0], removed = _arg[1], added = _arg[2];
          if (removed.length !== added.length) {
            return target.refresh();
          }
        });
      });
      return this.xs.length;
    };

    ObsArray.prototype.map = function(f) {
      var ys;

      ys = new MappedDepArray();
      rx.autoSub(this.onChange, function(_arg) {
        var added, index, removed;

        index = _arg[0], removed = _arg[1], added = _arg[2];
        return ys.realSplice(index, removed.length, added.map(f));
      });
      return ys;
    };

    ObsArray.prototype.realSplice = function(index, count, additions) {
      var removed;

      removed = this.xs.splice.apply(this.xs, [index, count].concat(additions));
      return this.onChange.pub([index, removed, additions]);
    };

    return ObsArray;

  })();

  SrcArray = rx.SrcArray = (function(_super) {
    __extends(SrcArray, _super);

    function SrcArray() {
      _ref1 = SrcArray.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    SrcArray.prototype.spliceArray = function(index, count, additions) {
      var _this = this;

      return recorder.mutating(function() {
        return _this.realSplice(index, count, additions);
      });
    };

    SrcArray.prototype.splice = function() {
      var additions, count, index;

      index = arguments[0], count = arguments[1], additions = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return this.spliceArray(index, count, additions);
    };

    SrcArray.prototype.insert = function(x, index) {
      return this.splice(index, 0, x);
    };

    SrcArray.prototype.remove = function(x) {
      return this.removeAt(_(this.raw()).indexOf(x));
    };

    SrcArray.prototype.removeAt = function(index) {
      return this.splice(index, 1);
    };

    SrcArray.prototype.push = function(x) {
      return this.splice(this.length(), 0, x);
    };

    SrcArray.prototype.put = function(i, x) {
      return this.splice(i, 1, x);
    };

    SrcArray.prototype.replace = function(xs) {
      return this.spliceArray(0, this.length(), xs);
    };

    return SrcArray;

  })(ObsArray);

  MappedDepArray = rx.MappedDepArray = (function(_super) {
    __extends(MappedDepArray, _super);

    function MappedDepArray() {
      _ref2 = MappedDepArray.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    return MappedDepArray;

  })(ObsArray);

  DepArray = rx.DepArray = (function(_super) {
    __extends(DepArray, _super);

    function DepArray(f) {
      var _this = this;

      this.f = f;
      DepArray.__super__.constructor.call(this);
      rx.autoSub((bind(function() {
        return _this.f();
      })).onSet, function(_arg) {
        var additions, count, index, old, val, _i, _ref3, _ref4, _results;

        old = _arg[0], val = _arg[1];
        if (old != null) {
          _ref4 = firstWhere((function() {
            _results = [];
            for (var _i = 0, _ref3 = Math.min(old.length, val.length); 0 <= _ref3 ? _i <= _ref3 : _i >= _ref3; 0 <= _ref3 ? _i++ : _i--){ _results.push(_i); }
            return _results;
          }).apply(this), function(i) {
            return old[i] !== val[i];
          }), index = _ref4[0], index = _ref4[1];
        } else {
          index = 0;
        }
        if (index > -1) {
          count = old != null ? old.length - index : 0;
          additions = val.slice(index);
          return _this.realSplice(index, count, additions);
        }
      });
    }

    return DepArray;

  })(ObsArray);

  ObsMap = rx.ObsMap = (function() {
    function ObsMap(x) {
      var _this = this;

      this.x = x != null ? x : {};
      this.onAdd = new Ev(function() {
        var k, v, _results;

        _results = [];
        for (k in x) {
          v = x[k];
          _results.push([k, v]);
        }
        return _results;
      });
      this.onRemove = new Ev();
      this.onChange = new Ev();
    }

    ObsMap.prototype.get = function(key) {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onAdd, function(_arg) {
          var subkey, val;

          subkey = _arg[0], val = _arg[1];
          if (key === subkey) {
            return target.refresh();
          }
        });
      });
      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function(_arg) {
          var old, subkey, val;

          subkey = _arg[0], old = _arg[1], val = _arg[2];
          if (key === subkey) {
            return target.refresh();
          }
        });
      });
      recorder.sub(function(target) {
        return rx.autoSub(_this.onRemove, function(_arg) {
          var old, subkey;

          subkey = _arg[0], old = _arg[1];
          if (key === subkey) {
            return target.refresh();
          }
        });
      });
      return this.x[key];
    };

    ObsMap.prototype.all = function() {
      var _this = this;

      recorder.sub(function(target) {
        return rx.autoSub(_this.onAdd, function() {
          return target.refresh();
        });
      });
      recorder.sub(function(target) {
        return rx.autoSub(_this.onChange, function() {
          return target.refresh();
        });
      });
      recorder.sub(function(target) {
        return rx.autoSub(_this.onRemove, function() {
          return target.refresh();
        });
      });
      return _.clone(this.x);
    };

    ObsMap.prototype.realPut = function(key, val) {
      var old;

      if (key in this.x) {
        old = this.x[key];
        this.x[key] = val;
        this.onChange.pub([key, old, val]);
        return old;
      } else {
        this.x[key] = val;
        this.onAdd.pub([key, val]);
        return void 0;
      }
    };

    ObsMap.prototype.realRemove = function(key) {
      var val;

      val = popKey(this.x, key);
      this.onRemove.pub([key, val]);
      return val;
    };

    return ObsMap;

  })();

  SrcMap = rx.SrcMap = (function(_super) {
    __extends(SrcMap, _super);

    function SrcMap() {
      _ref3 = SrcMap.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    SrcMap.prototype.put = function(key, val) {
      var _this = this;

      return recorder.mutating(function() {
        return _this.realPut(key, val);
      });
    };

    SrcMap.prototype.remove = function(key) {
      var _this = this;

      return recorder.mutating(function() {
        return _this.realRemove(key);
      });
    };

    return SrcMap;

  })(ObsMap);

  DepMap = rx.DepMap = (function(_super) {
    __extends(DepMap, _super);

    function DepMap(f) {
      this.f = f;
      DepMap.__super__.constructor.call(this);
      rx.autoSub(new DepCell(this.f).onSet, function(_arg) {
        var k, old, v, val, _results;

        old = _arg[0], val = _arg[1];
        for (k in old) {
          v = old[k];
          if (!k in val) {
            this.realRemove(k);
          }
        }
        _results = [];
        for (k in val) {
          v = val[k];
          if (this.x[k] !== v) {
            _results.push(this.realPut(k, v));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    }

    return DepMap;

  })(ObsMap);

  rx.reactify = function(obj, fieldspec) {
    var arr, methName, name, spec;

    if (_.isArray(obj)) {
      arr = rx.array(_.clone(obj));
      Object.defineProperties(obj, _.object((function() {
        var _i, _len, _ref4, _results;

        _ref4 = _.functions(arr);
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          methName = _ref4[_i];
          if (methName !== 'length') {
            _results.push((function(methName) {
              var meth, newMeth, spec;

              meth = obj[methName];
              newMeth = function() {
                var args, res, _ref5;

                args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                if (meth != null) {
                  res = meth.call.apply(meth, [obj].concat(__slice.call(args)));
                }
                (_ref5 = arr[methName]).call.apply(_ref5, [arr].concat(__slice.call(args)));
                return res;
              };
              spec = {
                configurable: true,
                enumerable: false,
                value: newMeth,
                writable: true
              };
              return [methName, spec];
            })(methName));
          }
        }
        return _results;
      })()));
      return obj;
    } else {
      return Object.defineProperties(obj, _.object((function() {
        var _results;

        _results = [];
        for (name in fieldspec) {
          spec = fieldspec[name];
          _results.push((function(name, spec) {
            var desc, obs, view, _ref4, _ref5;

            desc = null;
            switch (spec.type) {
              case 'cell':
                obs = rx.cell((_ref4 = spec.val) != null ? _ref4 : null);
                desc = {
                  configurable: true,
                  enumerable: true,
                  get: function() {
                    return obs.get();
                  },
                  set: function(x) {
                    return obs.set(x);
                  }
                };
                break;
              case 'array':
                view = rx.reactify((_ref5 = spec.val) != null ? _ref5 : []);
                desc = {
                  configurable: true,
                  enumerable: true,
                  get: function() {
                    view.raw();
                    return view;
                  },
                  set: function(x) {
                    view.splice.apply(view, [0, view.length].concat(__slice.call(x)));
                    return view;
                  }
                };
                break;
              default:
                throw "Unknown observable type: " + type;
            }
            return [name, desc];
          })(name, spec));
        }
        return _results;
      })()));
    }
  };

  rx.autoReactify = function(obj) {
    var name, type, val;

    return rx.reactify(obj, _.object((function() {
      var _i, _len, _ref4, _results;

      _ref4 = Object.getOwnPropertyNames(obj);
      _results = [];
      for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
        name = _ref4[_i];
        val = obj[name];
        type = _.isFunction(val) ? null : _.isArray(val) ? 'array' : 'cell';
        _results.push([
          name, {
            type: type,
            val: val
          }
        ]);
      }
      return _results;
    })()));
  };

  _.extend(rx, {
    cell: function(x) {
      return new SrcCell(x);
    },
    array: function(xs) {
      return new SrcArray(xs);
    },
    map: function(x) {
      return new SrcMap(x);
    }
  });

  rx.flatten = function(xs) {
    return new DepArray(function() {
      var x;

      return _((function() {
        var _i, _len, _results;

        _results = [];
        for (_i = 0, _len = xs.length; _i < _len; _i++) {
          x = xs[_i];
          if (x instanceof ObsArray) {
            _results.push(x.raw());
          } else if (x instanceof ObsCell) {
            _results.push(x.get());
          } else {
            _results.push(x);
          }
        }
        return _results;
      })()).chain().flatten(true).filter(function(x) {
        return x != null;
      }).value();
    });
  };

}).call(this);
