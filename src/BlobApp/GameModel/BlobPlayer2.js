BlobApp.BlobPlayer2 = (function() {	
	this.prototype = new BlobApp.BlobSuperClass();
	var thisVar = this;
	var prototypeVar = this.prototype;

	this.setup = function() {
		
		_initListeners();
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("redBlobInHeliZone", _setDownAction);
		$('body').on("redBlobLeftTriggerZone", _setDownAction);
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
			console.log("Yaaay2");
				thisVar.setIdle(skill);
				break;

		}
	},

	_setDownAction = function(event, what) {
		// Case: player probably left trigger zone --> reset
		if(!what) {
			prototypeVar.setCurrentDown(function(){});
			return;
		} 
		prototypeVar.setCurrentDown(function() {
			thisVar.tryToInit(what.name);
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

			prototypeVar.setCurrentDown(function() {
				thisVar.tryToInit("heli");
			});
		}

		prototypeVar.setCurrentUp(restore);
		prototypeVar.setCurrentDown(function(){});
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