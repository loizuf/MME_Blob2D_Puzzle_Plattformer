BlobApp.CooperationTrigger = (function CooperationTrigger(x_pos, y_pos, sizeX, sizeY, coopID) {
	var that = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		var height;
		height = sizeY;

		tileset = new Image();
		tileset.src = "res/img/cooptrigger.png";//mapData.tilesets[0].image;
		
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

			animations: {
				smallShine : [0,17,"smallShine",0.3],
				bigShine : [18,35,"bigShine",0.3],
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "trigger";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width/2;
		sprite.regY = imageData.frames.height/2;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("smallShine");
	},


	_listeners = function() {
		$('body').on('coopTriggerAnimationChanged', _animate);
	},

	_animate = function(event, data) {	
		switch(data.animationKey) {
			case AnimationKeys.SMALLSHINE:
				sprite.gotoAndPlay("smallShine");
			break;

			case AnimationKeys.MOVELEFT:
				sprite.gotoAndPlay("bigShine");
			break;
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});