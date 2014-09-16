BlobApp.Slingshot = (function Slingshot(x_pos, y_pos, direction) {
	var thisVar = this,

	sprite,
	tilesetSheet,
	tileset,
	blobSprites,
	stopStarted,
	strength,
	angle;
	this.direction = direction;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 75, 75);

	this.prototype.init = function() {
		tileset = new Image();
		tileset.src = "res/img/slingshot.png"; // mapdata.tilesets[0].image

		_listeners();

		tileset.onLoad = _initSprite(tileset, 75, 75);
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
				stop: [19, 25, "stable"],
				clutch1 : [26, 29, "clutch1after"],
				clutch1after : [29, 29],
				clutch2 : [39, 42, "clutch2after"],
				clutch2after : [42, 42],
				clutch3 : [52, 55, "clutch3after"],
				clutch3after : [55, 55],
				clutch4 : [65, 68, "clutch4after"],
				clutch4after : [68, 68],
				clutch5: [78, 81, "clutch5after"],
				clutch5after: [81, 81],
				loosen1 : {
						frames: [29, 27, 28, 26],
						next: "loaded"
					},
				loosen2 : {
						frames: [42, 41, 40, 39],
						next: "clutch1after"
					},
				loosen3 : {
						frames: [55, 54, 53, 52],
						next: "clutch2after"
					},
				loosen4 : {
						frames: [68, 67, 66, 65],
						next: "clutch3after"
					},
				loosen5 : {
						frames: [81, 80, 79, 78],
						next: "clutch4after"
					}
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "slingshot";

		sprite.regX = width / 2;
		sprite.regY = height / 2;

		thisVar.direction = direction;
		if(thisVar.direction == "right") {
			sprite.scaleX = -1;
		}

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

		$('body').on('onSlingshotShot', _shootSlingshot);

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
			case AnimationKeys.CLUTCH:
				_clutchSlingshot();
			break;
			case AnimationKeys.LOOSEN:
				_loosenSlingshot();
			break;
		}	
	},

	_clutchSlingshot = function() {
		animationName = "";
		switch(sprite.currentAnimation) {
			case "loaded":
				animationName = "clutch1";
				break;
			case "clutch1after" :
				animationName = "clutch2";
				break;
			case "clutch2after" :
				animationName = "clutch3";
				break;
			case "clutch3after" :
				animationName = "clutch4";
				break;
			case "clutch4after" :
				animationName = "clutch5";
				break;
			default:
				return;
		}
		$('body').trigger('soundSlingshotClutched');
		sprite.gotoAndPlay(animationName);
	},

	_loosenSlingshot = function() {
		animationName = "";
		switch(sprite.currentAnimation) {
			case "clutch1after" :
				animationName = "loosen1";
				break;
			case "clutch2after" :
				animationName = "loosen2";
				break;
			case "clutch3after" :
				animationName = "loosen3";
				break;
			case "clutch4after" :
				animationName = "loosen4";
				break;
			case "clutch5after" :
				animationName = "loosen5";
				break;
			default: return;

		}
		$('body').trigger('soundSlingshotLoosened');
		sprite.gotoAndPlay(animationName);

	},

	_triggerSlingshotStart = function() {
		$('body').trigger('onStartSlingshot', {slingshotEntity : thisVar});
	},

	_shootSlingshot = function(event, data) {
		strength = data.force;
		angle = data.angle;	
		direction = data.direction;

		if(!stopStarted) {	
			stopStarted = true;
			sprite.gotoAndPlay("stop");
		}
	},

	_checkIfStopFinished = function() {
		if(sprite.currentAnimation == "stop" && sprite.currentAnimationFrame == 1) {
			$('body').trigger('specialFinished', {'specialName' : "slingshot"});
			$('body').trigger('slingshotFinished', {'xPos' : x_pos,
												    'yPos' : y_pos,
													'force' : strength,
													'angle' : angle,
													'direction' : direction});
			$('body').trigger('slingshotStopRequested', {"sprites" : blobSprites});

			// Without this line, the function gets called over and over ("sprite.stop()" doesn't quite work as I had hoped)
			stopStarted = false;
		}
	},

	this.setBlobSprites = function(sprites) {
		blobSprites = sprites;
	};

	this.prototype.init();
	this.sprite = sprite;
});