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

	debug = true,

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
		_registerListeners();
		_initModules(_soundHandler);
		state = _globalStateHandler.getGameState();
	},

	_initModules = function(_soundHandler) {
		_modelController = BlobApp.ModelController;
		_viewController = BlobApp.ViewController;
		_physicsHandler = BlobApp.PhysicsHandler;
		_levelloader = BlobApp.LevelLoader;
		_globalStateHandler = BlobApp.GlobalState;
		_soundHandler = BlobApp.SoundHandler;

		_globalStateHandler.init();
		_modelController.init(p1ID, p2ID, _soundHandler);
		_viewController.init();
		_physicsHandler.init();
		_levelloader.init(lID, overwID, _globalStateHandler);	
		_soundHandler.init();

		_connectModelAndViewEntities();	
	},

	_registerListeners = function() {
		$("body").on('onTick', _sceneUpdate);
		$("body").on('onReloadGame', _reload);
		$('body').on('onResetGame', _reset);
		$('body').on('levelLoadRequest', _onLevelLoadRequest);
		$('body').on('levelFinished', _saveGameProgress);
		$('body').on('onNewGameRequested', _startNewGame);
		$('body').on('onContinueGameRequested', _continueGame);
		// Connection between model and view:
		$('body').on('requestViewEntity', _onViewEntityRequested);
		$('body').on('connectToView', _connectSingleBodyToView);
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
		if(!debug){
			lID++;
			if(lID==6){
				lID=0;
			}
		} else {
			lID = 0;
		}
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
	}

	_onViewEntityRequested = function(event, data) {
		if(data.generic) {
			_viewController.createGenericEntity(data.x, data.y, data.positionInSprite);
		} else {
			_viewController.createEntity(data.x, data.y, data.entityID, data);
		}
	},

	_connectModelAndViewEntities = function() {
		viewEntities = _viewController.getViewEntities();
		physicsEntities = _physicsHandler.getBodies();

		connectedEntities = [];

		for(var i = 0; i < physicsEntities.length; i++) {
			var connectedEntity = _connectBodyToView(physicsEntities[i], physicsEntities[i].GetUserData()[0], viewEntities);
			if(connectedEntity) {
				connectedEntities.push(connectedEntity);
			}
		}

		_physicsHandler.createActors(connectedEntities);
	},

	_connectSingleBodyToView = function(event, data) {
		physicsBody = data.body;
		userData = physicsBody.GetUserData()[0];
		if(data.special) {
			userData = data.special;
		}
		viewEntities = _viewController.getViewEntities();
		_physicsHandler.createActors([_connectBodyToView(physicsBody, userData, viewEntities)]);
	},

	_connectBodyToView = function(physicsBody, userData, viewEntities) {
		var viewEntity;
		var expectedSpriteName;
		switch(userData) {
			case EntityConfig.REDBLOBID:
				expectedSpriteName = "blobRed";
				break;
			case EntityConfig.GREENBLOBID:
				expectedSpriteName = "blobGreen";
				break;
			case EntityConfig.MOVINGGROUNDID:
				expectedSpriteName = "movingGround";
				break;
			case "Heli":
				expectedSpriteName = "heli";
				break;
			case "Sphere":
				expectedSpriteName = "sphere";
				break;
			case "Bridge":
				expectedSpriteName = "bridge";
				break;
			case "Trampolin":
				expectedSpriteName = "trampolin";
				break;
			case "Stretch":
				expectedSpriteName = "stretch";
				break;
		}
		if(expectedSpriteName == undefined) return false;

		for(var i = 0; i < viewEntities.length; i++) {
			if(viewEntities[i].sprite.name == expectedSpriteName) {				
				viewEntity = viewEntities[i];
				break;
			}
		}
		if(!viewEntity) return false;
		return {
			body: physicsBody,
			sprite: viewEntity.sprite
		}
	};

	that.init = init;
	return that;
})();