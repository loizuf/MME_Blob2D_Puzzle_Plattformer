BlobApp.StaticEntity = (function StaticEntity(sprite, x_pos, y_pos, sizeX, sizeY) {
	this.prototype = new Entity(x_pos, y_pos, sizeX, sizeY);
	this.sprite = sprite;
	
});