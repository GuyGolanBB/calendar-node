'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }).
  filter('isEmptyObject', function() {
		return function(obj) {
			var name;
			for(name in obj) {
				return false;
			}
			return true;
		};
	});
