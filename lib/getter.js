
module.exports = {
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
    } else if ('setter' in option && typeof option.setter !== 'function' && option.getter !== false) {
      return new Error("Setter should be a function or false");
    }
  },
  mixinKeyObjectOption: function(obj, name, option) {
    var error, getter, setter;
    error = this.validateKeyObjectOption(option);
    if (error) {
      throw error;
    }
    if (!('getter' in option)) {
      getter = this.defaultGetter(obj, name);
    } else if (typeof option.getter === 'function') {
      getter = option.getter;
    }
    if (!('setter' in option)) {
      setter = this.defaultSetter(obj, name);
    } else if (typeof option.setter === 'function') {
      setter = option.setter;
    }
    obj[name] = option.value;
    if (getter) {
      this.mixinGetter(obj, name, getter);
    }
    if (setter) {
      return this.mixinSetter(obj, name, setter);
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
    res = {};
    for (name in options) {
      option = options[name];
      this.mixinOption(res, name, option);
    }
    return res;
  }
};
