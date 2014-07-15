BlobApp.Entity = (function Entity(x_pos, y_pos, sizeX, sizeY) {
	this.x_coordinate = x_pos;
	this.y_coordinate = y_pos;
	this.sizeX = sizeX;
	this.sizeY = sizeY;

	//intended for overríde
	this.applyPhysicsBody = function() {};
});