BlobApp.LevelDoor = (function LevelDoor(x_pos, y_pos, LevelID, owID) {
	this.prototype = new BlobApp.Entity(x_pos, y_pos+10, 50, 60);

	var sprite, tilesetSheet, LvlID;
	var thisVar = this;

	this.prototype.init =function() {
		var tileset = new Image();
		thisVar.LevelID = LevelID
		thisVar.owID = owID;

		tileset.src = "res/img/levelDoor.png";

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 60);		
		_listeners();
	},

	_listeners = function() {
		$("body").on("animateLevelDoor", thisVar._animate);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height
			},

			animations: {
				idle: [0, 0, "idle"],
				open: [0, 9, "opened"],
				opened: [9, 9],
				locked: [10, 10, "locked"],
				unlock: [10, 17, "idle"]
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

		gameState = BlobApp.GlobalState.getGameState();

		if(gameState.currentOverworldMapID > thisVar.owID || 
			(gameState.currentOverworldMapID == thisVar.owID && gameState.currentLevel >= thisVar.LevelID)) {
			sprite.gotoAndPlay("idle");
		} else {
			sprite.gotoAndPlay("locked");
		}

	},

	thisVar._animate = function(event, data) {
		if(LevelID == data.lvlID) {
			sprite.gotoAndPlay("open");
		}
	};

	this.LevelID = LevelID;	
	this.prototype.init();
	this.sprite = sprite;
});