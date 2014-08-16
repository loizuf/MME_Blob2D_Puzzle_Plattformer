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
		$('body').on("greenBlobInHeliZone", _setDownAction);
		$('body').on("greenBlobLeftTriggerZone", _setDownAction);
		$('body').on('heliStopRequested', _resetControls);
		$('body').on('trampolinInitRequested', _setTrampolin);
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
				thisVar.setIdle(skill);
			break;
		}
	},

	_setTrampolin = function() {
		prototypeVar.setSingleSpecialAllowed(true);
		console.log("set trampolin");
	},

	_setDownAction = function(event, what) {
		if(!what) {
			prototypeVar.setCurrentDown(function() {
				thisVar.initTrampolin();
			});
			return;
		} 

		if(what.name == "heli") {
			prototypeVar.setCurrentDown(function() {
				thisVar.tryToInit(what.name);
			});
		}	
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

	// START: Helicopter special skill:
	heliSpeedX = 0.1,

	this.initHeli = function() {		
		$('body').unbind("greenBlobLeftTriggerZone");

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
	};
	// END: Heli */

	this.setup();

});