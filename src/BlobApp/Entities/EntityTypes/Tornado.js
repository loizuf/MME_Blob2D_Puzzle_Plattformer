BlobApp.Tornado = (function Tornado(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-37.5, 50, 50);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/tornado.png";//mapData.tilesets[0].image;
		
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

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "tornado";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("");
	};

	this.prototype.init();
	this.sprite = sprite;
});