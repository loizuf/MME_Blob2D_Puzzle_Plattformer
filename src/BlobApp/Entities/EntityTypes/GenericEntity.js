BlobApp.GenericEntity = (function GenericEntity(tilesetSheet, x, y, positionInSprite) {
	var that = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x, y, DEFAULT_TILE_SIZE, DEFAULT_TILE_SIZE);
	
	this.prototype.init =function() {
		sprite = new createjs.Sprite(tilesetSheet);

		sprite.gotoAndStop(positionInSprite);

		sprite.name = "generic";

		// isometrix tile positioning based on X Y order from Tile
		sprite.x = x;
		sprite.y = y;

		sprite.regX = Math.floor(DEFAULT_TILE_SIZE/2);
		sprite.regY = Math.floor(DEFAULT_TILE_SIZE/2);
	},

	this.prototype.init();
	this.sprite = sprite;
});