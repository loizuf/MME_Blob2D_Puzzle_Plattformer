BlobApp.Key = (function Key(x_pos, y_pos, sizeX, sizeY, keyID) {
	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);

	var sprite, tilesetSheet;

	this.prototype.init =function() {
		var tileset = new Image();
		tileset.src = "res/img/key.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
	},	
	
	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
				count: 1
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;
		
		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	},

	this.prototype.init();
	this.keyID = keyID;
	this.sprite = sprite;
});