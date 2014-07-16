BlobApp.Blob = (function Blob(x_pos, y_pos, sizeX, sizeY, blobID) {

	var that = this,
	this.blobID = blobID,
	sprite, tilesetSheet;


	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function(){
		tileset = new Image();
		var height;
		if(blobID == EntityConfig.REDBLOBID){
			tileset.src = "res/img/redBlobMoveRight.png"//mapData.tilesets[0].image;
			height = 50;
		}else{
			tileset.src = "res/img/blob.png"//mapData.tilesets[0].image;
			height = 25;
		}
		// getting imagefile from first tileset
		_listeners();
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, height);		
	}

	_initSprite = function(tileset, h){
		var imageData = {
			images : [ tileset ],
			frames : {
				width : 25,
				height : h,
				count: 20,
				regX: width/2,
				regY: height/2
			}
			animations: {

			}
		};
		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		cellBitmap.gotoAndStop(0);
		/* koordinaten kommen aus dem levelloader */
		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width/2;
		sprite.regY = imageData.frames.height/2;
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

	},

	_listeners = function(){
		$('body').on('blobanimationChanged', _animate);
	},

	_animate = function(event, data){
		if(this.blobID==data.blobID){
			switch(data.animationKey){
				case IDLE:
					gotoAndPlay
				break;
				case MOVERIGHT:

				break;
				case MOVELEFT:
				break;
			}
		}
	}

	this.prototype.init();

	this.sprite = sprite;
	this.blobID = blobID;
});