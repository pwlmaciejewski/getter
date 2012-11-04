(->
  getter = 
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
      else if 'setter' of option and typeof option.setter isnt 'function' and option.setter isnt false
        new Error "Setter should be a function or false"

    mixinPropertyFromOption: (obj, name, option, prop) ->
      upperProp = @uppercaseFirstLetter(prop)
      fn = option[prop] or @['default' + upperProp] obj, name
      if option[prop] isnt false then @['mixin' + upperProp] obj, name, fn

    forceMixinKeyOption: (obj, name, option) ->
      obj[name] = option.value
      @mixinPropertyFromOption obj, name, option, 'getter'
      @mixinPropertyFromOption obj, name, option, 'setter'

    mixinKeyObjectOption: (obj, name, option) ->
      error = @validateKeyObjectOption(option) 
      if error then throw error else @forceMixinKeyOption obj, name, option

    mixinOption: (obj, name, option) ->
      if Object.prototype.toString.call(option) is '[object Object]'
        @mixinKeyObjectOption(obj, name, option)      
      else
        @mixinKeyValueOption obj, name, option

    factory: (options = {}) ->
      res = {}
      for name, option of options 
        @mixinOption res, name, option
      res

    mixin: (obj = {}, options = {}) ->
      for name, prop of @factory options
        obj[name] = prop

  if typeof module isnt 'undefined' and module.exports 
    module.exports = getter
  else if typeof define isnt 'undefined'
    define [], ->
      getter
  else 
    window.getter = getter
)()