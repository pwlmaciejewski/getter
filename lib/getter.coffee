module.exports = 
	uppercaseFirstLetter: (str) ->
		str.charAt(0).toUpperCase() + str.slice '1'
	
	getterName: (name) ->
		'get' + @uppercaseFirstLetter name

	mixinFunction: (obj, name, fn) ->
		obj[name] = fn

	defaultGetter: (obj, name) ->
		->
			obj[name]

	mixinGetter: (obj, name, customGetter) ->
		obj[@getterName(name)] = if not customGetter then @defaultGetter obj, name else ->
			customGetter.call obj

	setterName: (name) ->
		'set' + @uppercaseFirstLetter name

	defaultSetter: (obj, name) ->
		(val) ->
			obj[name] = val

	mixinSetter: (obj, name, customSetter) ->
		obj[@setterName(name)] = if not customSetter then @defaultSetter obj, name else (val) ->
			customSetter.call obj, val

	mixinGetterAndSetter: (obj, name, customGetter, customSetter) ->
		@mixinGetter obj, name, customGetter
		@mixinSetter obj, name, customSetter

	mixinValueGetterAndSetter: (obj, name, value, customGetter, customSetter) ->
		obj[name] = value
		@mixinGetterAndSetter obj, name, customGetter, customSetter

	mixinKeyValueOption: (obj, name, option) ->
		@mixinValueGetterAndSetter obj, name, option

	mixinKeyObjectOption: (obj, name, option) ->
		if 'value' not of option then throw new Error "Option object need to have a 'value' key"
		@mixinValueGetterAndSetter obj, name, option.value, option.getter, option.setter

	mixinOption: (obj, name, option) ->
		if typeof option is 'object' 
			@mixinKeyObjectOption(obj, name, option)			
		else
			@mixinKeyValueOption obj, name, option

	factory: (options) ->
		res = {}
		for name, option of options 
			@mixinOption res, name, option
		res
