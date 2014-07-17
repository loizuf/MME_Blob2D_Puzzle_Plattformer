BlobApp.TriggerButton = (function Button(x_pos, y_pos, sizeX, sizeY) {
	var that = this,
	sprite, tilesetSheet;

	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function(){
		tileset = new Image();
		tileset.src = "res/img/button.png"//mapData.tilesets[0].image;


		// getting imagefile from first tileset
		_listeners();
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
	},

	_initSprite = function(tileset, w,h){
		var imageData = {
			images : [ tileset ],
			frames : {
				width : w,
				height : h,
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = w/2;
		sprite.regY = h/2;
		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	},

	_listeners = function(){},

	_animate = function(event, data){};

	this.prototype.init();
	this.sprite = sprite;
});



	
	