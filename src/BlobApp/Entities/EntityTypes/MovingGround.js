// The floating platforms (visualisation and movement logic)
BlobApp.MovingGround = (function MovingGround(x_pos, y_pos, num) {

var thisVar = this,
	MOVINGRANGE = 50, /*for each 25 its moving 1 tile to left and right of the starting position*/
	sprite, 
	tilesetSheet, 
	body,
	movingRight = true, /*true right false left*/
	movedBy = 0,
	myNum,
	bodiesOnMe = [],
	started,
	userData;	

	this.prototype = new BlobApp.Entity(sprite, x_pos, y_pos, 75, 25);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/movingGround.png"//mapData.tilesets[0].image;
		// getting imagefile from first tileset
		_listeners();
		myNum = num;
		started = false;
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 75, 25);		
	},

	_initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = "movingGround";
		thisVar.prototype.setupSprite(sprite);

		startY = y_pos/30;
	},

	_listeners = function(){
		$("body").on("onTick", _animate);
		$("body").on("onMovingGroundCreated", _startAnimation);
		$('body').on("entityLandedOnMe", _entityEnteredMe);
		$('body').on("entityLeftMe", _entityLeftMe);
		
	},

	_animate = function(event, data){
		// not working atm o0
		//var y_pos = body.m_xf.position.y;
		if(started){
	  		var x_pos = body.m_xf.position.x;
			if(movedBy == MOVINGRANGE){
				movingRight  = false;
			}
			if(movedBy == -MOVINGRANGE){
				movingRight  = true;
			}
			if(movingRight && movedBy<=MOVINGRANGE){
				x_pos +=1/30;
				_moveBodiesOnMe(movingRight);
				movedBy++;
			}
			if(!movingRight && movedBy >=-MOVINGRANGE){
				_moveBodiesOnMe(movingRight);
				x_pos -=1/30;
				movedBy--;
			}
		
			body.SetPosition(new Box2D.Common.Math.b2Vec2(x_pos,startY));
			
		}
	},
	
	_startAnimation = function(event,data){
		if(data.cont[0] == myNum){
			body = data.cont[1];
			//body.m_fixtureList.m_friction = 2;
			//console.log(body.GetUserData());
			started = true;
		}
		
	},
	_entityEnteredMe = function(event, data){
		if(myNum == data.cont[0]){
			bodiesOnMe.push(data.cont[1]);
			console.log(bodiesOnMe);
		}
	},
	_entityLeftMe = function(event, data){
		if(myNum == data.cont[0]){
			bodiesOnMe.splice(bodiesOnMe.indexOf(data.cont[1]),1);
			console.log(bodiesOnMe);
		}
	},
	_moveBodiesOnMe = function(movingRight){
		var i, _length = bodiesOnMe.length;
		
		for(i= 0;i<_length;i++){
			var x_pos = bodiesOnMe[i].m_xf.position.x;
			var y_pos = bodiesOnMe[i].m_xf.position.y;
			if(movingRight){
				bodiesOnMe[i].SetPosition(new Box2D.Common.Math.b2Vec2(x_pos+1/30,y_pos));
			}else{
				bodiesOnMe[i].SetPosition(new Box2D.Common.Math.b2Vec2(x_pos-1/30,y_pos));
			}
		}
	},

	setUserData = function(data) {
		userData = data;
	};

	this.prototype.init();
	this.sprite = sprite;
	this.setUserData = setUserData;
});