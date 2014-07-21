/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.

	The blob gets most of the user input and tells the model / controller how to react.
*/
BlobApp.BlobSuperClass = function() {

	//var b2Vec2 = Box2D.Common.Math.b2Vec2;

	var _positionX = null,
	_positionY = null,
	// box2d? value
	_velocity = null,
	// Box2D vector
	_direction = null,

	// As the name suggests, 
	_jumpAllowed,
	// Waiting for other blob to trigger a special interaction: No interaction allowed
	_waitingForOtherBlob,
	// Box2D Entity
	_blobEntity,

	REDBLOBXSPEED = 0.4,
	GREENBLOBXSPEED = 0.15, 
	REDBLOBYSPEED = 9.3,
	GREENBLOBYSPEED = 3.8,


	/* 
		current<Direction>: Function that is called when the key is pressed
	 	default<Direction>: Move/Jump/Trigger
	 	can & will be overriden by subclass implementations
	 */
	_currentLeft,
	_currentRight,
	_currentUp,
	_currentDown,

	keyUpPressed,
	keyDownPressed,
	keyLeftPressed,
	keyRightPressed;

//!	 !Must be overriden by subclass!
	this.specialSkills = null,
	// If the blobs are currently doing some fancy interaction
	this.specialInteractionActive = null,




	this.init = function(pX, pY, v, dir){
		_setPropertiesOfBlob(pX, pY, v, dir);

		_setupMovementFunctions();

		// listener methods
		$("body").on("onTick", _callDirections);
	},

	_setPropertiesOfBlob = function(pX, pY, v, dir){
		_positionX = pX;
		_positionY = pY;
		_velocity = v;
		_direction = dir;
	},

	_setupMovementFunctions = function() {
		_currentLeft = _moveLeft;
		_currentRight = _moveRight;
		_currentUp = _jump;
		_currentDown = _triggerSpecial;
	}

	this.killBlob = function(startpX, startpY){
		//_setPropertiesOfBlob(startpX, startpY, 0, 0);
		// Trigger something to kill other blob, wait some time, reset positions
	},


	// Manipulates the movement direction so that the blob moves to the left
	_moveLeft = function() {
		if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID){
			$('body').trigger('onInputRecieved', {entity: _blobEntity, directionX: -1*REDBLOBXSPEED, directionY: 0});
		}else{
			$('body').trigger('onInputRecieved', {entity: _blobEntity, directionX: -1*GREENBLOBXSPEED, directionY: 0});
		}
		
	},

	// Manipulates the movement direction so that the blob moves to the right
	_moveRight = function() {
		if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID){
		$('body').trigger('onInputRecieved',{entity: _blobEntity, directionX: REDBLOBXSPEED, directionY: 0});
		}else{
		$('body').trigger('onInputRecieved',{entity: _blobEntity, directionX: GREENBLOBXSPEED, directionY: 0});
		}
	},

	// Makes the Blob jump
	_jump = function() {
		if(_jumpAllowed != false) {
			if(_blobEntity.GetUserData()[0]==EntityConfig.REDBLOBID){
			$('body').trigger('onInputRecievedJump',{entity: _blobEntity, directionX: 0, directionY: -1*REDBLOBYSPEED});
			}else{
			$('body').trigger('onInputRecievedJump',{entity: _blobEntity, directionX: 0, directionY: -1*GREENBLOBYSPEED});
			}
			_jumpAllowed = false;
		}
	},

	/*
		Tries to trigger a special event. 
		If the other blob is ready, it might work; otherwhise, the other player is informed via a bubble-y-thing
	*/
	_triggerSpecial = function() {

	},

	this.allowJump = function() {
		_jumpAllowed = true;
	},

	_callDirections = function() {
		if(keyLeftPressed) _currentLeft();
		if(keyRightPressed) _currentRight();
		if(keyUpPressed) _currentUp();
		if(keyDownPressed) _currentDown();

	},

	// These functions are called when a button is pressed
	this.onLeftPressed = function(pressed) {
		if(pressed) {
			keyLeftPressed = true;
			keyRightPressed = false;
		} else {
			keyLeftPressed = false;
		}
	},

	this.onRightPressed = function(pressed) {
		if(pressed) {
			keyRightPressed = true;
			keyLeftPressed = false;
		} else {
			keyRightPressed = false;
		}
	},

	this.onUpPressed = function(pressed) {
		if(pressed) {
			keyUpPressed = true;
			keyDownPressed = false;
		} else {
			keyUpPressed = false;
		}
	},

	this.onDownPressed = function(pressed) {
		if(pressed) {
			keyDownPressed = true;
			keyUpPressed = false;
		} else {
			keyDownPressed = false;
		}
	},

	// These functions can be called from outside(?) to change what happens when a button is pressed
	this.setCurrentDown = function(currentDown) {
		_currentDown = currentDown;
	},

	this.setCurrentUp = function(currentUp) {
		_currentUp = currentUp;
	},

	this.setCurrentLeft = function(currentLeft) {
		_currentLeft = currentLeft;
	},

	this.setCurrentRight = function(currentRight) {
		_currentRight = currentRight;
	},

	this.setEntity = function(entity){
		_blobEntity = entity;
	};

	this.init();

	return this;
};