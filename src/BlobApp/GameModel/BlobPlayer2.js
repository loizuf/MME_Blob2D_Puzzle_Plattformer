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
		$('body').on("redBlobInHeliZone", _setDownAction);
		$('body').on("redBlobLeftTriggerZone", _setDownAction);
		$('body').on('heliStopRequested', _resetControls);
		$('body').on('stretchInitRequested', _setStretch);
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
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
	}

	// START: Helicopter special skill:
	var heliSpeedY = -1;
	var heliCurrentYSpeed;

	this.initHeli = function() {
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

	this.setup(); 
});