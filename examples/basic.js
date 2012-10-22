var getter = require('../lib/getter');
var obj = {};

getter.mixin(obj, {
	foo: 'bar',
	baz: 1
});

console.log(obj.getFoo()); // "bar"

obj.setBaz(2);
console.log(obj.getBaz()); // 2