var buster, getter;

buster = require('buster');

getter = require('../lib/getter');

buster.testCase('Getter', {
  'test uppercase first letter': function() {
    return assert.equals(getter.uppercaseFirstLetter('foo'), 'Foo');
  },
  'test getter name': function() {
    return assert.equals(getter.getterName('foo'), 'getFoo');
  },
  'mixin getter': {
    setUp: function() {
      this.obj = {
        foo: 'bar'
      };
      return getter.mixinGetter(this.obj, 'foo');
    },
    'test if getter works': function() {
      return assert.equals(this.obj.getFoo(), 'bar');
    }
  },
  'test setter name': function() {
    return assert.equals(getter.setterName('foo'), 'setFoo');
  },
  'mixin setter': {
    setUp: function() {
      this.obj = {
        foo: 'bar'
      };
      return getter.mixinSetter(this.obj, 'foo');
    },
    'test if setter works': function() {
      this.obj.setFoo('abc');
      return assert.equals(this.obj.foo, 'abc');
    }
  },
  'factory': {
    setUp: function() {
      return this.obj = getter.factory({
        foo: 'bar',
        baz: false
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
  }
});
