BlobApp.HintBubble = (function HintBubble(x_pos, y_pos, sizeX, sizeY, hintID) {
	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	
	this.hintID = hintID;
});