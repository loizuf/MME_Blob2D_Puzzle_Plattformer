BlopApp.Entity = (function Entity(x_pos, y_pos, sizeX, sizeY, shapeIndicator) {
	this.x_coordinate = x_pos;
	this.y_coordinate = y_pos;
	this.sizeX = sizeX;
	this.sizeY = sizeY;
	this.shapeIndicator = shapeIndicator;

	this.applyToStage = function() {
		//callback for view
	};

	this.onCollision = function() {
		//callback
	};

	//intended for overríde
	this.applyPhysicsBody = function() {};
})();