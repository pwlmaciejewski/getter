module.exports = 
	uppercaseFirstLetter: (str) ->
		str.charAt(0).toUpperCase() + str.slice '1'
	
	getterName: (name) ->
		'get' + @uppercaseFirstLetter name

	setterName: (name) ->
		'set' + @uppercaseFirstLetter name
	
	mixinFunction: (obj, name, fn) ->
		obj[name] = fn

	mixinGetter: (obj, name, getter) ->
		@mixinFunction obj, @getterName(name), getter 
	
	mixinSetter: (obj, name, setter) ->
		@mixinFunction obj, @setterName(name), setter

	defaultGetter: (obj, name) ->
		->
			obj[name]

	mixinDefaultGetter: (obj, name) ->
		@mixinGetter obj, name, @defaultGetter obj, name

	defaultSetter: (obj, name) ->
		(val) ->
			obj[name] = val

	mixinDefaultSetter: (obj, name) ->
		@mixinSetter obj, name, @defaultSetter obj, name

	mixinKeyValueOption: (obj, name, option) ->
		obj[name] = option
		@mixinGetter obj, name, @defaultGetter(obj, name)
		@mixinSetter obj, name, @defaultSetter(obj, name)

	validateKeyObjectOption: (option) ->
		if 'value' not of option then new Error "Option object need to have a 'value' key"
		else if 'getter' of option and typeof option.getter isnt 'function' and option.getter isnt false
			new Error "Getter should be a function or false" 
		else if 'setter' of option and typeof option.setter isnt 'function' and option.getter isnt false
			new Error "Setter should be a function or false"

	mixinKeyObjectOption: (obj, name, option) ->
		error = @validateKeyObjectOption(option) 
		if error then throw error

		if 'getter' not of option 
			getter = @defaultGetter obj, name
		else if typeof option.getter is 'function'
			getter = option.getter

		if 'setter' not of option
			setter = @defaultSetter obj, name
		else if typeof option.setter is 'function'
			setter = option.setter

		obj[name] = option.value
		if getter 
			@mixinGetter obj, name, getter
		if setter
			@mixinSetter obj, name, setter

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
