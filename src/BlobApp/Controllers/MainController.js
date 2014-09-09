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
	_soundHandler = null,
	
	lID,
	overwID,
	p1ID,
	p2ID,

	init = function(lvlID, overID, p1ControlsID, p2ControlsID) {

		lID = lvlID;
		overwID = overID;
		p1ID = p1ControlsID;
		p2ID = p2ControlsID;
		Controls.p1 = p1ControlsID;
		Controls.p2 = p2ControlsID;
		$('body').on("doneLoading", continueWithStuff);
		_soundHandler = BlobApp.SoundHandler;
		_soundHandler.loadAssets();
		
		
	},

	continueWithStuff = function(){
		console.log('meep');
		_initModules(_soundHandler);
		_registerListeners();
		state = _globalStateHandler.getGameState();
	},

	_initModules = function(_soundHandler) {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_physicsHandler = BlobApp.PhysicsHandler;
		_levelloader = BlobApp.LevelLoader;
		_globalStateHandler = BlobApp.GlobalState;

		_globalStateHandler.init();
		_modelController.init(p1ID, p2ID, _soundHandler);
		_viewController.init();
		_physicsHandler.init();
		_levelloader.init(lID, overwID, _globalStateHandler);		
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
		lID = state.currentLevel;
		overwID = state.currentOverworldMapID;
		$('body').trigger('levelLoadRequest', {lvlID:0, owID:overwID});
	},	

	_startNewGame = function() {
		_globalStateHandler.onResetGameState();
		$('body').trigger('levelLoadRequest', {lvlID:0, owID:1});
	},

	_saveGameProgress = function() {
		_globalStateHandler.onFinishLevel(lID, overwID);
		lID = 0;
	},

	_onLevelLoadRequest = function(event, IDS) {
		lID = IDS.lvlID;
		overwID = IDS.owID;
	},

	_reload = function() {
		$('body').unbind();
		_registerListeners();

		setTimeout(function(){_initModules(_soundHandler);}, 1);
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