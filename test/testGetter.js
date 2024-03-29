
(function() {
  var buster, getter;
  buster = null;
  getter = null;
  if (typeof module !== 'undefined' && module.exports) {
    buster = require('buster');
    getter = require('../lib/getter');
  } else if (typeof define !== 'undefined') {
    buster = window.buster;
    require(['lib/getter'], function(gttr) {
      getter = gttr;
      return buster.run();
    });
  } else {
    buster = window.buster;
    getter = window.getter;
  }
  return buster.testCase('Getter', {
    'test uppercase first letter': function() {
      return assert.equals(getter.uppercaseFirstLetter('foo'), 'Foo');
    },
    'test getter name': function() {
      return assert.equals(getter.getterName('foo'), 'getFoo');
    },
    'mixin getter': {
      'default getter': {
        setUp: function() {
          this.obj = {
            foo: 'bar'
          };
          return getter.mixinDefaultGetter(this.obj, 'foo');
        },
        'test if getter works': function() {
          return assert.equals(this.obj.getFoo(), 'bar');
        }
      },
      'custom getter': {
        setUp: function() {
          this.obj = {
            foo: 'bar'
          };
          return getter.mixinGetter(this.obj, 'foo', function() {
            return this.foo + this.foo;
          });
        },
        'test if custom getter works': function() {
          return assert.equals(this.obj.getFoo(), 'barbar');
        }
      }
    },
    'test setter name': function() {
      return assert.equals(getter.setterName('foo'), 'setFoo');
    },
    'mixin setter': {
      'default setter': {
        setUp: function() {
          this.obj = {
            foo: 'bar'
          };
          return getter.mixinDefaultSetter(this.obj, 'foo');
        },
        'test if setter works': function() {
          this.obj.setFoo('abc');
          return assert.equals(this.obj.foo, 'abc');
        }
      },
      'custom setter': {
        setUp: function() {
          this.obj = {};
          return getter.mixinSetter(this.obj, 'foo', function(val) {
            return this.foo = val + val;
          });
        },
        'test if custom setter works': function() {
          this.obj.setFoo('bar');
          return assert.equals(this.obj.foo, 'barbar');
        }
      }
    },
    'factory': {
      'key-value initialization': {
        setUp: function() {
          return this.obj = getter.factory({
            foo: 'bar',
            baz: false,
            abc: null,
            cde: [1, 2],
            fgh: function() {
              return 'ijk';
            }
          });
        },
        'test if private variables were created': function() {
          assert.equals(this.obj.foo, 'bar');
          return assert.equals(this.obj.baz, false);
        },
        'test if default getter works': function() {
          return assert.equals(this.obj.getFoo(), 'bar');
        },
        'test if default setter works': function() {
          this.obj.setFoo('abc');
          return assert.equals(this.obj.getFoo(), 'abc');
        }
      },
      'key-object initialization': {
        'test valid initialization': function() {
          this.obj = getter.factory({
            foo: {
              value: 'bar'
            }
          });
          return assert.equals(this.obj.getFoo(), 'bar');
        },
        'test invalid initialization': function() {
          var _this = this;
          return assert.exception(function() {
            return _this.obj = getter.factory({
              foo: {
                abc: 'def'
              }
            });
          });
        }
      },
      'change default getter and setter': {
        'valid getter and setter': {
          setUp: function() {
            return this.obj = getter.factory({
              foo: {
                value: 'bar',
                getter: function() {
                  return this.foo + this.foo;
                },
                setter: function(val) {
                  return this.foo = val + val;
                }
              }
            });
          },
          'test if getter is custom': function() {
            return assert.equals(this.obj.getFoo(), 'barbar');
          },
          'test if setter is custom': function() {
            this.obj.setFoo('bar');
            return assert.equals(this.obj.foo, 'barbar');
          }
        },
        'invalid getter': function() {
          var _this = this;
          return assert.exception(function() {
            return getter.factory({
              foo: {
                value: 'bar',
                getter: 'baz'
              }
            });
          });
        },
        'invalid setter': function() {
          var _this = this;
          return assert.exception(function() {
            return getter.factory({
              foo: {
                value: 'bar',
                setter: 'baz'
              }
            });
          });
        }
      },
      'disable getter and setter': {
        setUp: function() {
          return this.obj = getter.factory({
            foo: {
              value: 'bar',
              getter: false,
              setter: false
            }
          });
        },
        'check if getter is disabled': function() {
          return refute('getFoo' in this.obj);
        },
        'check if setter is disabled': function() {
          return refute('setFoo' in this.obj);
        }
      }
    },
    'mixin': {
      setUp: function() {
        this.mixObj = {
          bac: 'baz'
        };
        this.prop = {
          foo: {
            value: 'bar',
            getter: function() {
              return this.foo + this.foo;
            },
            setter: false
          }
        };
        this.obj = getter.factory(this.prop);
        return getter.mixin(this.mixObj, this.prop);
      },
      'test if mixin extend object properly': function() {
        this.obj.bac = 'baz';
        return assert.equals(this.obj, this.mixObj);
      }
    },
    'inheritance': {
      setUp: function() {
        this.obj1 = {};
        getter.mixin(this.obj1, {
          foo: 'bar'
        });
        this.obj2 = Object.create(this.obj1);
        return this.obj2.setFoo('baz');
      },
      'test if set creates a new property in child object': function() {
        return assert(this.obj2.hasOwnProperty('foo'));
      },
      'test if getter get an property from child object': function() {
        return assert.equals(this.obj2.getFoo(), 'baz');
      }
    }
  });
})();
