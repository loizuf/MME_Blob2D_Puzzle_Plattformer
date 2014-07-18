BlobApp.DynamicDoor = (function DynamicDoor(x_pos, y_pos, sizeX, sizeY, doorID) {
	var that = this,
	sprite, tilesetSheet;

	this.prototype = new BlobApp.DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function(){
		tileset = new Image();
		tileset.src = "res/img/door.png"//mapData.tilesets[0].image;


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
				count: 2
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = w/2;
		sprite.regY = h/2;
		sprite.x = x_pos;
		sprite.y = y_pos+12;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	},

	_listeners = function(){
		$('body').on('openDoor', _onOpenDoor);
	},
	_onOpenDoor = function(){
		console.log("view open door requested");
	}

	this.prototype.init();
	this.sprite = sprite;
});



	
	