BlobApp.Key = (function Key(sprite, x_pos, y_pos, sizeX, sizeY, keyID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.keyID = keyID;
	this.body = body;
});