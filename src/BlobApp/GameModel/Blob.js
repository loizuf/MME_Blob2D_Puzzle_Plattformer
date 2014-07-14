/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.

	The blob gets most of the user input and tells the model / controller how to react.
*/
BlobApp.BlobSuperClass = (function() {
	var that = {},
	_positionX = null,
	_positionY = null,
	// box2d? value
	_velocity = null,
	// Box2D vector
	_direction = null,

	// As the name suggests, 
	jumpAllowed,
	// Waiting for other blob to trigger a special interaction: No interaction allowed
	waitingForOtherBlob,
//!	 !Must be overriden by subclass!
	specialSkills,
	// If the blobs are currently doing some fancy interaction
	specialInteractionActive

	init = function(pX, pY, v, dir){
		_setPropertiesOfBlob(pX, pY, v, dir);
		return that;
	},

	_setPropertiesOfBlob = function(pX, pY, v, dir){
		_positionX = pX;
		_positionY = pY;
		_velocity = v;
		_direction = dir;
	},

	killBlob = function(startpX, startpY){
		//_setPropertiesOfBlob(startpX, startpY, 0, 0);
		// Trigger something to kill other blob, wait some time, reset positions
	},


	_jump = function() {

	},

	/*
		Tries to trigger a special event. 
		If the other blob is ready, it might work; otherwhise, the other player is informed via a bubble-y-thing


	*/
	_triggerSpecial = function() {

	},

	// This if/else thing probably could be overriden in a better way. TODO
	onLeftPressed = function() {
		if(!specialInteractionActive) {
			// move to the left
		} else {

		}
	},

		// This if/else thing probably could be overriden in a better way. TODO
	onRightPressed = function() {
		if(!specialInteractionActive) {
			// move to the right
		} else {
			
		}	
	},

	// if jumpAllowed is true: Jump, else: if specialInteraction: do stuff, else: do nothing
	onUpPressed = function() {
	/*	if(specialInteraction) {

		} else if(jumpAllowed) {

		} else {

		} */
	},

	onDownPressed = function() {
	/*	if(specialInteraction) {

		} else {
			_triggerSpecial();
		}*/
	};


	that.onLeftPressed = onLeftPressed;
	that.onRightPressed = onRightPressed;
	that.onUpPressed = onUpPressed;
	that.onDownPressed = onDownPressed;
	that.init = init;

	return that;
})();