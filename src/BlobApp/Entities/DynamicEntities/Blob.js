BlobApp.Blob = (function Blob(x_pos, y_pos, sizeX, sizeY, blobID) {

	var that = this,
	blobID = blobID,
	sprite, 
	tilesetSheet, 
	tileset;

	this.prototype = new BlobApp.DynamicEntity(x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function(){
		tileset = new Image();
		var height;
		if(blobID == EntityConfig.REDBLOBID){
			tileset.src = "res/img/redBlobMove.png"//mapData.tilesets[0].image;
			height = sizeY;
		}else{
			tileset.src = "res/img/greenBlobMove.png"//mapData.tilesets[0].image;
			height = sizeY;
		}
		// getting imagefile from first tileset
		_listeners();
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, sizeX,sizeY);		
	},

	_initSprite = function(tileset, w,h){
		var imageData = {
			images : [ tileset ],
			frames : {
				width : w,
				height : h,
			},
			animations: {
				runRight: [0,19],
				runLeft: [20,39],
				idle1: [40,59],
				jumpRight: [60, 79, "jumpEndRight"],
				jumpEndRight: [79],
				jumpLeft: [80, 99, "jumpEndLeft"],
				jumpEndLeft: [99]
			}
		}

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);
		if(blobID == EntityConfig.REDBLOBID){
			sprite.name = "blobRed";
		}else{
			sprite.name = "blobGreen";
		}

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = w/2;
		sprite.regY = h/2;
		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = imageData.frames.width/2;
		sprite.regY = imageData.frames.height/2;
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("idle1");
	},


	_listeners = function(){
		$('body').on('blobanimationChanged', _animate);
	},

	_animate = function(event, data){
			if(blobID==data.blobID){
		
			switch(data.animationKey){
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
			}
		}
	};

	this.prototype.init();

	this.sprite = sprite;
	this.blobID = blobID;
});