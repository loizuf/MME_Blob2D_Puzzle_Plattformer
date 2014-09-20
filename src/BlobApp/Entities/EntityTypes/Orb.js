// The rotating ball that indicates a sphere can be created at that point.
BlobApp.Orb = (function Orb(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-25, 25, 25);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/Orb.png";//mapData.tilesets[0].image;
		
		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 25, 25);		
	},

	_listeners = function() {
		$('body').on("onTick", _rotate);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "orb";
		thisVar.prototype.setupSprite(sprite);
		// doesn't need "gotoAndPlay" because if that is left out, the animation just starts and does not stop
		// (which is exactly what is wanted)
	},

	_rotate = function() {
		sprite.rotation += 15; 
	};

	this.prototype.init();
	this.sprite = sprite;
});