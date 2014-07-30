BlobApp.BlobPlayer2 = (function() {	
	this.prototype = new BlobApp.BlobSuperClass();
	var thisVar = this;
	var prototypeVar = this.prototype;

	this.setup = function() {
		prototypeVar.setCurrentDown(function() {
			thisVar.tryToInit("heli");
		});
		_initListeners();
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
				thisVar.setIdle(skill);
				break;

		}
	}


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
	var heliSpeedUp = -2;
	var heliSpeedDown = 0;
	var heliCurrentYSpeed;

	this.initHeli = function() {
		// BlobPlayer1 controls left and right movements:
		prototypeVar.setCurrentLeft(function(){});
		prototypeVar.setCurrentRight(function(){});

		// BlobPlayer2 (this blob) controls up and down movements for heli:
		prototypeVar.setCurrentUp(heliMoveUp);
		prototypeVar.setCurrentDown(heliMoveDown);
		heliCurrentYSpeed = 0;
	}

	function heliMoveUp() {
		if(heliCurrentYSpeed > heliSpeedUp) {
			heliCurrentYSpeed-=0.5;
		}

		$('body').trigger('heliMove', {"speed" : heliCurrentYSpeed, "dir" : "y"});
	}

	function heliMoveDown() {
		if(heliCurrentYSpeed < heliSpeedDown) {
			heliCurrentYSpeed++;
		}

		$('body').trigger('heliMove', {"speed" : heliCurrentYSpeed, "dir" : "y"});
	}
	// END: Heli

	this.setup(); 
});