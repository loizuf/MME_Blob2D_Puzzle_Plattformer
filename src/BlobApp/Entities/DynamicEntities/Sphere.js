BlobApp.Sphere = (function Sphere(x_pos, y_pos, sizeX, sizeY) {

	var that = this,

	sprite,
	tilesetSheet,
	tileset,
	blobSprites,
	removedSprite;

	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/Sphere.png"; // mapdata.tilesets[0].image

		_listeners();

		tileset.onLoad = _initSprite(tileset, sizeX, sizeY);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},
			
			animations : {
				startAni : [0, 33, "roll"],
				roll: [33, 33]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "sphere";

		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.regX = imageData.frames.width / 2;
		sprite.regY = imageData.frames.height / 2;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("startAni");
	},

	_listeners = function() {
		$('body').on('onTick', _checkIfStopFinished);
	},

	_animate = function(event, data) {
		//needs stuff
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('specialFinished', {'specialName' : "bridge"});
			$('body').trigger('bridgeStopRequested', {"sprites" : blobSprites});
			sprite.stop();

			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			removedSprite = true;
		}
	},

	this.setBlobSprites = function(sprites) {
		blobSprites = sprites;
	};

	this.prototype.init();
	this.sprite = sprite;
});