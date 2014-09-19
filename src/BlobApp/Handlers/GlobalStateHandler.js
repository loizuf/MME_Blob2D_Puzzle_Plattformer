BlobApp.GlobalState = (function() {
	// public interface
	var that = {},
	
	_gameStateKey = "gameState",

	_gameState = {
		currentOverworldMapID : 1, //integer
		currentLevel : 1
	},

	init = function() {
		_load();

		return that;
	},

	_load = function() {
		if(localStorage.getItem(_gameStateKey) != null) {
			_gameState = JSON.parse(localStorage.getItem(_gameStateKey));
		} else {
			_save();
		}		
	},

	// Has to be called when the level is finished.
	onFinishLevel = function(levelID, overworldID) {
		if(overworldID == _gameState.currentOverworldMapID && levelID == _gameState.currentLevel){
			_setNewGameState(levelID, overworldID);
		}
	},

	onResetGameState = function() {
		_gameState.currentOverworldMapID = 1;
		_gameState.currentLevel = 1;
		_save();

		return _gameState;
	},

	_setNewGameState = function(levelId, overworldID) {
		levelId++;
		if(levelId == 6){
			overworldID++;
			levelId =1 ;
		}
		
		_gameState.currentOverworldMapID = overworldID;
		_gameState.currentLevel = levelId;
		_save();
	},

	getGameState = function() {
		return _gameState;
	},

	_save = function() {
		localStorage.setItem(_gameStateKey, JSON.stringify(_gameState));
	};

	that.init = init;
	that.onFinishLevel = onFinishLevel;
	that.getGameState = getGameState;
	that.onResetGameState = onResetGameState;

	return that;
})();