BlobApp.StaticDoor = (function StaticDoor(sprite, x_pos, y_pos, sizeX, sizeY, doorID, body) {
	this.prototype = new StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.doorID = doorID;
	this.body = body;
});