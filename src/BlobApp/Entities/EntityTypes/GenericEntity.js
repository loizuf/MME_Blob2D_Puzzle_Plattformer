// An entity that gets taken from the Spritesheet without alterations or any animations (ground, spikes etc.)
BlobApp.GenericEntity = (function GenericEntity(tilesetSheet, x, y, positionInSprite) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x, y, DEFAULT_TILE_SIZE, DEFAULT_TILE_SIZE);
	
	this.prototype.init =function() {
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.gotoAndStop(positionInSprite);
		sprite.name = "generic";
		thisVar.prototype.setupSprite(sprite);
	},

	this.prototype.init();
	this.sprite = sprite;
});