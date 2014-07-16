/*
	This Controller handles the Interaction with all modules of the Model and initializes them.
*/
BlobApp.ModelController = (function() {
	var that = {},
	_blobPlayerOne,
	_blobPlayerTwo,
	_screenStateHandler,
	_inputHandler,

	init = function() {
		//Initialize all Modules from Model
		//Initialize Box2D Engine
		//Inform Maincontroller when finished

		//_blobPlayerOne = BlobApp.BlobOne.init();
		//_blobPlayerTwo = BlobApp.BlobTwo.init();
		//_screenStateHandler = BlobApp.ScreenState.init();
		_inputHandler = BlobApp.InputHandler.init();
		_blobPlayerOne = new BlobApp.BlobPlayer1();
		
		_registerListener();
		console.log(_blobPlayerOne);
	},

	_registerListener = function() {
		$(_inputHandler).on("p1ArrowUp",_onP1ArrowUp);
		$(_inputHandler).on("p1ArrowRightStarted",_onP1ArrowRightStarted);
		$(_inputHandler).on("p1ArrowLeftStarted",_onP1ArrowLeftStarted);
		$(_inputHandler).on("p1ArrowDown",_onP1ArrowDown);
		$(_inputHandler).on("p2ArrowUp",_onP2ArrowUp);
		$(_inputHandler).on("p2ArrowRightStarted",_onP2ArrowRightStarted);
		$(_inputHandler).on("p2ArrowLeftStarted",_onP2ArrowLeftStarted);
		$(_inputHandler).on("p2ArrowDown",_onP2ArrowDown);
		$(_inputHandler).on("p1ArrowRightStopped",_onP1ArrowRightStopped);
		$(_inputHandler).on("p1ArrowLeftStopped",_onP1ArrowLeftStopped);
		$(_inputHandler).on("p2ArrowRightStopped",_onP2ArrowRightStopped);
		$(_inputHandler).on("p2ArrowLeftStopped",_onP2ArrowLeftStopped);
		$(_inputHandler).on("p1blobDeath",_onP1BlobDeath);
		$(_inputHandler).on("p2blobDeath",_onP2BlobDeath);
		$('body').on("blobEntityCreated",_onBlobEntityCreated);
	},

	_onP1ArrowUp = function() {
		_blobPlayerOne.prototype.onUpPressed();
	},

	_onP1ArrowRightStarted = function() {
		_blobPlayerOne.prototype.onRightPressed();	
	},

	_onP1ArrowLeftStarted = function() {
		console.log("leftEvent in controller");
		_blobPlayerOne.prototype.onLeftPressed();		
	},

	_onP1ArrowDown = function() {
		_blobPlayerOne.prototype.onDownPressed();
	},

	_onP2ArrowUp = function() {
		_blobPlayerTwo.prototype.onUpPressed();
	},

	_onP2ArrowRightStarted = function() {
		_blobPlayerTwo.prototype.onRightPressed();
	},

	_onP2ArrowLeftStarted = function() {
		_blobPlayerTwo.prototype.onLeftPressed();
	},

	_onP2ArrowDown = function() {
		_blobPlayerTwo.prototype.onDownPressed();
	},

	_onP1ArrowRightStopped = function() {
		
	},

	_onP1ArrowLeftStopped = function() {
		
	},

	_onP2ArrowRightStarted = function() {
		
	},

	_onP2ArrowRightStopped = function() {
		
	},

	_onP2ArrowLeftStopped = function() {
		
	},

	_onP1BlobDeath = function() {
		_screenStateHandler.onPlayerDead("p1");
	},

	_onP2BlobDeath = function() {
		_screenStateHandler.onPlayerDead("p2");
	},

	_onBlobEntityCreated = function(event, entity) {
		console.log("entity im modelcontroller");
		_blobPlayerOne.prototype.setEntity(entity);
	};

	that.init = init;
	return that;
})();