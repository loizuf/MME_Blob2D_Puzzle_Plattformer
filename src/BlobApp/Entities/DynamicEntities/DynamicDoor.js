BlobApp.DynamicDoor = (function DynamicDoor(x_pos, y_pos, sizeX, sizeY, doorID) {
	var that = this,

	sprite, tilesetSheet, doorID, easleID, isOpening;

	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		this.doorID  = doorID;

		var tileset = new Image();

		tileset.src = "res/img/DoorAnim.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
		_listeners();
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height
			},

			animations: {
				open : [0, 9, "opened", 1],
				opened: [9, 9]
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos + 12;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		easleID = sprite.id;
	},

	_listeners = function() {
		$('body').on('openDoor', _onOpenDoor);
	},
	
	_onOpenDoor = function(event, givenID) {
		if(!isOpening && doorID == givenID && !(sprite.currentAnimation=="opened")){
			sprite.gotoAndPlay("open");
			isOpening = true;	
		}
	}

	this.prototype.init();
	this.sprite = sprite;
});



	
	