BlobApp.Trap = (function Trap(sprite, x_pos, y_pos, sizeX, sizeY, trapID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.trapID = trapID;
	this.body = body;
});