BlobApp.Key = (function Key(sprite, x_pos, y_pos, sizeX, sizeY, keyID) {
	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.keyID = keyID;
});