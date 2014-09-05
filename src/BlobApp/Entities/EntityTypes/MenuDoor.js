BlobApp.MenuDoor = (function MenuDoor(x_pos, y_pos, sizeX, sizeY, doorType) {
	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);

	var sprite, tilesetSheet;

	this.prototype.init =function() {
		var tileset = new Image();
		

		tileset.src = _getTileset(tileset, doorType);

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

	_getTileset = function(tileset, doorType) {
		switch (doorType){
			case 0:
				return "res/img/newGameDoor.png";
			break;
			case 1:
				return "res/img/continueDoor.png";
			break;
		}
	},

	this.prototype.init();
	this.sprite = sprite;
});