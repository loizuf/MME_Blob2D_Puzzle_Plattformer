BlobApp.MovingGround = (function MovingGround(x_pos, y_pos, sizeX, sizeY,num) {

var that = this,

	sprite, 
	tilesetSheet, 
	body,
	startX,
	startY,
	myNum,
	started,
	userData;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/movingGround.png"//mapData.tilesets[0].image;
		console.log("whey?",x_pos,y_pos,sizeX,sizeY);
		// getting imagefile from first tileset
		_listeners();
		myNum = num;
		started = false;
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
		}
		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);

		sprite = new createjs.Sprite(tilesetSheet);

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;
		
		sprite.x = x_pos;
		sprite.y = y_pos;
		

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		//sprite.gotoAndPlay(/*wepo*/);
	},

	_listeners = function(){
		$("body").on("onTick", _animate);
		$("body").on("onMovingGroundCreated", _startAnimation);
	},

	_animate = function(event, data){
		// not working atm o0
		if(started){
			var x_pos = body.m_xf.position.x +1, y_pos = body.m_xf.position.y;
			console.log(x_pos,startX);
			if(x_pos>=startX+5){
				body.SetPosition(x_pos,y_pos);
			}
		}
	},

	_startAnimation = function(event,data){
		if(data.cont[0] == myNum){
			body = data.cont[1];
			startX = body.m_xf.position.x;
			started = true;
		}
		
	}

	setUserData = function(data) {
		userData = data;
	};

	this.prototype.init();
	this.sprite = sprite;
	this.setUserData = setUserData;
});