var getter = require('../lib/getter');
var obj = {};

getter.mixin(obj, {
	foo: {
		value: 'bar',
	
		getter: function () {
			return this.foo + this.foo
		},

		setter: function (val) {
			this.foo = val + val;
		}
	}
});

console.log(obj.getFoo()); // "barbar"

obj.setFoo('x');
console.log(obj.getFoo()); // "xxxx"