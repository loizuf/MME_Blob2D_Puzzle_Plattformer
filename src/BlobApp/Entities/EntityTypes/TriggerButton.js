// Trigger button visualisation (the buttons that destroy doors)
BlobApp.TriggerButton = (function TriggerButton(x_pos, y_pos, buttonID) {
	var thisVar = this,

	sprite, 
	tilesetSheet,
	buttonID;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 25 , 25);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/button.png";

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

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "generic";
		thisVar.prototype.setupSprite(sprite);
		
		sprite.gotoAndPlay("idle");
	},

	_listeners = function(){
		$("body").on("buttonActivated", _animate);
	},

	_animate = function(event, data){
		if(data.userData[1] == buttonID) {
			sprite.gotoAndPlay("press");
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});



	
	