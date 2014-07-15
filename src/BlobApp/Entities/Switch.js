BlobApp.Switch = (function Switch(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, switchID, body) {
	this.prototype = new DynamicBody(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.switchID = switchID;
	this.body = body;
});