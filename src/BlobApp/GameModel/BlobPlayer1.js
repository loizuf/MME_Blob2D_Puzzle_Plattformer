BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();
	var thisVar = this;
	var prototypeVar = this.prototype;

	this.setup = function() {
		console.log(prototypeVar);
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
	},


	// For when the blob is waiting for the other blob to do something
	this.setIdle = function(skill) {
		function restore() {
			$('body').trigger("onPlayerWaitingChange", {"playerName" : "p1", "waiting" : false});

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

		$('body').trigger("onPlayerWaitingChange", {"playerName" : "p1", "waiting" : skill});		

	}

	// START: Helicopter special skill:
	var heliSpeedX = 0.1;
	this.initHeli = function() {
		// BlobPlayer2 controls up and down movements:
		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){});

		// BlobPlayer1 (this blob) controls left and right movements for heli:
		prototypeVar.setCurrentLeft(heliMoveLeft);
		prototypeVar.setCurrentRight(heliMoveRight);
	}

	function heliMoveRight() {		
		$('body').trigger('heliMove', {"speed" : heliSpeedX, "dir" : "x"});
	}

	function heliMoveLeft() {
		$('body').trigger('heliMove', {"speed" : -heliSpeedX, "dir" : "x"});
	}
	// END: Heli */

	this.setup();

});