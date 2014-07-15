BlobApp.Platform = (function Platform(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator) {
	this.prototype = new StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.prototype.applyPhysicsBody = function() { 

	};
});