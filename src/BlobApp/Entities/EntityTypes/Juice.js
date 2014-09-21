// Dust visualisation (called "juice" because its only purpose is to make the game juicy :) )
BlobApp.Juice = (function Juice(x_pos, y_pos) {
	var thisVar = this,

	sprite, tilesetSheet, removed = false;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 50, 50);
	
	this.prototype.init =function() {
		var tileset = new Image();

		tileset.src = "res/img/dust.png";

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

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		thisVar.prototype.setupSprite(sprite);

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



	
	