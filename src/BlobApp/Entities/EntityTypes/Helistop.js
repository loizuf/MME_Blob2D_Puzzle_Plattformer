// The sign that indicates where the heli gets disassembled
BlobApp.Helistop = (function Helistop(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-38, 35, 55);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/Helistop.png";//mapData.tilesets[0].image;
		
		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 35, 55);		
	},

	_listeners = function() {
		$('body').on("startHeli", _setActive);		
		$('body').on('specialFinished', _setInactive);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				idle: [0, 0, "idle"],
				active: [0, 1, "active", 0.01]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "tornado";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("idle");
	},

	_setActive = function() {
		sprite.gotoAndPlay("active");
	},

	_setInactive = function(event, data) {
		if(data.specialName == "heli") {
			sprite.gotoAndPlay("idle");
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});