# getter [![Build Status](https://secure.travis-ci.org/fragphace/getter.png?branch=master)](http://travis-ci.org/fragphace/getter)

Helper for adding getters and setters into your object. For node and browser.

## Installation

For node.js:

```
npm install getter
```

For browser you need to include `lib/getter.js` into your page. Getter is AMD-friendly.

## Usage

All you need to do is to pass an object and options to `mixin` function. Getter will create
getters and setter for you:

```javascript
var getter = require('getter');
var obj = {};

getter.mixin(obj, {
	foo: 'bar',
	baz: 1
});

console.log(obj.getFoo()); // "bar"

obj.setBaz(2);
console.log(obj.getBaz()); // 2
``` 

You can easily override default getters and setters:

```javascript
var getter = require('getter');
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
```

If you don't want to create getter of setter for property,
you can always get rid of it:

```javascript
var getter = require(getter);
var obj = {};

getter.mixin(obj, {
	foo: {
		value: 'bar',
		setter: false
	}
});

console.log('setFoo' in obj); // false
```

## Tests

For Node.js tests:

```
grunt test
```

For all tests (buster and phantomjs must be installed globally):

```
grunt buster
```