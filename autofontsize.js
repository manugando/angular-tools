angular.module('autofontsize', [])

.directive('autofontsize', function() {
	this.SCALE_FACTOR = 2;
	this.minFontSize = 1;

	this.hasOverflow = function(element) {
		var parent = element.parentElement;
		return parent.offsetHeight < parent.scrollHeight;
	};

	this.requestFunctionExecution = function(functionToExecute) {
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(functionToExecute);
		} else {
			setTimeout(functionToExecute, 0);
		}
	};

	this.scaleFontSize = function(element, currentFontSize, up) {
		var fontSize;
		if(up) {
			fontSize = currentFontSize + SCALE_FACTOR;
		} else {
			fontSize = currentFontSize - SCALE_FACTOR;
		}
		setFontSize(element, fontSize);
		return fontSize;
	};

	this.setFontSize = function(element, fontSize) {
		element.style.fontSize = fontSize + "px";
	};

	this.executeScaleDown = function(element, currentFontSize) {
		requestFunctionExecution(function() {
			currentFontSize = scaleFontSize(element, currentFontSize, false);
			var nextFontSize = currentFontSize - SCALE_FACTOR;
			if(hasOverflow(element) && nextFontSize >= minFontSize) {
				executeScaleDown(element, currentFontSize);
			} else {
				element.parentElement.className += " autofontsize-ready";
			}
		});
	};

	this.executeScaleUp = function(element, currentFontSize) {
		requestFunctionExecution(function() {
			currentFontSize = scaleFontSize(element, currentFontSize, true);
			if(!hasOverflow(element)) {
				executeScaleUp(element, currentFontSize);
			} else {
				executeScaleDown(element, currentFontSize);
			}
		});
	};

	this.adjustFontSize = function(element, defaultFontSize) {
		var currentFontSize = defaultFontSize;
		setFontSize(element, currentFontSize);

		var scaleDown = hasOverflow(element);
		if(scaleDown) {
			executeScaleDown(element, currentFontSize);
		} else {
			executeScaleUp(element, currentFontSize);
		}
	};

	this.onReady = function(element, attrs) {
		var defaultFontSize = parseInt(attrs.defaultfontsize);
		this.minFontSize = parseInt(attrs.minfontsize);
		adjustFontSize(element, defaultFontSize);
	};

	return {
		restrict: 'A',
		scope: {
			defaultfontsize: '=',
			minfontsize: '='
		},
		link: function(scope, element, attrs, controllers) {
			element.ready(function() {
				onReady(element[0], attrs);
			});
		}
	};
});
