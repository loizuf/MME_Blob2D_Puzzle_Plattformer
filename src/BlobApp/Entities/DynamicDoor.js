BlobApp.DynamicDoor = (function DynamicDoor(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.body = body;
});