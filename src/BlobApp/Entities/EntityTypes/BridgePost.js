BlobApp.BridgePost = (function BridgePost(x_pos, y_pos) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos-25, 25, 25);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/Post.png";//mapData.tilesets[0].image;
		
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 25, 25);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "bridgepost";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
	};

	this.prototype.init();
	this.sprite = sprite;
});