appTest.controllerTest = (function() {
	var that = {},
	viewTest = null,
	physicsTest = null,

	$body = null,

	init = function() {
		$body = $('body');
		_initModules();
	},

	_initModules = function() {
		physicsTest = appTest.physicsTest.init();
		viewTest = appTest.viewTest.init();
	};

	that.init = init;
	return that;
})();