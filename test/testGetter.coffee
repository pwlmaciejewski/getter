buster = require 'buster'
getter = require '../lib/getter'

buster.testCase 'Getter', 
	'test uppercase first letter': ->
		assert.equals getter.uppercaseFirstLetter('foo'), 'Foo'

	'test getter name': ->
		assert.equals getter.getterName('foo'), 'getFoo'

	'mixin getter': 
		'default getter':
			setUp: ->
				@obj = 
					foo: 'bar'
				getter.mixinGetter @obj, 'foo'

			'test if getter works': ->
				assert.equals @obj.getFoo(), 'bar' 

		'custom getter':
			setUp: ->
				@obj = 
					foo: 'bar'

				getter.mixinGetter @obj, 'foo', ->
					@foo + @foo

			'test if custom getter works': ->
				assert.equals @obj.getFoo(), 'barbar'

	'test setter name': ->
		assert.equals getter.setterName('foo'), 'setFoo'

	'mixin setter':
		'default setter':
			setUp: ->
				@obj =
					foo: 'bar'
				getter.mixinSetter @obj, 'foo'

			'test if setter works': ->
				@obj.setFoo 'abc'
				assert.equals @obj.foo, 'abc'

		'custom setter':
			setUp: ->
				@obj = {}
				getter.mixinSetter @obj, 'foo', (val) ->
					@foo = val + val

			'test if custom setter works': ->
				@obj.setFoo 'bar'
				assert.equals @obj.foo, 'barbar'

	'factory':
		'key-value initialization': 
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

		'key-object initialization':
			'test valid initialization': ->
				@obj = getter.factory
					foo: 
						value: 'bar'
				assert.equals @obj.getFoo(), 'bar'

			'test invalid initialization': ->
				assert.exception =>
					@obj = getter.factory
						foo:
							abc: 'def'

		'change default getter and setter':
			setUp: ->
				@obj = getter.factory
					foo: 
						value: 'bar'
						getter: ->
							@foo + @foo
						setter: (val) ->
							@foo = val + val

			'test if getter is custom': ->
				assert.equals @obj.getFoo(), 'barbar'

			'test if setter is custom': ->
				@obj.setFoo 'bar'
				assert.equals @obj.foo, 'barbar'