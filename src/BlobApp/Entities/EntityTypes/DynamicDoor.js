// The boxes that explode (it was hard to display doors as closed in a two-dimensional side view)
// In the Tilesheet, they still look like doors, though.
BlobApp.DynamicDoor = (function DynamicDoor(x_pos, y_pos, doorID) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	doorID, 
	isOpening;

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

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		thisVar.prototype.setupSprite(sprite);
	},

	_listeners = function() {
		$('body').on('openDoor', _onOpenDoor);
	},
	
	// Checks if this is the door that hsould be opened, if so: plays the open / explosion animation
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



	
	