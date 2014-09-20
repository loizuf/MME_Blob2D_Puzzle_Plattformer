BlobApp.Key = (function Key(x_pos, y_pos, keyID) {
	this.prototype = new BlobApp.Entity(x_pos, y_pos, 30, 30);

	var thisVar = this,
	sprite, tilesetSheet;

	this.prototype.init =function() {
		var tileset = new Image();
		tileset.src = "res/img/key.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 30, 30);		
	},	
	
	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height
			},

			animations : {
				idle0 : [0, 17, "idle1"],
				idle1 : {
						frames : [17, 16, 15, 14, 13, 12, 11, 10,
						 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 
						 next: "idle0"
						}
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;
		sprite.name = "key";
		
		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

		sprite.gotoAndPlay("idle1");
	},

	this.prototype.init();
	this.keyID = keyID;
	this.sprite = sprite;
});