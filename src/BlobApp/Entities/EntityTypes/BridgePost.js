// Bridge post visualisation (doesn't technically need to have its own class since it
// is not animated, but when all the other special ability indicators do have their own, so should this.)
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

		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "bridgepost";

		thisVar.prototype.setupSprite(sprite);
	};

	this.prototype.init();
	this.sprite = sprite;
});