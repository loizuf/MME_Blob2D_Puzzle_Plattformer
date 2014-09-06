/*
	Overall Communication happens here. This Controller talks to sub-Controller for View and Model,
	and initializes them.
*/
BlobApp.MainController = (function() {
	var that = {},
	
	_globalStateHandler = null,
	_modelController = null,
	_viewController = null,
	_physicsHandler = null,
	_levelloader = null,
	
	lID,
	//owID,
	p1ID,
	p2ID,

	init = function(lvlID, p1ControlsID, p2ControlsID) {
		localStorage.clear();

		lID = lvlID;
		p1ID = p1ControlsID;
		p2ID = p2ControlsID;
		Controls.p1 = p1ControlsID;
		Controls.p2 = p2ControlsID;

		_initModules();
		_registerListeners();
	},

	_initModules = function() {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_physicsHandler = BlobApp.PhysicsHandler;
		_levelloader = BlobApp.LevelLoader;
		_globalStateHandler = BlobApp.GlobalState;

		_globalStateHandler.init();
		_modelController.init(p1ID, p2ID);
		_viewController.init();
		_physicsHandler.init();
		console.log(lID, _globalStateHandler, _levelloader);
		_levelloader.init(lID, _globalStateHandler);		
	},

	_registerListeners = function() {
		$("body").on('onTick', _sceneUpdate);
		$("body").on('onReloadGame', _reload);
		$('body').on('onResetGame', _reset);
		$('body').on('levelLoadRequest', _onLevelLoadRequest);
		$('body').on('levelFinished', _saveGameProgress);
		$('body').on('onNewGameRequested', _startNewGame);
		$('body').on('onContinueGameRequested', _continueGame);
	},

	_continueGame = function() {
		var state = _globalStateHandler.getGameState();

		lID = state.finishedLevel;
		//owID = state.currentOverWorldMapID;
	},	

	_startNewGame = function() {
		_globalStateHandler.onFinishLevel(1, 1);
	},

	_saveGameProgress = function() {
		_globalStateHandler.onFinishLevel(lID, 1);
	},

	_onLevelLoadRequest = function(event, LevelID) {
		lID = LevelID;
	},

	_reload = function() {
		$('body').unbind();
		_registerListeners();

		setTimeout(function(){_initModules();}, 1);
	},

	_reset = function() {
		console.log("resetting game", "empty function");
	},

	_sceneUpdate = function(){
		_physicsHandler.update();
		_viewController.update();
	};

	that.init = init;
	return that;
})();