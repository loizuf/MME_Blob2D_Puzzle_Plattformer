/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.

	The blob gets most of the user input and tells the model / controller how to react.
*/
BlobApp.BlobSuperClass = function() {

	/* 
		All methods and parameters of "thisVar" or "this" are public,
		(thisVar has to be used within function as "this" <- within a function means the function)
		all those of private are private
	 */
	var thisVar = this,
	private = {};

	// Whethter or not the blob can jump 
	private._jumpAllowed,

	// Waiting for other blob to trigger a special interaction: No interaction allowed
	// Is false when not waiting, otherwhise contains name of the skill that the blob is waiting to use.
	private._waitingForOtherBlob,

	// Box2D Entity
	private._blobEntity,

	REDBLOBXSPEED = 0.4,
	GREENBLOBXSPEED = 0.15, 
	REDBLOBYSPEED = 9.3,
	GREENBLOBYSPEED = 3.8,

	// Which blob this is (red or green)
	private._blobID,

	/* 
		current<Direction>: Function that is called _as long as_ the key is pressed
							(periodically)
		<direction>Pressed/Realeased: Function that is called _when_ that happens
									  (once)

	 	can & will be overriden by subclasses!
	 */
	private._currentLeft = function(){},
	private._currentRight = function(){},
	private._currentUp = function(){},
	private._currentDown = function(){},
	private._currentMash = function(){},

	private._upPressed = function(){},
	private._upReleased = function(){},
	private._downPressed = function(){},
	private._downReleased = function(){},
	private._leftPressed = function(){},
	private._leftReleased = function(){},
	private._rightPressed = function(){},
	private._rightReleased = function(){},

	private.keyUpPressed,
	private.keyDownPressed,
	private.keyLeftPressed,
	private.keyRightPressed;

	// Trampolin or stretching: Skill that a blob can use "on his own", without a trigger zone
	this.singleSpecialAllowed = true,

	// If the blobs are currently doing some fancy interaction
	this.specialInteractionActive = null,

	this.init = function() {
		thisVar.setupMovementFunctions();

		// listener methods
		$("body").on("onTick", private._callDirections);
		$("body").on("disableAllMovements", disableAllMovements);
	},

	// Initialization of the default input/movement mapping
	this.setupMovementFunctions = function() {
		private._currentLeft = thisVar._moveLeft;
		private._currentRight = thisVar._moveRight;
		private._currentUp = thisVar._jump;
		private._downPressed = thisVar._triggerSpecial;
	},

	// Manipulates the movement direction so that the blob moves to the left
	this._moveLeft = function() {
		if(private._blobID==EntityConfig.REDBLOBID) {
			$('body').trigger('onInputRecieved', {entity: private._blobEntity, directionX: -1 * REDBLOBXSPEED, directionY: 0});	
		} else {
			$('body').trigger('onInputRecieved', {entity: private._blobEntity, directionX: -1 * GREENBLOBXSPEED, directionY: 0});
		}
	},

	// Manipulates the movement direction so that the blob moves to the right
	this._moveRight = function() {
		if(private._blobID==EntityConfig.REDBLOBID) {
			$('body').trigger('onInputRecieved',{entity: private._blobEntity, directionX: REDBLOBXSPEED, directionY: 0});
		} else {
			$('body').trigger('onInputRecieved',{entity: private._blobEntity, directionX: GREENBLOBXSPEED, directionY: 0});
		}
	},

	// Makes the Blob jump
	this._jump = function() {

		if(private._jumpAllowed) {
			$('body').trigger('soundJump');
			// Animation
			if(!private.keyLeftPressed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : private._blobID,
					"animationKey" : AnimationKeys.JUMPRIGHT
				});
			} else {
				$('body').trigger('blobanimationChanged', {
					"blobID" : private._blobID,
					"animationKey" : AnimationKeys.JUMPLEFT	
				});	
			}			
			// Physics
			if(private._blobID == EntityConfig.REDBLOBID) {
				$('body').trigger('onInputRecievedJump',{entity: private._blobEntity, directionX: 0, directionY: -1*REDBLOBYSPEED});
			} else {
				$('body').trigger('onInputRecievedJump',{entity: private._blobEntity, directionX: 0, directionY: -1*GREENBLOBYSPEED});
			}

			private._jumpAllowed = false;
		}
	},

	this.allowJump = function() {
		private._jumpAllowed = true;
		// Animations
		if(private.keyLeftPressed) {
			$('body').trigger('blobanimationChanged', {
				"blobID" : private._blobID,
				"animationKey" : AnimationKeys.MOVELEFT
			});
		} else if(private.keyRightPressed) {
			$('body').trigger('blobanimationChanged', {
				"blobID" : private._blobID,
				"animationKey" : AnimationKeys.MOVERIGHT
			});
		} else {
			$('body').trigger('blobanimationChanged', {
				"blobID" : private._blobID,
				"animationKey" : AnimationKeys.IDLE1
			});
		}
	},

	this.loadLevel = function(levelID, owID) {
		$('body').trigger('animateLevelDoor', {lvlID: levelID, owID: owID});
		$('body').trigger('levelLoadRequest', {lvlID: levelID, owID: owID});
	},

	this.reactOnMenuDoor = function(doorType) {
		if(doorType == EntityConfig.NEWGAMEDOOR){
			$('body').trigger("onNewGameRequested");
		} else {
			$('body').trigger("onContinueGameRequested");
		}
	},

	// Called periodically (on every engine tick)
	private._callDirections = function() {
		if(private.keyLeftPressed) {
			private._currentLeft();
		}

		if(private.keyRightPressed) {
			private._currentRight();
		}

		if(private.keyUpPressed) { 
			private._currentUp();
		}

		if(private.keyDownPressed) {
			private._currentDown();
		}
	},

	// Makes the blobs completely unable to do anything (can be used for teleport, after death etc.)
	disableAllMovements = function() {
		emptyFunction = function(){};
		private._currentMash = private._currentUp = private._currentDown = private._currentRight = private._currentLeft = 
		private._upPressed = private._upReleased = private._downPressed = private._downReleased = 
		private._leftPressed = private._leftReleased = private._rightPressed = private._rightReleased = emptyFunction;
	},

	/*
		the on<Direction>Pressed functions are also the functions that get called when a key is released
		(in that case, they get called with "false" as the first parameter)
	*/

	this.onLeftPressed = function(pressed) {
		if(pressed) {
			if(!private.keyLeftPressed) { // checks if this was already pressed or whether the input is "new"
				private.keyLeftPressed = true;
				private.keyRightPressed = false;

				if(private._jumpAllowed) {
					$('body').trigger('blobanimationChanged', {
						"blobID" : private._blobID,
						"animationKey" : AnimationKeys.MOVELEFT
					});
				}
				private._leftPressed();
			}
		} else {
			private.keyLeftPressed = false;
			private._leftReleased();
			if(!private.keyRightPressed && private._jumpAllowed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : private._blobID,
					"animationKey" : AnimationKeys.IDLE1
				});
			}
		}
	},

	this.onRightPressed = function(pressed) {
		if(pressed) {
			if(!private.keyRightPressed) {
				private.keyRightPressed = true;
				private.keyLeftPressed = false;

				if(private._jumpAllowed) {	
					$('body').trigger('blobanimationChanged', {
						"blobID" : private._blobID,
						"animationKey" : AnimationKeys.MOVERIGHT
					});
				}

				private._rightPressed();
			}
		} else {
			private.keyRightPressed = false;
			private._rightReleased();
			if(!private.keyLeftPressed && private._jumpAllowed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : private._blobID,
					"animationKey" : AnimationKeys.IDLE1
				});
			}
		}
	},

	this.onUpPressed = function(pressed) {
		if(pressed) {
			if(!private.keyUpPressed) {
				private.keyUpPressed = true;
				private.keyDownPressed = false;
				private._upPressed();
			}
		} else {
			private.keyUpPressed = false;
			private._upReleased();
		}
	},

	this.onDownPressed = function(pressed) {
		if(pressed) {
			if(!private.keyDownPressed) {
				private.keyDownPressed = true;
				private.keyUpPressed = false;
				private._downPressed();
			}
		} else {
			private.keyDownPressed = false;
			private._downReleased();
		}
	},

	this.onButtonMash = function() {
		if(private._currentMash)
			private._currentMash();
	},

	// This function can be called from BlobPlayer1 and BlobPlayer2 to change what happens when a button is pressed
	this.setFunction = function(name, newFunction) {
		switch(name) {
			case "upPressed":
				private._upPressed = newFunction;
				break;
			case "upReleased":
				private._upReleased = newFunction;
				break;
			case "downPressed":
				private._downPressed = newFunction;
				break;
			case "downReleased":
				private._downReleased = newFunction;
				break;
			case "leftPressed":
				private._leftPressed = newFunction;
				break;
			case "leftReleased":
				private._leftReleased = newFunction;
				break;
			case "rightPressed":
				private._rightPressed = newFunction;
				break;
			case "rightReleased":
				private._rightReleased = newFunction;
				break;
			case "currentUp":
				private._currentUp = newFunction;
				break;
			case "currentDown":
				private._currentDown = newFunction;
				break;
			case "currentLeft":
				private._currentLeft = newFunction;
				break;
			case "currentRight":
				private._currentRight = newFunction;
				break;
			case "currentMash":
				private._currentMash = newFunction;
				break;
		}
	},

	// Required to connect this object to the phsyics.
	this.setEntity = function(entity){
		private._blobEntity = entity;
		private._blobID = private._blobEntity.GetUserData()[0];
	},

	this.setWaitingForOther = function(waiting) {
		private._waitingForOtherBlob = waiting;
	},

	this.getWaitingForOther = function() {
		return private._waitingForOtherBlob;
	},

	this.setSingleSpecialAllowed = function(singleSpecialAllowed) {
		thisVar.singleSpecialAllowed = singleSpecialAllowed;
	},

	this.getSingleSpecialAllowed = function() {
		return thisVar.singleSpecialAllowed;
	};

	this.init();

	return this;
};