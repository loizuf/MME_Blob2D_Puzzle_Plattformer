BlobApp.GlobalState = (function() {
	// public interface
	var that = {},
	
	_gameStateKey = "gameState",

	
	_gameState = {
		currentOverworldMapID : null, //integer
		finishedLevel : null
	},

	init = function() {
		_load();

		return that;
	},

	_load = function() {
		_gameState = JSON.parse(localStorage.getItem(_gameStateKey));
	},

	// Has to be called when the level is finished.
	onFinishLevel = function(levelId, overworldID) {
		_gameState.currentOverworldMapID = overworldID;
		_gameState.finishedLevel = levelId;
		_save();
	},

	getGameState = function() {
		return _gameState;
	}

	_save = function() {
		localStorage.setItem(_gameStateKey, JSON.stringify(_gameState));
	};

	that.init = init;
	that.onFinishLevel = onFinishLevel;
	that.getGameState = getGameState;

	return that;
})();