angular.module('imageonload', [])

.directive('imageonload', function($parse) {
	return {
		restrict: 'A',
		scope: {
			imageonloadcallback : '='
		},
		link: function(scope, element, attrs, controllers) {
			element.bind('load', function() {
				scope.imageonloadcallback(true);
			});
			element.bind('error', function() {
				scope.imageonloadcallback(false);
			});
		}
	};
});