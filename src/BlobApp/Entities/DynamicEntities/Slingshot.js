BlobApp.Slingshot = (function Slingshot(x_pos, y_pos, sizeX, sizeY) {
	var that = this,

	sprite,
	tilesetSheet,
	tileset,
	blobSprites,
	removedSprite,
	stopStarted,
	strength,
	angle;

	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/slingshot.png"; // mapdata.tilesets[0].image

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
				stable : [0,0],
				load: [1, 18, "loaded"],
				loaded: [18, 18],
				stop: [19, 20, "stable"]
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
		sprite.gotoAndPlay("stable");
	},

	_listeners = function() {
		$('body').on('onTick', _checkIfStopFinished);
		$('body').on('animateSlingshot', _animate);
		$('body').on('startSlingshot', _triggerSlingshotStart);

		$('body').on('onSlingshotShot', shootSlingshot);

	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.LOAD:
				sprite.gotoAndPlay("load");
			break;
			case AnimationKeys.FIRE:
				sprite.gotoAndPlay("fire");
			break;
			case AnimationKeys.STOP:	
			break;
		}	
	},

	_triggerSlingshotStart = function() {
		$('body').trigger('onStartSlingshot', {slingshotEntity : that});
	},

	shootSlingshot = function(event, data) {
		strength = data.force;
		angle = data.angle;	
		if(!stopStarted) {	
			stopStarted = true;
			sprite.gotoAndPlay("stop");
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 1) {
			$('body').trigger('specialFinished', {'specialName' : "slingshot"});
			$('body').trigger('slingshotFinished', {'xPos' : x_pos,
												    'yPos' : y_pos,
													'force' : strength,
													'angle' : angle});
			$('body').trigger('slingshotStopRequested', {"sprites" : blobSprites});

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