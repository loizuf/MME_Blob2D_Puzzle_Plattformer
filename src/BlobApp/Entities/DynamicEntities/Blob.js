BlobApp.Blob = (function Blob(sprt, x_pos, y_pos, sizeX, sizeY, blobID) {

	var that = this;


	this.prototype = new BlobApp.DynamicEntity(sprt, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function(sprite) { 
		//sprite.userData="blob";
		console.log(sprite);
		$("body").trigger('blobRequested', sprite, null);
	
	};
	
	this.prototype.init =function(){
	/*	if(blobID == 1){
			sprite = new createjs.Bitmap("/res/img/greenblob.png");
		}else{
			sprite = new createjs.Bitmap("/res/img/redblob.png");
		} */
		tileset = new Image();
		// getting imagefile from first tileset
		tileset.src = "res/img/blob.png"//mapData.tilesets[0].image;
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset);		
	}

	_initSprite = function(tileset){
		console.log(tileset);
		var imageData = {
			images : [ tileset ],
			frames : {
				width : 25,
				height : 25
			}
		};
		// create spritesheet for generic objects (ground e.g.)
		var tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.x = x_pos*25-12;
		sprite.y = y_pos*25-12;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = 12;
		sprite.regY = 12;
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		that.prototype.applyPhysicsBody(sprite);
	}


	this.prototype.init();


	this.blobID = blobID;
});