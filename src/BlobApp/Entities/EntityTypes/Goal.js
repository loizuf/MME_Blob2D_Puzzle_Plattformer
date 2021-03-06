// The Level's goal (a door with two lights on top)
BlobApp.Goal = (function Goal(x_pos, y_pos, GOALID) {
	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 75);

	var sprite, 
		tilesetSheet,
		thisVar = this;

	this.prototype.init =function() {
		var tileset = new Image();

		tileset.src = "res/img/goal.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 75);		
		_listeners();
	},	

	_listeners = function() {
		$('body').on("animateGoal", thisVar._animate);
		$('body').on("playerReachedGoal", thisVar._animate);
		$('body').on("levelFinished", thisVar._animate);
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations: {
				locked: [0, 0, "locked"],
				unlock: [0, 9, "unlocked"],
				unlocked: [9, 9],
				p1light: [11, 11, "p1light"],
				p2light: [10, 10, "p2light"],
				open: [12, 17, "opened"],
				opened: [17, 17, "opened"],
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet); 
		thisVar.prototype.setupSprite(sprite);
		
		sprite.gotoAndPlay("locked");
	},

	thisVar._animate = function(event, data) {
		if (event.type == "animateGoal") {
			sprite.gotoAndPlay("unlock");
		} else if (event.type == "playerReachedGoal") {
			if (data.which == "p1") {
				sprite.gotoAndPlay("p1light");
			} else {
				sprite.gotoAndPlay("p2light");
			}
		} else if (event.type == "levelFinished") {
			sprite.gotoAndPlay("open");
		}
	};

	this.prototype.init();
	this.keyID = GOALID;
	this.sprite = sprite;
});