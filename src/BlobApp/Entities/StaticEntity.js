BlobApp.StaticEntity = (function StaticEntity(sprite) {
	this.prototype = new Entity(x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.prototype.applyPhysicsBody = function() { 

	};

	this.sprite = sprite;
	
});