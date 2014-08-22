BlobApp.BlobPlayer2 = (function() {	
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isStretched = false;

	this.setup = function() {	
		_initListeners();

		prototypeVar.setCurrentDown(function() {
			thisVar.initStretch();
		});
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("redBlobInTriggerZone", _setDownAction);
		$('body').on("redBlobLeftTriggerZone", _setDownAction);
		$('body').on('heliStopRequested', _resetControls);
		$('body').on('bridgeStopRequested', _resetControls);
		$('body').on('stretchInitRequested', _setStretch);

		$('body').on('startTele', thisVar.initTele);
		$('body').on('physTeleportFinished', _resetControls);

		$('body').on('startBridge', thisVar.initBridge);
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
				thisVar.setIdle(skill);
			break;

			case "tele":
				thisVar.setIdle(skill);
			break;

			case "bridgeLeft":
				thisVar.setIdle(skill);
			break;

			case "bridgeRight":
				thisVar.setIdle(skill);
			break;
		}
	},

	_setStretch = function() {
		prototypeVar.setSingleSpecialAllowed(true);
	},

	_setDownAction = function(event, what) {
		if(!what) {
			prototypeVar.setCurrentDown(function() {
				thisVar.initStretch();
			});
			return;
		} 
		
		prototypeVar.setCurrentDown(function() {
			thisVar.tryToInit(what.name);
		});
	},

	this.initStretch = function() {
		if(prototypeVar.getSingleSpecialAllowed() && !isStretched) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(function() {});
			prototypeVar.setCurrentDown(function() {
				thisVar.stopStretch();
			});

			prototypeVar.setCurrentRight(function(){});
			prototypeVar.setCurrentLeft(function(){});

			$('body').trigger("onStretchActive");
			isStretched = true;
		}
	},

	this.stopStretch = function() {
		if (prototypeVar.getSingleSpecialAllowed() && isStretched) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(prototypeVar._jump);
			prototypeVar.setCurrentDown(function() {
				thisVar.initStretch();
			});

			prototypeVar.setCurrentRight(prototypeVar._moveRight);
			prototypeVar.setCurrentLeft(prototypeVar._moveLeft);

			$('body').trigger("onStretchInactive");
			isStretched = false;	
		}
	},

	_resetControls = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		prototypeVar.setCurrentUp(prototypeVar._jump);
		prototypeVar.setCurrentLeft(prototypeVar._moveLeft);
		prototypeVar.setCurrentRight(prototypeVar._moveRight);
		prototypeVar.setCurrentMash(function(){});
		prototypeVar.setCurrentDown(function() {
			thisVar.initStretch();
		});
	},

	// For when the blob is waiting for the other blob to do something
	this.setIdle = function(skill) {
		function restore() {
			prototypeVar.setupMovementFunctions();
			$('body').trigger("onPlayerWaitingChange", {"playerName" : "p2", "waiting" : false});

			prototypeVar.setCurrentUp(prototypeVar._jump);
			prototypeVar.setCurrentLeft(prototypeVar._moveLeft);
			prototypeVar.setCurrentRight(prototypeVar._moveRight);

		}

		prototypeVar.setCurrentUp(restore);
		prototypeVar.setCurrentLeft(restore);
		prototypeVar.setCurrentRight(restore);
		
		$('body').trigger("onPlayerWaitingChange", {"playerName" : "p2", "waiting" : skill});
	},

	// START: Teleportation special skill
	this.initTele = function() {
		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});
		prototypeVar.setCurrentDown(function(){});

		$('body').trigger('blobanimationChanged', {'blobID' : EntityConfig.REDBLOBID, 'animationKey' : AnimationKeys.TELEPORT});
	};

	// END: Teleport

	// START: Helicopter special skill:
	var heliSpeedY = -1;
	var heliCurrentYSpeed;

	this.initHeli = function() {
		prototypeVar.setSingleSpecialAllowed(false);
		// BlobPlayer1 controls left and right movements:
		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});
		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		// BlobPlayer2 (this blob) controls up and down movements for heli:
		prototypeVar.setCurrentMash(onButtonMash);
		heliCurrentYSpeed = 0;
	}

	function onButtonMash() {
		$('body').trigger('heliMove', {"speed" : heliSpeedY, "dir" : "y"});
	}
	// END: Heli

	//START: Bridge special skill
	this.initBridge = function() {
		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		prototypeVar.setCurrentLeft(thisVar.bridgeMoveLeft);
		prototypeVar.setCurrentRight(thisVar.bridgeMoveRight);		
	},

	this.bridgeMoveLeft = function() {
		$('body').trigger('onStartLocationRequestedPlayer2', {"dir": "left"});
	},

	this.bridgeMoveRight = function() {
		$('body').trigger('onEndLocationRequestedPlayer2', {"dir": "right"});
	};
	//END:

	this.setup(); 
});