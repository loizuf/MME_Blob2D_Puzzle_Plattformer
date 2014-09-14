BlobApp.Juice = (function Juice(x_pos, y_pos) {
	var that = this,

	sprite, tilesetSheet, removed = false;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, 50, 50);
	
	this.prototype.init =function() {
		var tileset = new Image();

		tileset.src = "res/img/dust.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 50, 50);		
		_listeners();
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height
			},

			animations: {
				play : [0, 15, "", 1],
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

		sprite.gotoAndPlay("play");
	},

	_listeners = function() {
		$('body').on('onTick', _checkIfFinished);
	},

	_checkIfFinished = function() {
		if(!removed && sprite.currentAnimationFrame == 15) {		
			$('body').trigger('requestViewEntity', {generic: false, removeBySprite: [sprite]});
			sprite.stop();
			removed = true;
		}
	};
	

	this.prototype.init();
	this.sprite = sprite;
});



	
	