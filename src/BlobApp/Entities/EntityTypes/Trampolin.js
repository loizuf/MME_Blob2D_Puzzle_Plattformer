// The trampolin visualisation (the green blob's single special ability)
BlobApp.Trampolin = (function Trampolin(x_pos, y_pos, greenBlobEntity) {

	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset,
	oldSprite,
	actor, 
	removedSpriteStop;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 25);
	
	this.prototype.init = function() {
		tileset = new Image();

		tileset.src = "res/img/trampolin.png";

		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 25);		
	},

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
				bounce: [40, 46, "idle"],
				stop: [60, 79],
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "trampolin";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("init");
	},

	this.onRecreate = function() {
		sprite.gotoAndPlay("init");
		removedSpriteStop = false;
	},

	_listeners = function() {
		$('body').on('trampolinAnimationChanged', _animate);
		$('body').on('onTick', _checkIfStopFinished);
		$('body').on('onTick', _checkIfInitFinished);
	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.IDLE1:
				sprite.gotoAndPlay("idle");
			break;
			case AnimationKeys.STOP:
				sprite.gotoAndPlay("stop");
			break;
			case AnimationKeys.BOUNCE:
				sprite.gotoAndPlay("bounce");
			break;
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSpriteStop && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('trampolinStopRequested');
			sprite.stop();
			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			removedSpriteStop = true;
			$('body').trigger('trampolinInitRequested');
		}
	},

	_checkIfInitFinished = function() {
		if(sprite.currentAnimation == "init" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('trampolinInitRequested');
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});