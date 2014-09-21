// The Blob visualisation class
BlobApp.Blob = (function Blob(x_pos, y_pos, blobID) {
	/*
		If this is the first entity type you look at (and it might be, since it's 
		alphabetically the first), please look at Entity.js first :)
	*/

	var thisVar = this,

	blobID = blobID,
	// Easle / CreateJS variables
	sprite, 
	tilesetSheet, 
	tileset,

	animateBlobs = true;

	this.prototype = new BlobApp.Entity(x_pos, 
		(blobID == EntityConfig.REDBLOBID)? y_pos+14 : y_pos+2, 
		2*DEFAULT_TILE_SIZE, 
		(blobID == EntityConfig.REDBLOBID)? 2*DEFAULT_TILE_SIZE : DEFAULT_TILE_SIZE);
	
	this.prototype.init =function() {
		tileset = new Image();

		var height;

		if(blobID == EntityConfig.REDBLOBID) {
			tileset.src = "res/img/redBlobMove.png";
			height = 2*DEFAULT_TILE_SIZE;
		} else {
			tileset.src = "res/img/greenBlobMove.png";
			height = DEFAULT_TILE_SIZE;
		}

		// getting imagefile from first tileset
		_listeners();

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 2 * DEFAULT_TILE_SIZE, height);		
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
				},
				death: [140, 151, "afterDeath"],
				afterDeath: [152, 152, "afterDeath"]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);

		if(blobID == EntityConfig.REDBLOBID) {
			sprite.name = "blobRed";
		} else {
			sprite.name = "blobGreen";
		}

		thisVar.prototype.setupSprite(sprite);
		sprite.gotoAndPlay("idle1");
	},

	// Certain sprites will be removed at times, but there is a definite possibility they have to come back.
	// So basically, they aren't really created twice but just removed from the canvas and added again.
	// This method gets called when that happens.
	this.onRecreate = function() {
		sprite.gotoAndPlay("idle1");
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
		if(sprite.currentAnimation == "teleport" 
			|| sprite.currentAnimation == "afterTeleport"
			|| sprite.currentAnimation == "death"
			|| sprite.currentAnimation == "afterDeath") return;

		if(animateBlobs && blobID == data.blobID) {				
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

				case AnimationKeys.DEATH:
					sprite.gotoAndPlay("death");
				break;
			}
		}
	},

	/* 
		A small piece of logic is in here, because the time when the teleport should take place 
		really depends on the animation.
	*/
	_checkIfTeleAnimationFinished = function() {
		// The check for the red blob id only makes sure that this does not happen for both blobs
		// (i.e. they don't switch places twice)
		if(sprite.currentAnimation == "teleport" && blobID == EntityConfig.REDBLOBID && sprite.currentAnimationFrame == 19 ) {
			$('body').trigger('teleportRequested');
		} else if (sprite.currentAnimation == "afterTeleport" && blobID == EntityConfig.REDBLOBID && sprite.currentAnimationFrame == 19 ) {
			$('body').trigger('physTeleportFinished');
		}

	};

	this.prototype.init();
	this.sprite = sprite;
});