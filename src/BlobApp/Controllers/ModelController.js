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
		_screenStateHandler = BlobApp.ScreenState.init();
		_inputHandler = BlobApp.InputHandler.init();
		_blobPlayerOne = new BlobApp.BlobPlayer1();
		_blobPlayerTwo = new BlobApp.BlobPlayer2();
		
		_registerListener();
	},

	_registerListener = function() {
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

		$(_inputHandler).on("p1blobDeath",_onP1BlobDeath);
		$(_inputHandler).on("p2blobDeath",_onP2BlobDeath);
		$('body').on("blobEntityCreated",_onBlobEntityCreated);
		$('body').on('onReAllowJump', _reAllowJump);

		$('body').on("doorCreated", _onDoorCreated);


		$('body').on('onPlayerWaitingChange', _onPlayerWaitingChange)
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
	

	_reAllowJump = function(event, entity) {
		if(entity.GetUserData()[0] == EntityConfig.GREENBLOBID) {
			//console.log("p1 re allow jump");
			_blobPlayerOne.prototype.allowJump();
		} else {
			//console.log("p2 re allow jump");
			_blobPlayerTwo.prototype.allowJump();
		}
	},

	_onBlobEntityCreated = function(event, entity) {
		if(entity.GetUserData()[0] == EntityConfig.GREENBLOBID) {
			//console.log("p1 created");
			_blobPlayerOne.prototype.setEntity(entity);
		} else {
			//console.log("p2 created");
			_blobPlayerTwo.prototype.setEntity(entity);
		 }
	},

	_onPlayerWaitingChange = function(event, data) {
	//	console.log(data);

		player = (data.playerName == "p1")? _blobPlayerOne : _blobPlayerTwo;
		waiting = data.waiting;

		player.prototype.setWaitingForOther(waiting);

		if(waiting != false) {
			if(player == _blobPlayerOne) {
				if(waiting == _blobPlayerTwo.prototype.getWaitingForOther()) {
					console.log("Heli Trigger!!");
					$('body').trigger("startHeli");
				}
			} else {
				if(waiting == _blobPlayerOne.prototype.getWaitingForOther()) {
					console.log("Heli Trigger!!");
					$('body').trigger("startHeli");
				}
			}
		}
	};

	that.init = init;
	return that;
})();