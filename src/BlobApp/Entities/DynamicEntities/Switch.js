BlobApp.Switch = (function Switch(sprite, x_pos, y_pos, sizeX, sizeY, switchID) {
	this.prototype = new DynamicBody(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.switchID = switchID;
});