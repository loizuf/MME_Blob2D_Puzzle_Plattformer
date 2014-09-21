// These dimension-gate-thingys indicate where the teleport special ability can be triggered
BlobApp.Teleport = (function Teleport(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-37.5, 30, 50);
	
	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/teleporter.png";
		
		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 30, 50);		
	},

	_listeners = function() {
		$('body').on("startTele", _animate);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				idle: [0, 31, "idle", 0.25],
				teleport: [32, 51, "afterTeleport"],
				afterTeleport: {
					frames: [51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32],
					next: "idle"
				}
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "teleport";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("idle");
	},

	_animate = function() {
		sprite.gotoAndPlay("teleport");
	};

	this.prototype.init();
	this.sprite = sprite;
});