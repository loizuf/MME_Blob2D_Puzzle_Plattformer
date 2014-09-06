BlobApp.MovingGround = (function MovingGround(x_pos, y_pos, sizeX, sizeY) {

var that = this,

	sprite, 
	tilesetSheet,
	userData;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/movingGround.png"//mapData.tilesets[0].image;
		console.log("whey?",x_pos,y_pos,sizeX,sizeY);
		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				/*work in progress*/
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
		sprite.gotoAndPlay(/*wepo*/);
	},

	_listeners = function(){
		$("body").on("onTick", _animate);
	},

	_animate = function(event, data){
		
	},

	setUserData = function(data) {
		userData = data;
	};

	this.prototype.init();
	this.sprite = sprite;
	this.setUserData = setUserData;
});