/*
	This Controller handles the Interaction with all modules of the Model and initializes them.
*/
BlobApp.ModelController = (function() {
	var that = {},

	init = function() {
		_registerListener();
		//Initialize all Modules from Model
		//Initialize Box2D Engine
		//Inform Maincontroller when finished
	},

	_registerListener = function() {
		$(that).on("p1Jumped",_onP1Jumped);
		$(that).on("p1RightStarted",_onP1RightStarted);
		$(that).on("p1LeftStarted",_onP1LeftStarted);
		$(that).on("p1Trigger",_onP1Trigger);
		$(that).on("p2Jumped",_onP2Jumped);
		$(that).on("p2RightStarted",_onP2RightStarted);
		$(that).on("p2LeftStarted",_onP2LeftStarted);
		$(that).on("p2Trigger",_onP2Trigger);
		$(that).on("p1RightStopped",_onP1RightStopped);
		$(that).on("p1LeftStopped",_onP1LeftStopped);
		$(that).on("p2RightStopped",_onP2RightStopped);
		$(that).on("p2LeftStopped",_onP2LeftStopped);
	},

	_onP1Jumped = function() {
		
	},

	_onP1RightStarted = function() {
		
	},

	_onP1LeftStarted = function() {
		
	},

	_onP1Trigger = function() {
		
	},

	_onP2Jumped = function() {
		
	},

	_onP2RightStarted = function() {
		
	},

	_onP2LeftStarted = function() {
		
	},

	_onP2Trigger = function() {
		
	},

	_onP1RightStopped = function() {
		
	},

	_onP1LeftStopped = function() {
		
	},

	_onP2RightStarted = function() {
		
	},

	_onP2LeftStopped = function() {
		
	},

	that.init = init;
	return that;
})();