/*
	This Controller handles the Interaction with all modules of the Model and initializes them.
*/
BlobApp.ModelController = (function() {
	var that = {},
	//_blobPlayerOne = BlobApp.BlobOne.init();
	//_blobPlayerTwo = BlobApp.BlobTwo.init();

	init = function() {
		_registerListener();
		//Initialize all Modules from Model
		//Initialize Box2D Engine
		//Inform Maincontroller when finished
	},

	_registerListener = function() {
		$(that).on("p1ArrowUp",_onP1ArrowUp);
		$(that).on("p1ArrowRightStarted",_onP1ArrowRightStarted);
		$(that).on("p1ArrowLeftStarted",_onP1ArrowLeftStarted);
		$(that).on("p1ArrowDown",_onP1ArrowDown);
		$(that).on("p2ArrowUp",_onP2ArrowUp);
		$(that).on("p2ArrowRightStarted",_onP2ArrowRightStarted);
		$(that).on("p2ArrowLeftStarted",_onP2ArrowLeftStarted);
		$(that).on("p2ArrowDown",_onP2ArrowDown);
		$(that).on("p1ArrowRightStopped",_onP1ArrowRightStopped);
		$(that).on("p1ArrowLeftStopped",_onP1ArrowLeftStopped);
		$(that).on("p2ArrowRightStopped",_onP2ArrowRightStopped);
		$(that).on("p2ArrowLeftStopped",_onP2ArrowLeftStopped);
	},

	_onP1ArrowUp = function() {
		//_blobPlayerOne.onUpPressed();
	},

	_onP1ArrowRightStarted = function() {
		//_blobPlayerOne.onRightPressed();	
	},

	_onP1ArrowLeftStarted = function() {
		//_blobPlayerOne.onLeftPressed();		
	},

	_onP1ArrowDown = function() {
		//_blobPlayerOne.onDownPressed();
	},

	_onP2ArrowUp = function() {
		//_blobPlayerTwo.onUpPressed();
	},

	_onP2ArrowRightStarted = function() {
		//_blobPlayerTwo.onRightPressed();
	},

	_onP2ArrowLeftStarted = function() {
		//_blobPlayerTwo.onLeftPressed();
	},

	_onP2ArrowDown = function() {
		//_blobPlayerTwo.onDownPressed();
	},

	_onP1ArrowRightStopped = function() {
		
	},

	_onP1ArrowLeftStopped = function() {
		
	},

	_onP2ArrowRightStarted = function() {
		
	},

	_onP2ArrowLeftStopped = function() {
		
	},

	that.init = init;
	return that;
})();