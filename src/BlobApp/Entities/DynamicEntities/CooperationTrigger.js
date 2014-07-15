BlobApp.CooperationTrigger = (function CooperationTrigger(sprite, x_pos, y_pos, sizeX, sizeY, coopID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.coopID = coopID;
	this.body = body;
});