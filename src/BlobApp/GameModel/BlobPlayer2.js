BlobApp.BlobPlayer2 = (function() {	
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isStretched = false;
	var sphereSpeedX = 0.3;
	var slingshotAngle = 30;

	this.setup = function() {	
		_initListeners();

		prototypeVar.setFunction("downPressed", function(){thisVar.initStretch();});
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("redBlobInTriggerZone", _setDownAction);
		$('body').on("redBlobLeftTriggerZone", _setDownAction);
		$('body').on('heliStopRequested', _resetControls);
		$('body').on('bridgeStopRequested', _resetControls);
		$('body').on('sphereStopRequested', _resetControls);
		$('body').on('stretchInitRequested', _setStretch);
		$('body').on('slingshotFinished', _resetControls);

		$('body').on('startTele', thisVar.initTele);
		$('body').on('physTeleportFinished', _resetControls);

		$('body').on('startBridge', thisVar.initBridge);

		$('body').on('startSphere', thisVar.initSphere);
		$('body').on('startSlingshot', thisVar.initSlingshot);
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

			case "sphere":
				thisVar.setIdle(skill);
			break;

			case "slingshotLeft":
				thisVar.setIdle(skill);
			break;
		}
	},

	_setStretch = function() {
		prototypeVar.setSingleSpecialAllowed(true);
	},

	_setDownAction = function(event, what) {
		if(!what) {
			prototypeVar.setFunction("downPressed", function(){thisVar.initStretch();});
			return;
		} 
		
		prototypeVar.setFunction("downPressed", function(){thisVar.tryToInit(what.name);});
	},

	this.initStretch = function() {
		if(prototypeVar.getSingleSpecialAllowed() && !isStretched) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(function() {});
			prototypeVar.setCurrentDown(function() {});

			prototypeVar.setFunction("downPressed", function() {thisVar.stopStretch();});

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
			prototypeVar.setCurrentDown(function() {});

			prototypeVar.setFunction("downPressed", function() {thisVar.initStretch();});

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
		prototypeVar.setCurrentDown(function() {});
		prototypeVar.setFunction("upPressed", function(){});
		prototypeVar.setFunction("upReleased", function(){});
		prototypeVar.setFunction("downPressed", function(){thisVar.initStretch();});
		prototypeVar.setFunction("downReleased", function(){});
		prototypeVar.setFunction("leftPressed", function(){});
		prototypeVar.setFunction("leftReleased", function(){});
		prototypeVar.setFunction("rightPressed", function(){});
		prototypeVar.setFunction("rightReleased", function(){});
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
	//END: Bridge

	//START: Sphere
	this.initSphere = function() {
		$('body').unbind("greenBlobLeftTriggerZone");

		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});
		setTimeout(function(){prototypeVar.setCurrentDown(thisVar.tryToStopSphere)}, 1500);

		prototypeVar.setCurrentLeft(thisVar.sphereMoveLeft);
		prototypeVar.setCurrentRight(thisVar.sphereMoveRight);
	},

	this.sphereMoveLeft = function() {
		$('body').trigger('sphereMove', {"speed" : -sphereSpeedX, "dir" : "x"});
	},

	this.sphereMoveRight = function() {
		$('body').trigger('sphereMove', {"speed" : sphereSpeedX, "dir" : "x"});
	},

	this.tryToStopSphere = function() {
		prototypeVar.setCurrentDown(function(){});
		$('body').trigger('stopSphere');
	},
	//END: Sphere

	// START: Slingshot
	this.initSlingshot = function() {
		$('body').unbind("greenBlobLeftTriggerZone");
		prototypeVar.setSingleSpecialAllowed(false);
		slingshotAngle = 30;

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});
		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});

		prototypeVar.setFunction("upPressed", thisVar.increaseSlingshotAngle);
		prototypeVar.setFunction("downPressed", thisVar.decreaseSlingshotAngle);
	},

	this.increaseSlingshotAngle = function() {
			slingshotAngle != 60 ? slingshotAngle += 15 : slingshotAngle += 0;
			$('body').trigger('onSlingshotAngleChange', {"angle": slingshotAngle});
	},

	this.decreaseSlingshotAngle = function() {
		slingshotAngle != 30 ? slingshotAngle -= 15 : slingshotAngle += 0;
		$('body').trigger('onSlingshotAngleChange', {"angle": slingshotAngle});
	},

	_resetAngleFlag = function() {
		isNextAngleSelected = true;
	};
	// END: Slingshot

	this.setup(); 
});