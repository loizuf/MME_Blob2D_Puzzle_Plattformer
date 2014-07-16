BlobApp.CooperationTrigger = (function CooperationTrigger(sprite, x_pos, y_pos, sizeX, sizeY, coopID) {
	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function() { 

	};
	this.coopID = coopID;
});