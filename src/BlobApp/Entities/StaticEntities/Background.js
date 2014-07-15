BlobApp.Platform = (function Platform(sprite, x_pos, y_pos, sizeX, sizeY, body) {
	this.prototype = new StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.body = body;
});