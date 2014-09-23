BlobApp.BlobPlayer2 = (function() {	
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isStretched = false;
	var sphereSpeedX = 0.3;
	var slingshotLeftStartAngle = 30;
	var slingshotRightStartAngle = 150;

	this.setup = function() {	
		_initListeners();
		prototypeVar.setFunction("downPressed", function(){thisVar.initStretch();});
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("redBlobInTriggerZone", _setDownAction);
		$('body').on("redBlobLeftTriggerZone", _setDownAction);
		$('body').on("redBlobInLevelLoadTriggerZone", _setUpActionP2);
		$('body').on("redBlobLeftLevelLoadTriggerZone", _setUpActionP2);
		$('body').on("redBlobInMenuDoorZone", _setUpActionP2);
		$('body').on("redBlobLeftMenuDoorZone", _setUpActionP2);
		$('body').on('heliStopRequested', thisVar._resetControls);
		$('body').on('bridgeStopRequested', thisVar._resetControls);
		$('body').on('sphereStopRequested', thisVar._resetControls);
		$('body').on('stretchInitRequested', _setStretch);
		$('body').on('slingshotFinished', thisVar._resetControls);

		$('body').on('startTele', thisVar.initTele);
		$('body').on('physTeleportFinished', thisVar.stopTeleP2);

		$('body').on('startBridge', thisVar.initBridge);

		$('body').on('startSphere', thisVar.initSphere);

		$('body').on('startSlingshot', thisVar.initSlingshot);

		$('body').on('onSlingshotRelease', function() {
			isSlingshotActive = false;
			isSlingshotLeft = false;
			isSlingshotRight = false;
		});
	},

	this.tryToInit = function(skill, triggerZoneID) {
		_preventUniqueAbilityTriggerActivationP2();

		switch(skill) {
			case "heli":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "tele":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "bridgeLeft":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "bridgeRight":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "sphere":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "slingshotLeft":
				thisVar.setIdle(skill, triggerZoneID);
			break;

			case "slingshotRight":
				thisVar.setIdle(skill, triggerZoneID);
			break;
		}
	},

	_preventUniqueAbilityTriggerActivationP2 = function() {
		if(isStretched) {
			thisVar.stopStretch();
			return;
		}
	},

	_setStretch = function() {
		prototypeVar.setSingleSpecialAllowed(true);
	},

	_setDownAction = function(event, what) {
		if(isStretched) {
			prototypeVar.setFunction("downPressed", function(){thisVar.stopStretch();});
			return;
		}

		if(!what) {
			prototypeVar.setFunction("downPressed", function(){thisVar.initStretch();});
			return;
		} 
		
		prototypeVar.setFunction("downPressed", function(){thisVar.tryToInit(what.name, what.triggerID);});
	},

	_setUpActionP2 = function(event, IDS) {
		if(IDS==undefined){
			prototypeVar.setFunction("upPressed", function(){});
		} else if(IDS == EntityConfig.NEWGAMEDOOR || IDS == EntityConfig.CONTINUEDOOR) {
			prototypeVar.setFunction

			("upPressed", function(){thisVar.reactOnMenuDoor(IDS);});
		} else{
			prototypeVar.setFunction("upPressed", function(){thisVar.tryLevelLoad(IDS.lvlID, IDS.owID);});
		}
	},

	this.reactOnMenuDoor = function(IDS){
		$('body').trigger("disableAllMovements");
		prototypeVar.reactOnMenuDoor(IDS);
	},

	this.tryLevelLoad = function(levelID, owID) {
		$('body').trigger("disableAllMovements");
		prototypeVar.loadLevel(levelID, owID);
	},

	this.initStretch = function() {
		if(prototypeVar.getSingleSpecialAllowed() && !isStretched) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setFunction("currentUp", function() {});
			prototypeVar.setFunction("currentDown", function() {});

			prototypeVar.setFunction("downPressed", function() {thisVar.stopStretch();});

			prototypeVar.setFunction("currentRight", function(){});
			prototypeVar.setFunction("currentLeft", function(){});

			$('body').trigger("onStretchActive");
			isStretched = true;
		}
	},

	this.stopStretch = function() {
		if (prototypeVar.getSingleSpecialAllowed() && isStretched) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setFunction("currentUp", prototypeVar._jump);
			prototypeVar.setFunction("currentDown", function() {});

			prototypeVar.setFunction("downPressed", function() {thisVar.initStretch();});

			prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
			prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);

			$('body').trigger("onStretchInactive");
			isStretched = false;	
		}
	},

	this._resetControls = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		prototypeVar.setFunction("currentUp", prototypeVar._jump);
		prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);
		prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
		prototypeVar.setFunction("currentMash", function(){});
		prototypeVar.setFunction("currentDown", function() {});
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
	this.setIdle = function(skill, triggerZoneID) {

		function restore() {			
			$('body').trigger("onPlayerWaitingChange", {"playerName" : "p2", "waiting" : false});
			$('body').trigger("animateHintBubble", {animationKey: AnimationKeys.PRESSBUTTON, blobID: "p2"});

			prototypeVar.setFunction("currentUp", prototypeVar._jump);
			prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);
			prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
		}

		prototypeVar.setFunction("currentUp", restore);
		prototypeVar.setFunction("currentLeft", restore);
		prototypeVar.setFunction("currentRight", restore);
		
		$('body').trigger("onPlayerWaitingChange", {"playerName" : "p2", "waiting" : skill, "triggerID" : triggerZoneID});
		$('body').trigger("animateHintBubble", {animationKey: AnimationKeys.WAITING, blobID: "p2"});
	},

	// START: Teleportation special skill
	this.initTele = function() {
		$('body').trigger('blobanimationChanged', {'blobID' : EntityConfig.REDBLOBID, 'animationKey' : AnimationKeys.TELEPORT});
	},

	this.stopTeleP2 = function() {
		thisVar._resetControls();
		_setDownAction(null, {name: "tele"});
	};
	// END: Teleport

	// START: Helicopter special skill:
	var heliSpeedY = -1;
	var heliCurrentYSpeed;

	this.initHeli = function() {
		prototypeVar.setSingleSpecialAllowed(false);
		// BlobPlayer1 controls left and right movements:
		prototypeVar.setFunction("currentLeft", function(){});
		prototypeVar.setFunction("currentRight", function(){});
		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});

		// BlobPlayer2 (this blob) controls up and down movements for heli:
		prototypeVar.setFunction("currentMash", onButtonMash);
		heliCurrentYSpeed = 0;
	}

	function onButtonMash() {
		$('body').trigger('heliMove', {"speed" : heliSpeedY, "dir" : "y"});
	}
	// END: Heli

	//START: Bridge special skill
	this.initBridge = function() {
		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});

		prototypeVar.setFunction("currentLeft", thisVar.bridgeMoveLeft);
		prototypeVar.setFunction("currentRight", thisVar.bridgeMoveRight);		
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
		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});
		setTimeout(function(){prototypeVar.setFunction("currentDown", thisVar.tryToStopSphere)}, 1500);

		prototypeVar.setFunction("currentLeft", thisVar.sphereMoveLeft);
		prototypeVar.setFunction("currentRight", thisVar.sphereMoveRight);
	},

	this.sphereMoveLeft = function() {
		$('body').trigger('sphereMove', {"speed" : -sphereSpeedX, "dir" : "x"});
	},

	this.sphereMoveRight = function() {
		$('body').trigger('sphereMove', {"speed" : sphereSpeedX, "dir" : "x"});
	},

	this.tryToStopSphere = function() {
		prototypeVar.setFunction("currentDown", function(){});
		$('body').trigger('stopSphere');
	},
	//END: Sphere

	// START: Slingshot
	isSlingshotActive = false;
	isSlingshotLeft = false;
	isSlingshotRight = false;

	this.initSlingshot = function(event, data) {
 		data.direction == "left" ? isSlingshotLeft = true : isSlingshotRight = true;
		slingshotLeftStartAngle = 30;

		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});
		prototypeVar.setFunction("currentLeft", function(){});
		prototypeVar.setFunction("currentRight", function(){});

		prototypeVar.setFunction("upPressed", thisVar.increaseSlingshotAngle);
		prototypeVar.setFunction("downPressed", thisVar.decreaseSlingshotAngle);
	},

	this.increaseSlingshotAngle = function() {
		slingshotLeftStartAngle != 60 ? slingshotLeftStartAngle += 15 : slingshotLeftStartAngle += 0;
		$('body').trigger('onSlingshotAngleChange', {"angle": slingshotLeftStartAngle});
	},

	this.decreaseSlingshotAngle = function() {
		slingshotLeftStartAngle != 30 ? slingshotLeftStartAngle -= 15 : slingshotLeftStartAngle += 0;
		$('body').trigger('onSlingshotAngleChange', {"angle": slingshotLeftStartAngle});	
	},

	_resetAngleFlag = function() {
		isNextAngleSelected = true;
	};
	// END: Slingshot

	this.setup(); 
});