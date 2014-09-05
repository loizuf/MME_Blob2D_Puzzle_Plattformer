BlobApp.Blob = (function Blob(x_pos, y_pos, sizeX, sizeY, blobID) {

	var that = this,

	blobID = blobID,
	sprite, 
	tilesetSheet, 
	tileset,
	animateBlobs = true;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		tileset = new Image();

		var height;

		if(blobID == EntityConfig.REDBLOBID) {
			tileset.src = "res/img/redBlobMove.png"//mapData.tilesets[0].image;
			height = sizeY;
		} else {
			tileset.src = "res/img/greenBlobMove.png"//mapData.tilesets[0].image;
			height = sizeY;
		}

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
				runRight: [0,19],
				runLeft: [20,39],
				idle1: [40,79],
				jumpRight: [80, 99, "jumpEndRight"],
				jumpEndRight: [99],
				jumpLeft: [100, 119, "jumpEndLeft"],
				jumpEndLeft: [119],
				teleport: [120, 139, "afterTeleport"],
				afterTeleport: {
					frames : [139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120], 
					next: "idle1"
				}
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		if(blobID == EntityConfig.REDBLOBID) {
			sprite.name = "blobRed";
		} else {
			sprite.name = "blobGreen";
		}

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width/2;
		sprite.regY = height/2;

		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width/2;
		sprite.regY = imageData.frames.height/2;
		
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("jumpRight");
	},

	_listeners = function() {
		$('body').on('blobanimationChanged', _animate);		
		$('body').on('onTick', _checkIfTeleAnimationFinished);
		$('body').on('blobSpritesRemoved', _stopAnimatingBlobs);
		$('body').on('blobSpritesAdded', _allowAnimatingBlobs);

	},

	_stopAnimatingBlobs = function() {
		animateBlobs = false;
	},

	_allowAnimatingBlobs = function() {
		animateBlobs = true;
		sprite.gotoAndPlay("jumpLeft");
	},

	_animate = function(event, data) {					
			if(animateBlobs && blobID==data.blobID) {				
			switch(data.animationKey) {
				case AnimationKeys.IDLE1:
					sprite.gotoAndPlay("idle1");
				break;

				case AnimationKeys.MOVERIGHT:
					sprite.gotoAndPlay("runRight");
				break;

				case AnimationKeys.MOVELEFT:
					sprite.gotoAndPlay("runLeft");
				break;

				case AnimationKeys.JUMPRIGHT:
					sprite.gotoAndPlay("jumpRight");
				break;

				case AnimationKeys.JUMPLEFT:
					sprite.gotoAndPlay("jumpLeft");
				break;

				case AnimationKeys.TELEPORT:
					sprite.gotoAndPlay("teleport");
				break;
			}
		}
	},

	_checkIfTeleAnimationFinished = function() {
		if(sprite.currentAnimation == "teleport" && blobID == EntityConfig.REDBLOBID && sprite.currentAnimationFrame == 19 ) {
			$('body').trigger('teleportRequested');
		}

	};

	this.prototype.init();
	this.sprite = sprite;
	this.blobID = blobID;
});