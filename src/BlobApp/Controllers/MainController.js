/*
	Overall Communication happens here. This Controller talks to sub-Controller for View and Model,
	and initializes them.
*/
BlobApp.MainController = (function() {
	var that = {},
	_modelController = null,
	_viewController = null,
	_physicsHandler = null,

	init = function(){
		_initModules();
		_registerListeners();
	},

	_initModules = function() {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_physicsHandler = BlobApp.PhysicsHandler;
		_modelController.init();
		_viewController.init();
		_physicsHandler.init();
		_levelloader = BlobApp.LevelLoader;
		_levelloader.init();
	},

	_registerListeners = function(){
		$(_viewController).on('onTick', _sceneUpdate());
	},

	_sceneUpdate = function(){
		_physicsHandler.update();
		_viewController.update();
	};

	that.init = init;
	return that;
})();