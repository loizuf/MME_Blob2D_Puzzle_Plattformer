/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.

	The blob gets most of the user input and tells the model / controller how to react.
*/
BlobApp.BlobSuperClass = function() {

	//var b2Vec2 = Box2D.Common.Math.b2Vec2;
	thisVar = this;

	var _positionX = null,
	_positionY = null,

	// box2d? value
	_velocity = null,

	// Box2D vector
	_direction = null,

	// As the name suggests, 
	_jumpAllowed,

	// Waiting for other blob to trigger a special interaction: No interaction allowed
	// Is false when not waiting, otherwhise contains name of the skill that the blob is waiting to use.
	_waitingForOtherBlob,

	// Box2D Entity
	_blobEntity,

	REDBLOBXSPEED = 0.4,
	GREENBLOBXSPEED = 0.15, 
	REDBLOBYSPEED = 9.3,
	GREENBLOBYSPEED = 3.8,

	_blobID,

	/* 
		current<Direction>: Function that is called when the key is pressed
	 	default<Direction>: Move/Jump/Trigger
	 	can & will be overriden by subclass implementations
	 */
	_currentLeft,
	_currentRight,
	_currentUp,
	_currentDown,
	_currentMash,

	_upPressed = function(){},
	_upReleased = function(){},
	_downPressed = function(){},
	_downReleased = function(){},
	_leftPressed = function(){},
	_leftReleased = function(){},
	_rightPressed = function(){},
	_rightReleased = function(){},

	keyUpPressed,
	keyDownPressed,
	keyLeftPressed,
	keyRightPressed;

//!	 !Must be overriden by subclass!
	this.specialSkills = null,
	// Trampolin or stretching: Skill that a blob can use "on his own", without a trigger zone
	this.singleSpecialAllowed = true,

	// If the blobs are currently doing some fancy interaction
	this.specialInteractionActive = null,

	this.init = function(pX, pY, v, dir) {
		_setPropertiesOfBlob(pX, pY, v, dir);

		thisVar.setupMovementFunctions();

		// listener methods
		$("body").on("onTick", _callDirections);
	},

	_setPropertiesOfBlob = function(pX, pY, v, dir) {
		_positionX = pX;
		_positionY = pY;
		_velocity = v;
		_direction = dir;
	},

	this.setupMovementFunctions = function() {
		_currentLeft = thisVar._moveLeft;
		_currentRight = thisVar._moveRight;
		_currentUp = thisVar._jump;
		_currentDown = thisVar._triggerSpecial;
	},

	this.killBlob = function(startpX, startpY) {
		//_setPropertiesOfBlob(startpX, startpY, 0, 0);
		// Trigger something to kill other blob, wait some time, reset positions
	},


	// Manipulates the movement direction so that the blob moves to the left
	this._moveLeft = function() {
		if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID) {
			$('body').trigger('onInputRecieved', {entity: _blobEntity, directionX: -1 * REDBLOBXSPEED, directionY: 0});	
		} else {
			$('body').trigger('onInputRecieved', {entity: _blobEntity, directionX: -1 * GREENBLOBXSPEED, directionY: 0});
		}
	},

	// Manipulates the movement direction so that the blob moves to the right
	this._moveRight = function() {
		if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID) {
			$('body').trigger('onInputRecieved',{entity: _blobEntity, directionX: REDBLOBXSPEED, directionY: 0});
		} else {
			$('body').trigger('onInputRecieved',{entity: _blobEntity, directionX: GREENBLOBXSPEED, directionY: 0});
		}
	},

	// Makes the Blob jump
	this._jump = function() {
		// TODO, impossible with easel?? switch between animations mid-jump
		if(_jumpAllowed) {
			$('body').trigger('soundJump');
			if(!keyLeftPressed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : _blobID,
					"animationKey" : AnimationKeys.JUMPRIGHT
				});
			} else {
				$('body').trigger('blobanimationChanged', {
					"blobID" : _blobID,
					"animationKey" : AnimationKeys.JUMPLEFT	
				});	
			}			
		}

		if(_jumpAllowed != false) {
			if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID) {
				$('body').trigger('onInputRecievedJump',{entity: _blobEntity, directionX: 0, directionY: -1*REDBLOBYSPEED});
			} else {
				$('body').trigger('onInputRecievedJump',{entity: _blobEntity, directionX: 0, directionY: -1*GREENBLOBYSPEED});
			}

			_jumpAllowed = false;
		}
	},

	/*
		Tries to trigger a special event. 
		If the other blob is ready, it might work; otherwhise, the other player is informed via a bubble-y-thing
	*/
	this._triggerSpecial = function() {},

	this.allowJump = function() {
		_jumpAllowed = true;

		if(keyLeftPressed) {
			$('body').trigger('blobanimationChanged', {
				"blobID" : _blobID,
				"animationKey" : AnimationKeys.MOVELEFT
			});
		} else if(keyRightPressed) {
			$('body').trigger('blobanimationChanged', {
				"blobID" : _blobID,
				"animationKey" : AnimationKeys.MOVERIGHT
			});
		} else {
			$('body').trigger('blobanimationChanged', {
				"blobID" : _blobID,
				"animationKey" : AnimationKeys.IDLE1
			});
		}
	},

	this.loadLevel = function(levelID, owID) {
		$('body').trigger('levelLoadRequest', {lvlID: levelID, owID: owID});
	},

	_callDirections = function() {
		if(keyLeftPressed) {
			_currentLeft();
		}

		if(keyRightPressed) {
			_currentRight();
		}

		if(keyUpPressed) { 
			_currentUp();
		}

		if(keyDownPressed) {
			_currentDown();
		}

		/*if(!keyLeftPressed && !keyUpPressed && !keyDownPressed && !keyRightPressed) {
			$('body').trigger('blobanimationChanged', {
				"blobID" : _blobID,
				"animationKey" : AnimationKeys.IDLE1
			});
		} */
	},

	// These functions are called when a button is pressed
	this.onLeftPressed = function(pressed) {
		if(pressed) {
			if(!keyLeftPressed) {
				keyLeftPressed = true;
				keyRightPressed = false;

				if(_jumpAllowed) {
					$('body').trigger('blobanimationChanged', {
						"blobID" : _blobID,
						"animationKey" : AnimationKeys.MOVELEFT
					});
				}
				_leftPressed();
			}
		} else {
			keyLeftPressed = false;
			_leftReleased();
			if(!keyRightPressed && _jumpAllowed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : _blobID,
					"animationKey" : AnimationKeys.IDLE1
				});
			}
		}

		if(_blobID == EntityConfig.GREENBLOBID) {
			$('body').trigger('heliAnimationChanged', {"animationKey": AnimationKeys.MOVELEFT});
		}
	},

	this.onRightPressed = function(pressed) {
		if(pressed) {
			if(!keyRightPressed) {
				keyRightPressed = true;
				keyLeftPressed = false;

				if(_jumpAllowed) {	
					$('body').trigger('blobanimationChanged', {
						"blobID" : _blobID,
						"animationKey" : AnimationKeys.MOVERIGHT
					});
				}

				_rightPressed();
			}
		} else {
			keyRightPressed = false;
			_rightReleased();
			if(!keyLeftPressed && _jumpAllowed) {
				$('body').trigger('blobanimationChanged', {
					"blobID" : _blobID,
					"animationKey" : AnimationKeys.IDLE1
				});
			}
		}

		if(_blobID == EntityConfig.GREENBLOBID) {
			$('body').trigger('heliAnimationChanged', {"animationKey": AnimationKeys.MOVERIGHT});
		}
	},

	this.onUpPressed = function(pressed) {
		if(pressed) {
			if(!keyUpPressed) {
				keyUpPressed = true;
				keyDownPressed = false;
				_upPressed();
			}
		} else {
			keyUpPressed = false;
			_upReleased();
		}
	},

	this.onDownPressed = function(pressed) {
		if(pressed) {
			if(!keyDownPressed) {
				keyDownPressed = true;
				keyUpPressed = false;
				_downPressed();
			}
		} else {
			keyDownPressed = false;
			_downReleased();
		}
	},

	this.onButtonMash = function() {
		if(_currentMash)
			_currentMash();
	},

	// This function can be called from BlobPlayer1 and BlobPlayer2 to change what happens when a button is pressed
	this.setFunction = function(name, newFunction) {
		switch(name) {
			case "upPressed":
				_upPressed = newFunction;
				break;
			case "upReleased":
				_upReleased = newFunction;
				break;
			case "downPressed":
				_downPressed = newFunction;
				break;
			case "downReleased":
				_downReleased = newFunction;
				break;
			case "leftPressed":
				_leftPressed = newFunction;
				break;
			case "leftReleased":
				_leftReleased = newFunction;
				break;
			case "rightPressed":
				_rightPressed = newFunction;
				break;
			case "rightReleased":
				_rightReleased = newFunction;
				break;
			case "currentUp":
				_currentUp = newFunction;
				break;
			case "currentDown":
				_currentDown = newFunction;
				break;
			case "currentLeft":
				_currentLeft = newFunction;
				break;
			case "currentRight":
				_currentRight = newFunction;
				break;
			case "currentMash":
				_currentMash = newFunction;
				break;
		}
	},

	this.setEntity = function(entity){
		_blobEntity = entity;
		_blobID = _blobEntity.GetUserData()[0];
	},

	this.setWaitingForOther = function(waiting) {
		_waitingForOtherBlob = waiting;
	},

	this.getWaitingForOther = function() {
		return _waitingForOtherBlob;
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