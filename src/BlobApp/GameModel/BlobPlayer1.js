BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();

	var thisVar = this;
	var prototypeVar = this.prototype;

	this.setup = function() {
		_initListeners();
	},

	_initListeners = function() {
		$('body').on("startHeli", thisVar.initHeli);
		$('body').on("greenBlobInHeliZone", _setDownAction);
		$('body').on("greenBlobLeftTriggerZone", _setDownAction);
		$('body').on("onDefaultCollision", _setDownAction)
	},

	this.tryToInit = function(skill) {
		switch(skill) {
			case "heli":
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

		if(what.name == "trampolin") {
			prototypeVar.setCurrentDown(function() {
				thisVar.initTrampolin();
			});
		}

		if(what.name == "heli") {
			prototypeVar.setCurrentDown(function() {
				thisVar.tryToInit(what.name);
			});
		}	
	},

	this.initTrampolin = function() {
		console.log("initTrampolin");

		prototypeVar.setCurrentUp(function(){});
		prototypeVar.setCurrentDown(function(){
			thisVar.stopTrampolin();
		});

		prototypeVar.setCurrentRight(function(){});
		prototypeVar.setCurrentLeft(function(){});
		$('body').trigger("onTrampolinActive");
	},

	this.stopTrampolin = function() {
		console.log("stopTrampolin");
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
	},

	// START: Helicopter special skill:
	heliSpeedX = 0.1,

	this.initHeli = function() {
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