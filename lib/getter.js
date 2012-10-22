
(function() {
  var getter;
  getter = {
    uppercaseFirstLetter: function(str) {
      return str.charAt(0).toUpperCase() + str.slice('1');
    },
    getterName: function(name) {
      return 'get' + this.uppercaseFirstLetter(name);
    },
    setterName: function(name) {
      return 'set' + this.uppercaseFirstLetter(name);
    },
    mixinFunction: function(obj, name, fn) {
      return obj[name] = fn;
    },
    mixinGetter: function(obj, name, getter) {
      return this.mixinFunction(obj, this.getterName(name), getter);
    },
    mixinSetter: function(obj, name, setter) {
      return this.mixinFunction(obj, this.setterName(name), setter);
    },
    defaultGetter: function(obj, name) {
      return function() {
        return obj[name];
      };
    },
    mixinDefaultGetter: function(obj, name) {
      return this.mixinGetter(obj, name, this.defaultGetter(obj, name));
    },
    defaultSetter: function(obj, name) {
      return function(val) {
        return obj[name] = val;
      };
    },
    mixinDefaultSetter: function(obj, name) {
      return this.mixinSetter(obj, name, this.defaultSetter(obj, name));
    },
    mixinKeyValueOption: function(obj, name, option) {
      obj[name] = option;
      this.mixinGetter(obj, name, this.defaultGetter(obj, name));
      return this.mixinSetter(obj, name, this.defaultSetter(obj, name));
    },
    validateKeyObjectOption: function(option) {
      if (!('value' in option)) {
        return new Error("Option object need to have a 'value' key");
      } else if ('getter' in option && typeof option.getter !== 'function' && option.getter !== false) {
        return new Error("Getter should be a function or false");
      } else if ('setter' in option && typeof option.setter !== 'function' && option.setter !== false) {
        return new Error("Setter should be a function or false");
      }
    },
    mixinPropertyFromOption: function(obj, name, option, prop) {
      var fn, upperProp;
      upperProp = this.uppercaseFirstLetter(prop);
      fn = option[prop] || this['default' + upperProp](obj, name);
      if (option[prop] !== false) {
        return this['mixin' + upperProp](obj, name, fn);
      }
    },
    forceMixinKeyOption: function(obj, name, option) {
      obj[name] = option.value;
      this.mixinPropertyFromOption(obj, name, option, 'getter');
      return this.mixinPropertyFromOption(obj, name, option, 'setter');
    },
    mixinKeyObjectOption: function(obj, name, option) {
      var error;
      error = this.validateKeyObjectOption(option);
      if (error) {
        throw error;
      } else {
        return this.forceMixinKeyOption(obj, name, option);
      }
    },
    mixinOption: function(obj, name, option) {
      if (typeof option === 'object') {
        return this.mixinKeyObjectOption(obj, name, option);
      } else {
        return this.mixinKeyValueOption(obj, name, option);
      }
    },
    factory: function(options) {
      var name, option, res;
      if (options == null) {
        options = {};
      }
      res = {};
      for (name in options) {
        option = options[name];
        this.mixinOption(res, name, option);
      }
      return res;
    },
    mixin: function(obj, options) {
      var name, prop, _ref, _results;
      if (obj == null) {
        obj = {};
      }
      if (options == null) {
        options = {};
      }
      _ref = this.factory(options);
      _results = [];
      for (name in _ref) {
        prop = _ref[name];
        _results.push(obj[name] = prop);
      }
      return _results;
    }
  };
  if (typeof module !== 'undefined' && module.exports) {
    return module.exports = getter;
  } else if (typeof define !== 'undefined') {
    return define([], function() {
      return getter;
    });
  } else {
    return window.getter = getter;
  }
})();
