BlobApp.MenuDoor = (function LevelDoor(x_pos, y_pos, sizeX, sizeY, LevelID) {
	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);

	var sprite, tilesetSheet, LvlID;

	this.prototype.init =function() {
		var tileset = new Image();
		this.LevelID = LevelID

		tileset.src = "res/img/levelDoor.png";

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
		sprite.regX = imageData.frames.width / 2;
		sprite.regY = imageData.frames.height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	},

	this.LevelID = LevelID;	
	this.prototype.init();
	this.sprite = sprite;
});