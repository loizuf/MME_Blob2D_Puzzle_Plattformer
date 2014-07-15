/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.

	The blob gets most of the user input and tells the model / controller how to react.
*/
BlobApp.BlobSuperClass = function() {
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


	/* 
		current<Direction>: Function that is called when the key is pressed
	 	default<Direction>: Move/Jump/Trigger
	 	can & will be overriden by subclass implementations
	 */
	_currentLeft,
	_currentRight,
	_currentUp,
	_currentDown;

//!	 !Must be overriden by subclass!
	this.specialSkills = null,
	// If the blobs are currently doing some fancy interaction
	this.specialInteractionActive = null,




	this.init = function(pX, pY, v, dir){
		_setPropertiesOfBlob(pX, pY, v, dir);

		_setupMovementFunctions();

		return that;
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


	// Manipulaes the movement direction so that the blob moves to the left
	_moveLeft = function() {

	},

	// Ma
	_moveRight = function() {

	},

	_jump = function() {

	},

	/*
		Tries to trigger a special event. 
		If the other blob is ready, it might work; otherwhise, the other player is informed via a bubble-y-thing
	*/
	_triggerSpecial = function() {

	},

	this.onLeftPressed = function() {
		_currentLeft();
	},

	this.onRightPressed = function() {
		_currentRight();	
	},

	this.onUpPressed = function() {
		_currentUp();
	},

	this.onDownPressed = function() {
		_currentDown();
	},

	this.setCurrentDown = function(currentDown) {
		_currentDown = currentDown;
	},

	this.setCurrentUp = function(currentUp) {
		_currentUp = currentUp;
	},

	this.setCurrentLeft = function(currentLeft) {
		_currentLeft = currentLeft;
	},

	this.ssetCurrentRight = function(currentRight) {
		_currentRight = currentRight;
	};

	return this;
};