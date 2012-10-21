buster = require 'buster'
getter = require '../lib/getter'

buster.testCase 'Getter', 
	'test uppercase first letter': ->
		assert.equals getter.uppercaseFirstLetter('foo'), 'Foo'

	'test getter name': ->
		assert.equals getter.getterName('foo'), 'getFoo'

	'mixin getter': 
		setUp: ->
			@obj = 
				foo: 'bar'
			getter.mixinGetter @obj, 'foo'

		'test if getter works': ->
			assert.equals @obj.getFoo(), 'bar' 

	'test setter name': ->
		assert.equals getter.setterName('foo'), 'setFoo'

	'mixin setter':
		setUp: ->
			@obj =
				foo: 'bar'
			getter.mixinSetter @obj, 'foo'

		'test if setter works': ->
			@obj.setFoo 'abc'
			assert.equals @obj.foo, 'abc'

	'factory':
		setUp: ->
			@obj = getter.factory 
				foo: 'bar'
				baz: false

		'test if private variables were created': ->
			assert.equals @obj.foo, 'bar'
			assert.equals @obj.baz, false

		'test if default getter works': ->
			assert.equals @obj.getFoo(), 'bar'

		'test if default setter works': ->
			@obj.setFoo 'abc'
			assert.equals @obj.getFoo(), 'abc'
