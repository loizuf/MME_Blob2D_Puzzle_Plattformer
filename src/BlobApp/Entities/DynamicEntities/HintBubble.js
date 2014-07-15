BlobApp.HintBubble = (function HintBubble(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, hintID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.hintID = hintID;
	this.body = body;
});