
module.exports = {
  uppercaseFirstLetter: function(str) {
    return str.charAt(0).toUpperCase() + str.slice('1');
  },
  getterName: function(name) {
    return 'get' + this.uppercaseFirstLetter(name);
  },
  mixinFunction: function(obj, name, fn) {
    return obj[name] = fn;
  },
  defaultGetter: function(obj, name) {
    return function() {
      return obj[name];
    };
  },
  mixinGetter: function(obj, name, customGetter) {
    return obj[this.getterName(name)] = !customGetter ? this.defaultGetter(obj, name) : function() {
      return customGetter.call(obj);
    };
  },
  setterName: function(name) {
    return 'set' + this.uppercaseFirstLetter(name);
  },
  defaultSetter: function(obj, name) {
    return function(val) {
      return obj[name] = val;
    };
  },
  mixinSetter: function(obj, name, customSetter) {
    return obj[this.setterName(name)] = !customSetter ? this.defaultSetter(obj, name) : function(val) {
      return customSetter.call(obj, val);
    };
  },
  mixinGetterAndSetter: function(obj, name, customGetter, customSetter) {
    this.mixinGetter(obj, name, customGetter);
    return this.mixinSetter(obj, name, customSetter);
  },
  mixinValueGetterAndSetter: function(obj, name, value, customGetter, customSetter) {
    obj[name] = value;
    return this.mixinGetterAndSetter(obj, name, customGetter, customSetter);
  },
  mixinKeyValueOption: function(obj, name, option) {
    return this.mixinValueGetterAndSetter(obj, name, option);
  },
  mixinKeyObjectOption: function(obj, name, option) {
    if (!('value' in option)) {
      throw new Error("Option object need to have a 'value' key");
    }
    return this.mixinValueGetterAndSetter(obj, name, option.value, option.getter, option.setter);
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
