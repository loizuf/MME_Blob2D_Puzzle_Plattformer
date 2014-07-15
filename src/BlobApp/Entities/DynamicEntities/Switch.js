BlobApp.Switch = (function Switch(sprite, x_pos, y_pos, sizeX, sizeY, switchID, body) {
	this.prototype = new DynamicBody(sprite, x_pos, y_pos, sizeX, sizeY);
	this.switchID = switchID;
	this.body = body;
});