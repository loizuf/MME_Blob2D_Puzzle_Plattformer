/*
	Overall Communication happens here. This Controller talks to sub-Controller for View and Model,
	and initializes them.
*/
BlobApp.MainController = (function() {
	var that = {},
	_modelController = null,
	_viewController = null,

	init = function(){
		_initModules();
	},

	_initModules = function() {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_modelController.init();
		_viewController.init();
	};

	that.init = init;
	return that;
})();