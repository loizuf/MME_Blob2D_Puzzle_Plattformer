// Bridge special ability visualisation
BlobApp.Bridge = (function Bridge(x_pos, y_pos, direction) {

	var thisVar = this,

	sprite,
	tilesetSheet,
	tileset,
	removedSprite;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 275, 75);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/bridge.png";

		_listeners();

		tileset.onLoad = _initSprite(tileset, 275, 75);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},
			
			animations : {
				startAni: [0, 29, "idle"],
				idle: [30, 39, "idle", 0.1],
				stopSameSide : {
					frames: [29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0]
				},
				stopOtherSide : [40, 59]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "bridge";

		if(direction == "left") {
			sprite.scaleX = -1;
		}

		thisVar.prototype.setupSprite(sprite);
		sprite.gotoAndPlay("startAni");
	},

	this.onRecreate = function(data) {
		sprite.gotoAndPlay("startAni");
		removedSprite = false;
		direction = data.direction;
		if(data.direction == "left") {
			sprite.scaleX = -1;
		} else {
			sprite.scaleX = 1;
		}
	},

	_listeners = function() {
		$('body').on('onTick', _checkIfStopFinished);
		$('body').on('onBridgeDirectionChosen', _animate);
	},

	_animate = function(event, data) {
		switch(data.animationKey) {
			case AnimationKeys.STOP:
				if(data.direction == direction) {
					sprite.gotoAndPlay("stopSameSide");
				} else {
					sprite.gotoAndPlay("stopOtherSide");
				}
			break;
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && 
			((sprite.currentAnimation == "stopSameSide" && sprite.currentAnimationFrame == 29) || 
				(sprite.currentAnimation == "stopOtherSide" && sprite.currentAnimationFrame == 19))) {
			$('body').trigger('specialFinished', {'specialName' : "bridge"});
			$('body').trigger('bridgeStopRequested');
			sprite.stop();

			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			removedSprite = true;
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});