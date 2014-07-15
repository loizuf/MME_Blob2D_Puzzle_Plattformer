BlobApp.Blob = (function Blob(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, blobID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.blobID = blobID;
	this.body = body;
});