BlobApp.DynamicDoor = (function DynamicDoor(sprite, x_pos, y_pos, sizeX, sizeY, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.body = body;
});