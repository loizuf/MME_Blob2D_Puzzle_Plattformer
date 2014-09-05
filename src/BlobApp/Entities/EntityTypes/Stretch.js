BlobApp.Stretch = (function Stretch (x_pos, y_pos, sizeX, sizeY, redBlobEntity) {

	var that = this,

	sprite, 
	tilesetSheet, 
	tileset,
	oldSprite,
	actor, 
	removedSprite;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, sizeX, sizeY);

	this.prototype.init = function() {
		tileset = new Image();

		tileset.src = "res/img/stretch.png";

		_listeners();

		tileset.onLoad = _initSprite(tileset, sizeX, sizeY);
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

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		sprite.name = "stretch";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width / 2;
		sprite.regY = imageData.frames.height / 2;
		
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("init");
	},

	_listeners = function() {
		$('body').on('stretchAnimationChanged', _animate);
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
			case AnimationKeys.STRETCH:
				sprite.gotoAndPlay("stretch");
			break;
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 19) {
			actor.skin = oldSprite;
			$('body').trigger('stretchStopRequested', {"sprite" : oldSprite});
			sprite.stop();
			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			removedSprite = true;
			$('body').trigger('stretchInitRequested');
		}
	},

	_checkIfInitFinished = function() {
		if(sprite.currentAnimation == "init" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('stretchInitRequested');
		}
	},

	this.setActor = function(actorVar) {
		actor = actorVar;
	},

	this.setOldSprite = function(spriteVar) {
		oldSprite = spriteVar;
	};

	this.prototype.init();
	this.sprite = sprite;
});