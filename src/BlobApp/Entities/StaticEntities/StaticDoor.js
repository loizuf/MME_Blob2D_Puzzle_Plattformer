BlobApp.StaticDoor = (function StaticDoor(x_pos, y_pos, sizeX, sizeY, doorID) {
	this.prototype = new BlobApp.StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	
	this.doorID = doorID;
});