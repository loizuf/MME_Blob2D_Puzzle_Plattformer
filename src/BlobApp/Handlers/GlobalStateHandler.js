/*
	The GlobalState module loads the players' current state from the localStorage object.
	Basically, it finds out which levels the players have completed and thus decides which abilities they have unlocked.
	The current Level and Screen are saved.

	The GlobalState also includes any settings.

	It saves all those things, too.
*/
BlobApp.GlobalState = (function() {
	// public interface
	var that = {},
	
	_gameStateKey = "gameState";

	/*
		The _gameState object contains basically everything that this class saves / loads from the storage
		(it gets saved directly). 
	*/
	_gameState = {
		finishedLevels : [], // Array of all the levels the players have completed.
		unlockedSkills : [], // Array of all the skills the players have. TODO This data comes from the blobs.
		settings : [], // Array of settings.
		currentLevel : null, // The current level (null if in level selection screen)
		currentScreen : null // The current screen in the current level (null if in level selection screen) 
	},

	init = function() {
		_load();

		return that;
	},

	_load = function() {
		_gameState = JSON.parse(localStorage.getItem(_gameStateKey));
	},

	// Has to be called when the level is finished.
	onFinishLevel = function(levelId) {
		_gameState.finishedLevels.push(levelId);
		_gameState.currentLevel = null;
		_gameState.currentScreen = null;
		_save();
	},

	// Has to be called when a skill is unlocked.
	onUnlockSkill = function(skillId) {
		_gameState.unlockedSkills.push(skillId);
		_save();
	},

	// Has to be called when the settings change.
	// Settings should be an array / Object (has yet to be implemented, TODO)
	onSettingsChange = function(newSettings) {
		settings = newSettings;
		_save();
	},

	// Has to be called when the players start a new level.
	// Does not have to be called with "null" when they finish it, the reset happens automatically in onFinishLevel.
	setCurrentLevel = function(currentLevelId) {
		_gameState.currentLevel = currentLevelId;
		_save();
	},

	// Has to be called when the players enter a new screen.
	// Does not have to be called with "null" when they finish it, the reset happens automatically in onFinishLevel.
	setCurrentScreen = function(currentScreenNum) {
		_gameState.currentScreen = currentScreenNum;
		_save();
	},

	/*
		TODO a real public interface has yet to be made, i.e. where you can get _just_ the skills, the current level etc.
	*/
	getGameState = function() {
		return _gameState;
	}

	// Saves the current game state. Automatically called after every change.
	_save = function() {
		localStorage.setItem(_gameStateKey, JSON.stringify(_gameState));
	};

	that.init = init;
	that.onFinishLevel = onFinishLevel;
	that.onUnlockSkill = onUnlockSkill;
	that.onSettingsChange = onSettingsChange;
	that.setCurrentLevel = setCurrentLevel;
	that.setCurrentScreen = setCurrentScreen;
	that.getGameState = getGameState;

	return that;
})();