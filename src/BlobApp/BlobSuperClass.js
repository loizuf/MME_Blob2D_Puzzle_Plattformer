/*
	This is a logical represantation of the blob (player character).
	This is the super-class which contains everything both player need.
*/
BlobApp.BlobSuperClass = (function() {
	var that = {},
	_positionX = null,
	_positionY = null,
	_velocity = null,
	_direction = null,



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
		_setPropertiesOfBlob(startpX, startpY, 0, 0);
	},

	that.init = init;
	return that;
})();