BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isTrampolin = false;
	var sphereSpeedX = 0.3;
	var slingshotTension = 7;

	this.setup = function() {
		_initListeners();
				
		prototypeVar.setFunction("downPressed", function(){thisVar.initTrampolin();});
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("greenBlobInTriggerZone", _setDownActionP1);
		$('body').on("greenBlobLeftTriggerZone", _setDownActionP1);
		$('body').on("greenBlobInLevelLoadTriggerZone", _setUpActionP1);
		$('body').on("greenBlobLeftLevelLoadTriggerZone", _setUpActionP1);
		$('body').on("greenBlobInMenuDoorZone", _setUpActionP1);
		$('body').on("greenBlobLeftMenuDoorZone", _setUpActionP1);
		$('body').on('heliStopRequested', thisVar._resetControls);
		$('body').on('bridgeStopRequested', thisVar._resetControls);
		$('body').on('sphereStopRequested', thisVar._resetControls);
		$('body').on('trampolinInitRequested', _setTrampolin);
		$('body').on('slingshotFinished', thisVar._resetControls);

		$('body').on('startTele', thisVar.initTele);
		$('body').on('physTeleportFinished', thisVar.stopTeleP1);

		$('body').on('startBridge', thisVar.initBridge);

		$('body').on('startSphere', thisVar.initSphere);

		$('body').on('startSlingshot', thisVar.initSlingshot);
	},

	this.tryToInit = function(skill) {
		_preventUniqueAbilityTriggerActivationP1();

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

			case "slingshotRight":
				thisVar.setIdle(skill);
			break;
		}
	},

	_preventUniqueAbilityTriggerActivationP1 = function() {
		if(isTrampolin) {
			thisVar.stopTrampolin();
			return;
		}
	},

	_setTrampolin = function() {
		prototypeVar.setSingleSpecialAllowed(true);
	},

	_setDownActionP1 = function(event, what) {
		if(isTrampolin) {
			prototypeVar.setFunction("downPressed", function(){thisVar.stopTrampolin();});
			return;
		}

		if(!what) {
			prototypeVar.setFunction("downPressed", function(){thisVar.initTrampolin();});
			return;
		} 
					
		prototypeVar.setFunction("downPressed", function(){thisVar.tryToInit(what.name);});
	},

	_setUpActionP1 = function(event, IDS) {
		if(IDS==undefined){
			prototypeVar.setFunction("upPressed", function(){});
		} else if(IDS == EntityConfig.NEWGAMEDOOR || IDS == EntityConfig.CONTINUEDOOR) {
			prototypeVar.setFunction("upPressed", function(){console.log("green");});
		} else{
			prototypeVar.setFunction("upPressed", function(){thisVar.tryLevelLoad(IDS.lvlID, IDS.owID);});
		}
	},

	this.tryLevelLoad = function(levelID, owID) {
		prototypeVar.loadLevel(levelID, owID);
	},

	this.initTrampolin = function() {
		if(prototypeVar.getSingleSpecialAllowed() && !isTrampolin) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setFunction("currentUp", function(){});
			prototypeVar.setFunction("currentDown", function(){});
			
			prototypeVar.setFunction("downPressed", function(){thisVar.stopTrampolin();});

			prototypeVar.setFunction("currentRight", function(){});
			prototypeVar.setFunction("currentLeft", function(){});

			$('body').trigger("onTrampolinActive");
			isTrampolin = true;
		}
	},

	this.stopTrampolin = function() {
		if (prototypeVar.getSingleSpecialAllowed() && isTrampolin) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setFunction("currentUp", prototypeVar._jump);
			prototypeVar.setFunction("currentDown", function(){});

			prototypeVar.setFunction("downPressed", function() {thisVar.initTrampolin();});

			prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
			prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);			

			$('body').trigger("onTrampolinInactive");
			isTrampolin = false;	
		}
	},

	this._resetControls = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		prototypeVar.setFunction("currentUp", prototypeVar._jump);
		prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);
		prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
		prototypeVar.setFunction("currentDown", function() {});
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
			
			prototypeVar.setFunction("currentUp", prototypeVar._jump);
			prototypeVar.setFunction("currentLeft", prototypeVar._moveLeft);
			prototypeVar.setFunction("currentRight", prototypeVar._moveRight);
		}

		prototypeVar.setFunction("currentUp", restore);
		prototypeVar.setFunction("currentLeft", restore);
		prototypeVar.setFunction("currentRight", restore);

		$('body').trigger("onPlayerWaitingChange", {"playerName" : "p1", "waiting" : skill});		
	},

	// START: Teleportation special skill
	this.initTele = function() {
		$('body').trigger('blobanimationChanged', {'blobID' : EntityConfig.GREENBLOBID, 'animationKey' : AnimationKeys.TELEPORT});
	},

	this.stopTeleP1 = function() {
		thisVar._resetControls();
		_setDownActionP1(null, {name: "tele"});
	},

	// END: Teleport

	// START: Helicopter special skill:
	heliSpeedX = 0.1,

	this.initHeli = function() {		
		prototypeVar.setSingleSpecialAllowed(false);
		// BlobPlayer2 controls up and down movements:
		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});

		// BlobPlayer1 (this blob) controls left and right movements for heli:
		prototypeVar.setFunction("currentLeft", _heliMoveLeft);
		prototypeVar.setFunction("currentRight", _heliMoveRight);
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
		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});

		prototypeVar.setFunction("currentLeft", thisVar.bridgeMoveLeft);
		prototypeVar.setFunction("currentRight", thisVar.bridgeMoveRight);		
	},

	this.bridgeMoveLeft = function() {
		$('body').trigger('onStartLocationRequestedPlayer1', {"dir": "left"});
	},

	this.bridgeMoveRight = function() {
		$('body').trigger('onEndLocationRequestedPlayer1', {"dir": "right"});
	},

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

	isSlingshotActive = false;

	this.initSlingshot = function() {
		$('body').trigger('animateSlingshot', {animationKey : AnimationKeys.LOAD});
		slingshotTension = 7;

		prototypeVar.setSingleSpecialAllowed(false);

		prototypeVar.setFunction("currentUp", function(){});
		prototypeVar.setFunction("currentDown", function(){});

		prototypeVar.setFunction("currentLeft", function(){});
		prototypeVar.setFunction("currentRight", function(){});

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
			
			console.log("clutch slingshot", slingshotTension);

			$('body').trigger('onSlingshotTensionChange', {"tension": slingshotTension});		
			$('body').trigger('animateSlingshot', {"animationKey" : AnimationKeys.CLUTCH});	
		}		
	},

	this.loosenSlingshot = function() {
		if(isNextTensionSelected) {
			isNextAngleSelected = false;
			slingshotTension < 7 ? slingshotTension = 7 : slingshotTension += 0;
			slingshotTension != 7 ? slingshotTension -= 0.2 : slingshotTension += 0;
			
			console.log("loosen slingshot", slingshotTension);

			$('body').trigger('onSlingshotTensionChange', {"tension": slingshotTension});	
			$('body').trigger('animateSlingshot', {"animationKey" : AnimationKeys.LOOSEN});	
		}		
	};

	this.setup();

});