var getter = require('../lib/getter');
var obj = {};

getter.mixin(obj, {
	foo: {
		value: 'bar',
		setter: false
	}
});

console.log('setFoo' in obj); // false