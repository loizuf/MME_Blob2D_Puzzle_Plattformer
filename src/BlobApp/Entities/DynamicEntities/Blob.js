BlobApp.Blob = (function Blob(x_pos, y_pos, sizeX, sizeY, blobID) {

	var that = this,
	sprite, tilesetSheet;


	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function(){
		tileset = new Image();
		var height;
		if(blobID == EntityConfig.REDBLOBID){
			tileset.src = "res/img/redblob.png"//mapData.tilesets[0].image;
			height = 50;
		}else{
			tileset.src = "res/img/blob.png"//mapData.tilesets[0].image;
			height = 25;
		}
		// getting imagefile from first tileset
		
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, height);		
	}

	_initSprite = function(tileset, h){
		var imageData = {
			images : [ tileset ],
			frames : {
				width : 25,
				height : h
			}
		};
		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.x = x_pos;
		sprite.y = y_pos;
		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width/2;
		sprite.regY = imageData.frames.height/2;
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

	}


	this.prototype.init();

	this.sprite = sprite;
	this.blobID = blobID;
});