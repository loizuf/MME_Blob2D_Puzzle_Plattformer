BlobApp.Juice = (function Juice(x_pos, y_pos, sizeX, sizeY) {
	var that = this,

	sprite, tilesetSheet;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		var tileset = new Image();

		tileset.src = "res/img/dust.png"

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
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
				play : [0, 7, "", 1],
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
		if(sprite.currentAnimationFrame == 7) {		
			$('body').trigger('juiceRequested', {remove: [sprite]});
			sprite.stop();
		}
	};
	

	this.prototype.init();
	this.sprite = sprite;
});



	
	