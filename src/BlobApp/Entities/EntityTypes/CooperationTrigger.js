BlobApp.CooperationTrigger = (function CooperationTrigger(x_pos, y_pos, coopID, triggerID) {
	var that = this,

	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 60, 60);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/cooptrigger.png";//mapData.tilesets[0].image;
		
		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 60, 60);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations: {
				smallShine : [0,75,"smallShine",1],
				bigShine : [76,88,"bigShine",1],
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
		if(data.triggerID[0] != coopID) return;
		if(data.triggerID[1] == triggerID || data.triggerID[0] == EntityConfig.TELETRIGGER) {
			switch(data.animationKey) {
				case AnimationKeys.SMALLSHINE:
					sprite.gotoAndPlay("smallShine");
				break;

				case AnimationKeys.BIGSHINE:
					sprite.gotoAndPlay("bigShine");
				break;
			}
		}
	};

	this.prototype.init();
	this.sprite = sprite;
});