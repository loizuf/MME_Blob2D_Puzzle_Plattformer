/*
	Overall Communication happens here. This Controller talks to sub-Controller for View and Model,
	and initializes them.
*/
BlobApp.MainController = (function() {
	var that = {},
	_modelController = null,
	_viewController = null,
	_physicsHandler = null,
	_levelloader = null,

	init = function(){
		_initModules();
		_registerListeners();
	},

	_initModules = function() {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_physicsHandler = BlobApp.PhysicsHandler;
		_levelloader = BlobApp.LevelLoader;

		_modelController.init();
		_viewController.init();
		_physicsHandler.init();
		_levelloader.init();
	},

	_registerListeners = function(){
		$("body").on('onTick', _sceneUpdate);
		$("body").on('onReloadGame', _reload);
		$('body').on('onResetGame', _reset);
	},

	_reload = function(){
		console.log("reloading game");
		_modelController = undefined,
		_levelloader = undefined;
		_modelController = BlobApp.ModelController;
		_levelloader = BlobApp.LevelLoader;
		_modelController.init();
		_levelloader.init();
	},

	_reset = function() {
		console.log("resetting game");
		
	}

	_sceneUpdate = function(){
		_physicsHandler.update();
		_viewController.update();
	};

	that.init = init;
	return that;
})();