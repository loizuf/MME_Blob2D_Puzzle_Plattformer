BlobApp.HintBubble = (function HintBubble(sprite, x_pos, y_pos, sizeX, sizeY, hintID, body) {
	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.hintID = hintID;
	this.body = body;
});