BlobApp.Key = (function Key(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, keyID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.keyID = keyID;
	this.body = body;
});