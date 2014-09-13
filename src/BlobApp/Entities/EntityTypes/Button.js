BlobApp.TriggerButton = (function Button(x_pos, y_pos, buttonID) {
	var that = this,

	sprite, 
	tilesetSheet,
	buttonID;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, 25 , 25);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/button.png"//mapData.tilesets[0].image;

		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 25, 25);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				"idle" : [0, 0, "idle"],
				"press" : [1, 5, "pressed"],
				"pressed" : [6, 6, "pressed"]
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		sprite.name = "generic";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;
		
		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("idle");
	},

	_listeners = function(){
		$("body").on("buttonActivated", _animate);
	},

	_animate = function(event, data){
		if(data.userData[0] == buttonID) {
			sprite.gotoAndPlay("press");
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});



	
	