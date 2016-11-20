angular.module('autofontsize', [])

.directive('autofontsize', function() {
	this.SCALE_FACTOR = 2;

	this.hasOverflow = function(element) {
		var parent = element.parentElement;
		return parent.offsetHeight < parent.scrollHeight;
	}

	this.requestFunctionExecution = function(functionToExecute) {
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(functionToExecute);
		} else {
			setTimeout(functionToExecute, 0);
		}
	}

	this.scaleFontSize = function(element, currentFontSize, up) {
		if(up) {
			var fontSize = currentFontSize + SCALE_FACTOR;
		} else {
			var fontSize = currentFontSize - SCALE_FACTOR;
		}
		setFontSize(element, fontSize);
		return fontSize;
	}

	this.setFontSize = function(element, fontSize) {
		element.style.fontSize = fontSize + "px";
	}

	this.executeScaleDown = function(element, currentFontSize) {
		requestFunctionExecution(function() {
			currentFontSize = scaleFontSize(element, currentFontSize, false);
			if(hasOverflow(element)) {
				executeScaleDown(element, currentFontSize);
			} else {
				element.parentElement.className += " autofontsize-ready";
			}
		});
	}

	this.executeScaleUp = function(element, currentFontSize) {
		requestFunctionExecution(function() {
			currentFontSize = scaleFontSize(element, currentFontSize, true);
			if(!hasOverflow(element)) {
				executeScaleUp(element, currentFontSize);
			} else {
				executeScaleDown(element, currentFontSize);
			}
		});
	}

	this.adjustFontSize = function(element, defaultFontSize) {
		var currentFontSize = defaultFontSize;
		setFontSize(element, currentFontSize);

		var scaleDown = hasOverflow(element);
		if(scaleDown) {
			executeScaleDown(element, currentFontSize);
		} else {
			executeScaleUp(element, currentFontSize);
		}
	}

	return {
		restrict: 'A',
		scope: {
			defaultfontsize: '='
		},
		link: function(scope, element, attrs, controllers) {
			element.ready(function() {
				var defaultFontSize = parseInt(attrs.defaultfontsize);
				adjustFontSize(element[0], defaultFontSize);
			});
		}
	};
});