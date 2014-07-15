BlobApp.CooperationTrigger = (function CooperationTrigger(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, coopID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.coopID = coopID;
	this.body = body;
});