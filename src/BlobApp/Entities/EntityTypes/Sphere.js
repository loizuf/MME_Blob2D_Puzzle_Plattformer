// The sphere special ability visualisation
BlobApp.Sphere = (function Sphere(x_pos, y_pos) {

	var thisVar = this,

	sprite,
	tilesetSheet,
	tileset,
	removedSprite,
	stopStarted;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 50);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/Sphere.png";

		_listeners();

		tileset.onLoad = _initSprite(tileset, 50, 50);
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
				roll: [33, 39, "roll", 0.5],
				stop: {
					frames: [33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
						19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
					}
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "sphere";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("startAni");
	},

	this.onRecreate = function() {
		sprite.gotoAndPlay("startAni");
		removedSprite = false;
		stopStarted = false;
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
			$('body').trigger('sphereStopRequested');
			sprite.stop();

			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as we had hoped)
			removedSprite = true;
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});