BlobApp.StaticDoor = (function StaticDoor(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, doorID, body) {
	this.prototype = new StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.doorID = doorID;
	this.body = body;
});