BlobApp.HintBubble = (function HintBubble(x_pos, y_pos, sizeX, sizeY, additionalInfo) {
	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);
	var thisVar = this,
		sprite,
		tilesetSheet,
		tileset;
	this.hintID = additionalInfo.id; // contains "bubbleGreen" or "bubbleRed"
	this.bubbleType = additionalInfo.bubbleType; // contains "down" (blinking down key) or "redBlob" or "greenBlob"

	this.prototype.init = function() {
		var tileset = new Image();
		tileset.src = "res/img/sign.png"

		_listeners();

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = thisVar._initSprite(tileset, sizeX, sizeY);		
	},	

	this._initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				blink: [0, 1, "blink", 0.035]
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;
		
		sprite.name= thisVar.hintID;

		sprite.x = x_pos;
		sprite.y = y_pos;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;

		sprite.gotoAndPlay("blink");
	},

	this.prototype.init();
	this.sprite = sprite;
});