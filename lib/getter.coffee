Unterproto = require 'unterproto'

module.exports = Unterproto.inherits
	uppercaseFirstLetter: (str) ->
		str.charAt(0).toUpperCase() + str.slice '1'
	
	getterName: (name) ->
		'get' + @uppercaseFirstLetter name

	defaultGetter: (obj, name) ->
		->
			obj[name]

	mixinGetter: (obj, name) ->
		obj[@getterName(name)] = @defaultGetter obj, name

	setterName: (name) ->
		'set' + @uppercaseFirstLetter name

	defaultSetter: (obj, name) ->
		(val) ->
			obj[name] = val

	mixinSetter: (obj, name) ->
		obj[@setterName(name)] = @defaultSetter obj, name

	factory: (options) ->
		res = {}

		for name, option of options
			((name, option) =>
				res[name] = options[name]
				@mixinGetter res, name
				@mixinSetter res, name
			)(name, option)

		res