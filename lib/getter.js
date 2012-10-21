var Unterproto;

Unterproto = require('unterproto');

module.exports = Unterproto.inherits({
  uppercaseFirstLetter: function(str) {
    return str.charAt(0).toUpperCase() + str.slice('1');
  },
  getterName: function(name) {
    return 'get' + this.uppercaseFirstLetter(name);
  },
  defaultGetter: function(obj, name) {
    return function() {
      return obj[name];
    };
  },
  mixinGetter: function(obj, name) {
    return obj[this.getterName(name)] = this.defaultGetter(obj, name);
  },
  setterName: function(name) {
    return 'set' + this.uppercaseFirstLetter(name);
  },
  defaultSetter: function(obj, name) {
    return function(val) {
      return obj[name] = val;
    };
  },
  mixinSetter: function(obj, name) {
    return obj[this.setterName(name)] = this.defaultSetter(obj, name);
  },
  factory: function(options) {
    var name, option, res, _fn,
      _this = this;
    res = {};
    _fn = function(name, option) {
      res[name] = options[name];
      _this.mixinGetter(res, name);
      return _this.mixinSetter(res, name);
    };
    for (name in options) {
      option = options[name];
      _fn(name, option);
    }
    return res;
  }
});
