BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;
	var isTrampolin = false;

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
		$('body').on('trampolinInitRequested', _setTrampolin);

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
		if(prototypeVar.getSingleSpecialAllowed() && !isTrampolin) {
			prototypeVar.setSingleSpecialAllowed(false);

			prototypeVar.setCurrentUp(function(){});
			prototypeVar.setCurrentDown(function(){
				thisVar.stopTrampolin();
			});

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
			prototypeVar.setCurrentDown(function() {
				thisVar.initTrampolin();
			});

			prototypeVar.setCurrentRight(prototypeVar._moveRight);
			prototypeVar.setCurrentLeft(prototypeVar._moveLeft);

			$('body').trigger("onTrampolinInactive");
			isTrampolin = false;	
		}
	},

	_resetControls = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		prototypeVar.setCurrentUp(prototypeVar._jump);
		prototypeVar.setCurrentLeft(prototypeVar._moveLeft);
		prototypeVar.setCurrentRight(prototypeVar._moveRight);
		prototypeVar.setCurrentDown(function() {
				thisVar.initTrampolin();
		});
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
	};	

	this.setup();

});