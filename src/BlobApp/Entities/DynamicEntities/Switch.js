BlobApp.Switch = (function Switch(x_pos, y_pos, sizeX, sizeY, switchID) {
	this.prototype = new BlobApp.DynamicBody(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	
	this.switchID = switchID;
});