/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.
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

	init = function(pX, pY, v, dir){
		_setPropertiesOfBlob(pX, pY, v, dir);
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

	// if jumpAllowed is true: Jump, else: do nothing
	jump = function() {

	},


	that.init = init;
	return that;
})();