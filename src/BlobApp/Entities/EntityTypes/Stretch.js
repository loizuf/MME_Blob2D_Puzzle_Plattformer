// The Stretch visualisation (the red blob's single special ability)
BlobApp.Stretch = (function Stretch (x_pos, y_pos) {

	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset,
	removedSprite;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 25, 100);

	this.prototype.init = function() {
		tileset = new Image();

		tileset.src = "res/img/stretch.png";

		_listeners();

		tileset.onLoad = _initSprite(tileset, 25, 100);
	}

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations: {
				init: [0, 19, "idle"],
				idle: [20, 39],
				stop: [40, 59]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "stretch";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("init");
	},

	_listeners = function() {
		$('body').on('stretchAnimationChanged', _animate);
		$('body').on('onTick', _checkIfStopFinished);
		$('body').on('onTick', _checkIfInitFinished);
	},

	this.onRecreate = function() {
		sprite.gotoAndPlay("init");
		removedSprite = false;
	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.IDLE1:
				sprite.gotoAndPlay("idle");
			break;
			case AnimationKeys.STOP:
				sprite.gotoAndPlay("stop");
			break;
			case AnimationKeys.STRETCH:
				sprite.gotoAndPlay("stretch");
			break;
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('stretchStopRequested');
			sprite.stop();
			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as we had hoped)
			removedSprite = true;
			$('body').trigger('stretchInitRequested');
		}
	},

	_checkIfInitFinished = function() {
		if(sprite.currentAnimation == "init" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('stretchInitRequested');
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});