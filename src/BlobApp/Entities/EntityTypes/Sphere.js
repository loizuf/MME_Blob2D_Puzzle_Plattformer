BlobApp.Sphere = (function Sphere(x_pos, y_pos, sizeX, sizeY) {

	var that = this,

	sprite,
	tilesetSheet,
	tileset,
	blobSprites,
	removedSprite,
	stopStarted;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, sizeX, sizeY);

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
				roll: [33, 33],
				stop: {
					frames: [33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
						19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
					}
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
		$('body').on('stopSphere', _stopSphere);
		$('body').on('onTick', _checkIfStopFinished);
	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.STOP:
				sprite.gotoAndPlay("stop");
			break;
		}	
	},

	_stopSphere = function() {
		if(!stopStarted) {
			stopStarted = true;
			_animate(null, {"animationKey" : AnimationKeys.STOP})
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 32) {
			$('body').trigger('specialFinished', {'specialName' : "sphere"});
			$('body').trigger('sphereStopRequested', {"sprites" : blobSprites});
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