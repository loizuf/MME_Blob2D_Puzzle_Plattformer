BlopApp.Trap = (function Trap(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator, trapID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.trapID = trapID;
	this.body = body;
});