// From: github.com/tc39/proposal-object-values-entries
'use strict';
(function(Object) {
  var reduce = Function.bind.call(Function.call, Array.prototype.reduce);
  var isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  var concat = Function.bind.call(Function.call, Array.prototype.concat);
  // var keys = Reflect.ownKeys;

  if (!Object.values) {
    Object.values = function(O) {
      return reduce(Object.keys(O), function(v, k) {
        return concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []);
      }, []);
    };
  }

  if (!Object.entries) {
    Object.entries = function(O) {
      return reduce(Object.keys(O), function(e, k) {
        return concat(e, typeof k === 'string' && isEnumerable(O, k) ? [[k, O[k]]] : []);
      }, []);
    };
  }

  window.Object = Object;
})(window.Object);