// The "continue" or "new" door
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

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet); 
		thisVar.prototype.setupSprite(sprite);
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
	};

	this.prototype.init();
	this.sprite = sprite;
});