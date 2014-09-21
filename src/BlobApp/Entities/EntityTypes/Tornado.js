// The tornado indicates that the heli special ability can be triggered at this point
BlobApp.Tornado = (function Tornado(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-37.5, 50, 50);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/tornado.png";
		
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 50);		
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
		sprite.name = "tornado";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("");
	};

	this.prototype.init();
	this.sprite = sprite;
});