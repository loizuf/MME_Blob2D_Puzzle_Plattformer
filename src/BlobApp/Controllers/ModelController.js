/*
	This Controller handles the Interaction with all modules of the Model and initializes them.
*/
BlobApp.ModelController = (function() {

	var that = {},

	thisVar = this,

	_blobPlayerOne,
	_blobPlayerTwo,
	_screenStateHandler,
	_inputHandler,

	player1BridgeDisassemblyDirection,
	player2BridgeDisassemblyDirection,

	slingshotAbilityAngle = 1,
	slingshotAbilityTension = 0,

	init = function(p1ControlsID, p2ControlsID) {
		//Initialize all Modules from Model
		//Initialize Box2D Engine
		//Inform Maincontroller when finished

		//_blobPlayerOne = BlobApp.BlobOne.init();
		//_blobPlayerTwo = BlobApp.BlobTwo.init();
		_screenStateHandler = BlobApp.ScreenState.init();
		_inputHandler = BlobApp.InputHandler.init(p1ControlsID, p2ControlsID);
		_soundHandler = BlobApp.SoundHandler.init();

		_blobPlayerOne = new BlobApp.BlobPlayer1();
		_blobPlayerTwo = new BlobApp.BlobPlayer2();
		
		_registerListener();
	},

	_registerListener = function() {
		$(thisVar).on("onDirectionChosen", _onBridgeDisassembleChoice);

		$(_inputHandler).unbind();

		$(_inputHandler).on("p1ArrowUpStarted",_onP1ArrowUpStarted);
		$(_inputHandler).on("p1ArrowRightStarted",_onP1ArrowRightStarted);
		$(_inputHandler).on("p1ArrowLeftStarted",_onP1ArrowLeftStarted);
		$(_inputHandler).on("p1ArrowDownStarted",_onP1ArrowDownStarted);

		$(_inputHandler).on("p2ArrowUpStarted",_onP2ArrowUpStarted);
		$(_inputHandler).on("p2ArrowRightStarted",_onP2ArrowRightStarted);
		$(_inputHandler).on("p2ArrowLeftStarted",_onP2ArrowLeftStarted);
		$(_inputHandler).on("p2ArrowDownStarted",_onP2ArrowDownStarted);

		$(_inputHandler).on("p1ArrowUpStopped",_onP1ArrowUpStopped);
		$(_inputHandler).on("p1ArrowRightStopped",_onP1ArrowRightStopped);
		$(_inputHandler).on("p1ArrowLeftStopped",_onP1ArrowLeftStopped);
		$(_inputHandler).on("p1ArrowDownStopped",_onP1ArrowDownStopped);

		$(_inputHandler).on("p2ArrowUpStopped",_onP2ArrowUpStopped);
		$(_inputHandler).on("p2ArrowRightStopped",_onP2ArrowRightStopped);
		$(_inputHandler).on("p2ArrowLeftStopped",_onP2ArrowLeftStopped);
		$(_inputHandler).on("p2ArrowDownStopped",_onP2ArrowDownStopped);
		$(_inputHandler).on("p2ButtonMashEvent",_onP2ButtonMashEvent);

		$(_inputHandler).on("p1blobDeath",_onP1BlobDeath);
		$(_inputHandler).on("p2blobDeath",_onP2BlobDeath);

		$(_inputHandler).on("onPauseScreenRequested", _pauseGame);

		$('body').on("onProceedingRequested", _proceedGame);
		$('body').on("blobEntityCreated",_onBlobEntityCreated);
		$('body').on('onReAllowJump', _reAllowJump);
		$('body').on("doorCreated", _onDoorCreated);
		$('body').on('onPlayerWaitingChange', _onPlayerWaitingChange);
		$('body').on('onKeyPickedUp', _onKeyPickedUp);
		$('body').on('blobFinishAttempt', _onBlobFinishAttempt);

		//Menu related listener
		$('body').on('newGameRequest', _onNewGameRequest);
		//$('body').on('levelFinished', _onLevelFinished);

		$('body').on('specialFinished', _onSpecialFinished);

		$('body').on('onStartLocationRequestedPlayer1', _setBridgeDisassemblyDirectionPlayer1);
		$('body').on('onEndLocationRequestedPlayer1', _setBridgeDisassemblyDirectionPlayer1);

		$('body').on('onStartLocationRequestedPlayer2', _setBridgeDisassemblyDirectionPlayer2);
		$('body').on('onEndLocationRequestedPlayer2', _setBridgeDisassemblyDirectionPlayer2);

		$('body').on('onSlingshotAngleChange', _storeSlingshotAngle);
		$('body').on('onSlingshotTensionChange', _storeSlingshotTension);

		$('body').on('onSlingshotRelease', _setSlingshotReleaseForce);
		$('body').on('playerOnSpikes', _onPlayerOnSpikes);
	},

	_onPlayerOnSpikes = function(event, blobID) {
		if(blobID == EntityConfig.GREENBLOBID){
			_screenStateHandler.onPlayerDead("p1");
		} else {
			_screenStateHandler.onPlayerDead("p2");
		}
	},

	_storeSlingshotAngle = function(event, data) {
		slingshotAbilityAngle = data.angle;
	},

	_storeSlingshotTension = function(event, data) {
		slingshotAbilityTension = data.tension;	
	},

	_setSlingshotReleaseForce = function() {
		$('body').trigger('onSlingshotShot', {"force": slingshotAbilityTension, "angle": slingshotAbilityAngle});
	},

	_setBridgeDisassemblyDirectionPlayer1 = function(event, data) {
		player1BridgeDisassemblyDirection = data.dir;
		$(thisVar).trigger('onDirectionChosen');
	},

	_setBridgeDisassemblyDirectionPlayer2 = function(event, data) {
		player2BridgeDisassemblyDirection = data.dir;
		$(thisVar).trigger('onDirectionChosen');
	},

	_onKeyPickedUp = function(event, data) {
		_screenStateHandler.onPickupKey();
	},

	_onBlobFinishAttempt = function(event, blobID) {
		_screenStateHandler.onPlayerReachGoal(blobID);
	},

	_onNewGameRequest = function(event, blobID) {
		if(blobID == EntityConfig.GREENBLOBID){
			_screenStateHandler.onPlayerRequestsNewGame("p1");
		} else {
			_screenStateHandler.onPlayerRequestsNewGame("p2");
		}
	},

	_proceedGame = function() {
		$('body').trigger('onUnpause');
	},

	_pauseGame = function() {
		$('body').trigger('onPause');
	},

	_onDoorCreated = function(event, data){
		_screenStateHandler.doorCreated(data.doorNumber, data.buttonNumber);
	}

	_onP1ArrowUpStarted = function() {
		_blobPlayerOne.prototype.onUpPressed(true);
	},

	_onP1ArrowRightStarted = function() {
		_blobPlayerOne.prototype.onRightPressed(true);
	},

	_onP1ArrowLeftStarted = function() {
		_blobPlayerOne.prototype.onLeftPressed(true);
	},

	_onP1ArrowDownStarted = function() {
		_blobPlayerOne.prototype.onDownPressed(true);
	},


	_onP1ArrowUpStopped = function() {
		_blobPlayerOne.prototype.onUpPressed(false);
	},

	_onP1ArrowRightStopped = function() {
		_blobPlayerOne.prototype.onRightPressed(false);
	},

	_onP1ArrowLeftStopped = function() {
		_blobPlayerOne.prototype.onLeftPressed(false);
	},

	_onP1ArrowDownStopped = function() {
		_blobPlayerOne.prototype.onDownPressed(false);
	},

	_onP1BlobDeath = function() {
		_screenStateHandler.onPlayerDead("p1");
	},


	_onP2ArrowUpStarted = function() {
		_blobPlayerTwo.prototype.onUpPressed(true);
	},

	_onP2ArrowRightStarted = function() {
		_blobPlayerTwo.prototype.onRightPressed(true);
	},

	_onP2ArrowLeftStarted = function() {
		_blobPlayerTwo.prototype.onLeftPressed(true);
	},

	_onP2ArrowDownStarted = function() {
		_blobPlayerTwo.prototype.onDownPressed(true);
	},
	

	_onP2ArrowUpStopped = function() {
		_blobPlayerTwo.prototype.onUpPressed(false);
	},

	_onP2ArrowRightStopped = function() {
		_blobPlayerTwo.prototype.onRightPressed(false);
	},

	_onP2ArrowLeftStopped = function() {
		_blobPlayerTwo.prototype.onLeftPressed(false);
	},

	_onP2ArrowDownStopped = function() {
		_blobPlayerTwo.prototype.onDownPressed(false);
	},

	_onP2BlobDeath = function() {
		_screenStateHandler.onPlayerDead("p2");
	},

	_onP2ButtonMashEvent = function() {
		_blobPlayerTwo.prototype.onButtonMash();
	}
	

	_reAllowJump = function(event, entity) {
		if(entity.GetUserData()[0] == EntityConfig.GREENBLOBID) {
			_blobPlayerOne.prototype.allowJump();
		} else {
			_blobPlayerTwo.prototype.allowJump();
		}
	},

	_onBlobEntityCreated = function(event, entity) {
		if(entity.GetUserData()[0] == EntityConfig.GREENBLOBID) {
			_blobPlayerOne.prototype.setEntity(entity);
		} else {
			_blobPlayerTwo.prototype.setEntity(entity);
		 }
	},

	_onPlayerWaitingChange = function(event, data) {
		console.log("onPlayerWaitingChange", data);
		player = (data.playerName == "p1") ? _blobPlayerOne : _blobPlayerTwo;
		waiting = data.waiting;

		player.prototype.setWaitingForOther(waiting);

		if(waiting != false) {
			if(player == _blobPlayerOne) {
				if(waiting == _blobPlayerTwo.prototype.getWaitingForOther()) {
					_startSpecial(waiting);
				}
			} else {
				if(waiting == _blobPlayerOne.prototype.getWaitingForOther()) {	
					_startSpecial(waiting);			
				}
			}
		}
	},

	_onBridgeDisassembleChoice = function() {
		if(player1BridgeDisassemblyDirection != null && player2BridgeDisassemblyDirection != null) {
			if(player1BridgeDisassemblyDirection === "left" && player2BridgeDisassemblyDirection === "left") {
				$('body').trigger('onBridgeDirectionChosen', {"animationKey": AnimationKeys.STOP, "direction" : "left"});
				$('body').trigger("disableAllMovements");
			} else if(player1BridgeDisassemblyDirection === "right" && player2BridgeDisassemblyDirection === "right") {
				$('body').trigger('onBridgeDirectionChosen', {"animationKey": AnimationKeys.STOP, "direction" : "right"});
				$('body').trigger("disableAllMovements");
			}
		}
	},

	_startSpecial = function(specialName) {
		if(specialName == "heli") {
			$('body').trigger("startHeli");
			_inputHandler.changeControls();
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "tele") {
			$('body').trigger("startTele");
			$('body').trigger("disableAllMovements");
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "bridgeLeft") {
			$('body').trigger("startBridge", {"direction": "left"});
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "bridgeRight") {
			$('body').trigger("startBridge", {"direction": "right"});
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "sphere") {
			$('body').trigger("startSphere");
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "slingshotLeft") {
			$('body').trigger('startSlingshot', {"direction": "left"});
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		} else if(specialName == "slingshotRight") {
			$('body').trigger('startSlingshot', {"direction": "right"});
			console.log("_startSpecial");
			_blobPlayerOne.prototype.setWaitingForOther(false);
			_blobPlayerTwo.prototype.setWaitingForOther(false);
		}
	},

	_onSpecialFinished = function(event, data) {
		if(data.specialName == "heli") {
			_inputHandler.changeControls();
		}
	};

	that.init = init;
	return that;
})();