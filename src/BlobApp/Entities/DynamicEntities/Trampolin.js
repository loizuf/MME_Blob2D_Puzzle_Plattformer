BlobApp.Trampolin = (function Trampolin(x_pos, y_pos, sizeX, sizeY, greenBlobEntity) {

	var that = this,

	sprite, 
	tilesetSheet, 
	tileset,
	oldSprite,
	actor, 
	removedSpriteStop;

	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init = function() {
		tileset = new Image();

		tileset.src = "res/img/trampolin.png"//mapData.tilesets[0].image;

		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX, sizeY);		
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

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		sprite.name = "trampolin";

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
			actor.skin = oldSprite;
			$('body').trigger('trampolinStopRequested', {"sprite" : oldSprite});
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