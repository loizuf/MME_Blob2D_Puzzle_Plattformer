// Helicopter visualisation
BlobApp.Heli = (function Heli(x_pos, y_pos) {

	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset,
	removedSprite;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 50);
	
	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/Heli.png";

		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 50);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations: {
				startAni: [0,19, "moveRight"],
				moveRight: [20, 39],
				moveLeft: [40, 59],
				stop: [60, 79],
				death: [80, 93, "afterDeath"],
				afterDeath: [94, 94, "afterDeath"]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "heli";
		thisVar.prototype.setupSprite(sprite);

		sprite.gotoAndPlay("startAni");
	},

	this.onRecreate = function() {
		sprite.gotoAndPlay("startAni");
		removedSprite = false;
	},

	_listeners = function() {
		$('body').on('heliAnimationChanged', _animate);
		$('body').on('onTick', _checkIfStopFinished);
	},

	_animate = function(event, data) {	
		if(sprite.currentAnimation == "death" || sprite.currentAnimation == "afterDeath") return;
		switch(data.animationKey){
			case AnimationKeys.MOVERIGHT:
				if(sprite.currentAnimation != "moveRight") {
					sprite.gotoAndPlay("moveRight");
				}
			break;
			
			case AnimationKeys.MOVELEFT:
				if(sprite.currentAnimation != "moveLeft") {
					sprite.gotoAndPlay("moveLeft");
				}
			break;
			
			case AnimationKeys.STOP:
				if(sprite.currentAnimation != "stop") {
					sprite.gotoAndPlay("stop");
				}
			break;

			case AnimationKeys.DEATH:
				if(sprite.currentAnimation != "death") {
					sprite.gotoAndPlay("death");
				}
		}
	},

	_checkIfStopFinished = function() {
		if(!removedSprite && sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 19) {
			$('body').trigger('specialFinished', {'specialName' : "heli"});
			$('body').trigger('heliStopRequested');
			sprite.stop();
			
			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			removedSprite = true;
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});