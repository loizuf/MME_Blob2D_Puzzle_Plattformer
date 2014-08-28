BlobApp.Slingshot = (function Slingshot(x_pos, y_pos, sizeX, sizeY) {
	var that = this,

	sprite,
	tilesetSheet,
	tileset,
	blobSprites,
	removedSprite,
	stopStarted;

	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/Slingshot.png"; // mapdata.tilesets[0].image

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
				
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "slingshot";

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
		$('body').on('stopSlingshot', _stopSlingshot);
		$('body').on('onTick', _checkIfStopFinished);
	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.STOP:
				sprite.gotoAndPlay("stop");
			break;
		}	
	},

	_stopSlingshot = function() {
		if(!stopStarted) {
			stopStarted = true;
			_animate(null, {"animationKey" : AnimationKeys.STOP})
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 32) {
			$('body').trigger('specialFinished', {'specialName' : "slingshot"});
			$('body').trigger('slingshotStopRequested', {"sprites" : blobSprites});
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