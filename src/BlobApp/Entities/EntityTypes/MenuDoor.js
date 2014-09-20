BlobApp.MenuDoor = (function MenuDoor(x_pos, y_pos, doorType) {
	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 75);

	var thisVar = this,
		sprite, tilesetSheet;

	this.prototype.init =function() {
		var tileset = new Image();
		

		tileset.src = _getTileset(tileset, doorType);

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 75);		
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

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = imageData.frames.width / 2;
		sprite.regY = imageData.frames.height / 2;

		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	},

	_getTileset = function(tileset, doorType) {
		switch (doorType){
			case EntityConfig.NEWGAMEDOOR:
				return "res/img/newGameDoor.png";
			break;
			case EntityConfig.CONTINUEDOOR:
				return "res/img/continueDoor.png";
			break;
		}
	},

	this.prototype.init();
	this.sprite = sprite;
});