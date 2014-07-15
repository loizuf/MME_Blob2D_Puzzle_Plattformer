BlobApp.DynamicEntity = (function DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY, shapeIndicator) {
	this.prototype = new Entity(x_pos, y_pos, sizeX, sizeY, shapeIndicator);
	this.prototype.applyPhysicsBody() = function() {

	};
	this.sprite = sprite;
	
	return this;
});