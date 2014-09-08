BlobApp.Goal = (function Goal(x_pos, y_pos, sizeX, sizeY, GOALID) {
	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);

	var sprite, tilesetSheet;

	this.prototype.init =function() {
		var tileset = new Image();

		tileset.src = "res/img/levelDoor.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
		_listeners();
	},	

	_listeners = function() {
		$('body').on("animateGoal", thisVar._animate);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
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

		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

		sprite.gotoAndPlay("locked");
	},

	thisVar._animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.OPEN:
				sprite.gotoAndPlay("open");
				break;
			case AnimationKeys.UNLOCK:
				sprite.gotoAndPlay("unlock");
				break;
		}
	};

	this.prototype.init();
	this.keyID = GOALID;
	this.sprite = sprite;
});