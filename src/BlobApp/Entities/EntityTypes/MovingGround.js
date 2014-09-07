BlobApp.MovingGround = (function MovingGround(x_pos, y_pos, sizeX, sizeY,num) {

var that = this,
	MOVINGRANGE = 50, /*for each 25 its moving 1 tile to left and right of the starting position*/
	sprite, 
	tilesetSheet, 
	body,
	movingRight = true, /*true right false left*/
	movedBy = 0,
	myNum,
	started,
	userData;

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, sizeX, sizeY);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/movingGround.png"//mapData.tilesets[0].image;
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
		var x_pos = body.m_xf.position.x;
		if(started){
			if(movedBy == MOVINGRANGE){
				movingRight  = false;
			}
			if(movedBy == -MOVINGRANGE){
				movingRight  = true;
			}
			if(movingRight && movedBy<=MOVINGRANGE){
				x_pos +=1/30;
				movedBy++;
			}
			if(!movingRight && movedBy >=-MOVINGRANGE){
				x_pos -=1/30;
				movedBy--;
			}
		var y_pos = body.m_xf.position.y;
				body.SetPosition(new Box2D.Common.Math.b2Vec2(x_pos,y_pos));
			
		}
	},

	_startAnimation = function(event,data){
		if(data.cont[0] == myNum){
			body = data.cont[1];
			//body.m_fixtureList.m_friction = 2;
			console.log(body.m_fixtureList.m_friction);
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