BlobApp.DynamicEntity = (function DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY) {
	this.prototype = new Entity(x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};

	this.sprite = sprite;

});
	
	
