BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isTrampolin = false;
	var sphereSpeedX = 0.3;
	var slingshotTension = 7;

	this.setup = function() {
		_initListeners();
		
		prototypeVar.setCurrentDown(function() {
			thisVar.initTrampolin();
		});
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("greenBlobInTriggerZone", _setDownAction);
		$('body').on("greenBlobLeftTriggerZone", _setDownAction);
		$('body').on('heliStopRequested', _resetControls);
		$('body').on('bridgeStopRequested', _resetControls);
		$('body').on('sphereStopRequested', _resetControls);
		$('body').on('trampolinInitRequested', _setTrampolin);
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

			case "slingshot":
				thisVar.setIdle(skill);
			break;
		}
	},

	_setTrampolin = function() {
		prototypeVar.setSingleSpecialAllowed(true);
	},

	_setDownAction = function(event, what) {
		if(!what) {
			prototypeVar.setCurrentDown(function() {
				thisVar.initTrampolin();
			});
			return;
		} 
		
		prototypeVar.setCurrentDown(function() {
			thisVar.tryToInit(what.name);
		});
		
	},

	this.initTrampolin = function() {
		console.log("called");
		if(prototypeVar.getSingleSpecialAllowed() && !isTrampolin) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(function(){});
			prototypeVar.setCurrentDown(function(){});
			
			prototypeVar.setFunction("downPressed", function(){thisVar.stopTrampolin();});

			prototypeVar.setCurrentRight(function(){});
			prototypeVar.setCurrentLeft(function(){});

			$('body').trigger("onTrampolinActive");
			isTrampolin = true;
		}
	},

	this.stopTrampolin = function() {
		if (prototypeVar.getSingleSpecialAllowed() && isTrampolin) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(prototypeVar._jump);
			prototypeVar.setCurrentDown({});

			prototypeVar.setCurrentRight(prototypeVar._moveRight);
			prototypeVar.setCurrentLeft(prototypeVar._moveLeft);

			prototypeVar.setFunction("downPressed", function() {thisVar.initTrampolin();});

			$('body').trigger("onTrampolinInactive");
			isTrampolin = false;	
		}
	},

	_resetControls = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		prototypeVar.setCurrentUp(prototypeVar._jump);
		prototypeVar.setCurrentLeft(prototypeVar._moveLeft);
		prototypeVar.setCurrentRight(prototypeVar._moveRight);
		prototypeVar.setCurrentDown(function() {});
		prototypeVar.setFunction("upPressed", function(){});
		prototypeVar.setFunction("upReleased", function(){});
		prototypeVar.setFunction("downPressed", function(){thisVar.initTrampolin();});
		prototypeVar.setFunction("downReleased", function(){});
		prototypeVar.setFunction("leftPressed", function(){});
		prototypeVar.setFunction("leftReleased", function(){});
		prototypeVar.setFunction("rightPressed", function(){});
		prototypeVar.setFunction("rightReleased", function(){});
	},

	// For when the blob is waiting for the other blob to do something
	this.setIdle = function(skill) {
		function restore() {
			$('body').trigger("onPlayerWaitingChange", {"playerName" : "p1", "waiting" : false});
			prototypeVar.setCurrentUp(prototypeVar._jump);
			prototypeVar.setCurrentLeft(prototypeVar._moveLeft);
			prototypeVar.setCurrentRight(prototypeVar._moveRight);
		}

		prototypeVar.setCurrentUp(restore);
		prototypeVar.setCurrentLeft(restore);
		prototypeVar.setCurrentRight(restore);

		$('body').trigger("onPlayerWaitingChange", {"playerName" : "p1", "waiting" : skill});		
	},

	// START: Teleportation special skill
	this.initTele = function() {
		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});
		prototypeVar.setCurrentDown(function(){});

		$('body').trigger('blobanimationChanged', {'blobID' : EntityConfig.GREENBLOBID, 'animationKey' : AnimationKeys.TELEPORT});
	},

	// END: Teleport

	// START: Helicopter special skill:
	heliSpeedX = 0.1,

	this.initHeli = function() {		
		$('body').unbind("greenBlobLeftTriggerZone");

		prototypeVar.setSingleSpecialAllowed(false);
		// BlobPlayer2 controls up and down movements:
		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		// BlobPlayer1 (this blob) controls left and right movements for heli:
		prototypeVar.setCurrentLeft(_heliMoveLeft);
		prototypeVar.setCurrentRight(_heliMoveRight);
	},

	_heliMoveRight = function() {		
		$('body').trigger('heliMove', {"speed" : heliSpeedX, "dir" : "x"});
	},

	_heliMoveLeft  = function() {
		$('body').trigger('heliMove', {"speed" : -heliSpeedX, "dir" : "x"});
	},
	// END: Heli */

	// START BRIDGE
	this.initBridge = function(event, data) {
		$('body').unbind("greenBlobLeftTriggerZone");

		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		prototypeVar.setCurrentLeft(thisVar.bridgeMoveLeft);
		prototypeVar.setCurrentRight(thisVar.bridgeMoveRight);		
	},

	this.bridgeMoveLeft = function() {
		$('body').trigger('onStartLocationRequestedPlayer1', {"dir": "left"});
	},

	this.bridgeMoveRight = function() {
		$('body').trigger('onEndLocationRequestedPlayer1', {"dir": "right"});
	},

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

	isSlingshotActive = false;

	this.initSlingshot = function() {
		$('body').unbind("greenBlobLeftTriggerZone");
		$('body').trigger('animateSlingshot', {animationKey : AnimationKeys.LOAD});

		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});

		prototypeVar.setFunction("leftPressed", thisVar.clutchSlingshot);
		prototypeVar.setFunction("rightPressed", thisVar.loosenSlingshot);
		prototypeVar.setFunction("downPressed", thisVar.shootSlingshot);

		isSlingshotActive = true;
	},

	this.shootSlingshot = function() {
		if(isSlingshotActive) {
			$('body').trigger('onSlingshotRelease');
			isSlingshotActive = false;
		}
	},

	isNextTensionSelected = true;

	this.clutchSlingshot = function() {
		if(isNextTensionSelected) {
			isNextAngleSelected = false;
			slingshotTension > 8 ? slingshotTension = 8 : slingshotTension += 0;
			slingshotTension != 8 ? slingshotTension += 0.2 : slingshotTension += 0;
			

			$('body').trigger('onSlingshotTensionChange', {"tension": slingshotTension});		
			$('body').trigger('animateSlingshot', {"animationKey" : AnimationKeys.CLUTCH});	
		}		
	},

	this.loosenSlingshot = function() {
		if(isNextTensionSelected) {
			isNextAngleSelected = false;
			slingshotTension < 7 ? slingshotTension = 7 : slingshotTension += 0;
			slingshotTension != 7 ? slingshotTension -= 0.2 : slingshotTension += 0;
			

			$('body').trigger('onSlingshotTensionChange', {"tension": slingshotTension});	
			$('body').trigger('animateSlingshot', {"animationKey" : AnimationKeys.LOOSEN});	
		}		
	};

	this.setup();

});