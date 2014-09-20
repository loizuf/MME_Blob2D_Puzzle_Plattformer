BlobApp.DynamicDoor = (function DynamicDoor(x_pos, y_pos, doorID) {
	var thisVar = this,

	sprite, tilesetSheet, doorID, easleID, isOpening;

	this.prototype = new BlobApp.Entity(x_pos, y_pos+2.5, 50, 75);
	
	this.prototype.init =function() {
		this.doorID  = doorID;

		var tileset = new Image();

		tileset.src = "res/img/DoorAnim.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 75);		
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
				open : [0, 13, "opened", 1],
				opened: [13, 13]
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

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
			$('body').trigger("onCameraShakeRequested", {direction: "left"});
			isOpening = true;	
		}
	}

	this.prototype.init();
	this.sprite = sprite;
});



	
	