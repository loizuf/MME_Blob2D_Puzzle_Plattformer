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
		console.log(_currentLeft);
	}

	this.killBlob = function(startpX, startpY){
		//_setPropertiesOfBlob(startpX, startpY, 0, 0);
		// Trigger something to kill other blob, wait some time, reset positions
	},


	// Manipulates the movement direction so that the blob moves to the left
	_moveLeft = function() {
		/*if(_blobEntity.m_linearVelocity.x>-5){
		_blobEntity.ApplyImpulse(new b2Vec2(-1, 0), _blobEntity.GetPosition());
		}*/

	},

	// Manipulates the movement direction so that the blob moves to the right
	_moveRight = function() {

	},

	// Makes the Blob jump
	_jump = function() {

	},

	/*
		Tries to trigger a special event. 
		If the other blob is ready, it might work; otherwhise, the other player is informed via a bubble-y-thing
	*/
	_triggerSpecial = function() {

	},

	// These functions are called when a button is pressed
	this.onLeftPressed = function() {
		console.log("onLeftPressed");
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