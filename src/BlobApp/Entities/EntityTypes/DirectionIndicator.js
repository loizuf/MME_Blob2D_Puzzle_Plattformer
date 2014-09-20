BlobApp.DirectionIndicator = (function DirectionIndicator(x_pos, y_pos, direction) {
	var thisVar = this,

	sprite, 
	tilesetSheet, 
	tileset,
	_startX,
	_startY;

	this.prototype = new BlobApp.Entity(x_pos, y_pos, 150, 30);
	
	this.prototype.init =function() {
		tileset = new Image();
		tileset.src = "res/img/DirectionIndicator.png";//mapData.tilesets[0].image;
		
		// getting imagefile from first tileset
		_listeners();
		_startX = x_pos;
		_startY = y_pos;

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initSprite(tileset, 150, 30);		
	},

	_listeners = function() {
		$('body').on("onSlingshotAngleChange", _changeAngle);
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
		sprite.name = "directionIndicator";

		/* koordinaten kommen aus dem levelloader */
		sprite.regX = width / 2;
		sprite.regY = height / 2;

		sprite.scaleY = 0.5;
		if(direction == "right") {
			sprite.scaleX = -1;
			sprite.rotation = 30;
		} else {
			sprite.rotation = -30;
		}

		sprite.x = thisVar.prototype.x_coordinate;
		sprite.y = thisVar.prototype.y_coordinate;

		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		sprite.gotoAndPlay("");
	},

	_changeAngle = function(event, data) {
		if(direction == "left") {
			_changeAngleLeft(data.angle);
		} else {
			_changeAngleRight(data.angle);
		}
	},

	_changeAngleLeft = function(angle) {		
		var addY,
			addX;
		
		sprite.rotation = -angle;
		switch(angle) {
			case 30:
				addY = 0;
				addX = 0;
				break;
			case 45:
				addY = -20;
				addX = -10;
				break;
			case 60:
				addY = -40;
				addX = -20;
				break;
		}

		sprite.x = _startX + addX;
		sprite.y = _startY + addY;
	},

	_changeAngleRight = function(angle) {
		var addY,
			addX;
		
		sprite.rotation = angle;
		switch(angle) {
			case 30:
				addY = 0;
				addX = 0;
				break;
			case 45:
				addY = -20;
				addX = +10;
				break;
			case 60:
				addY = -40;
				addX = +20;
				break;
		}

		sprite.x = _startX + addX;
		sprite.y = _startY + addY;
	};

	this.prototype.init();
	this.sprite = sprite;
});