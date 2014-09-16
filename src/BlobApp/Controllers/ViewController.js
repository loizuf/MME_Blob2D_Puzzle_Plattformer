/* The ViewController really is a connection between our App, Easel and the different EntityTypes */
BlobApp.ViewController = (function() {
	var that = {},
	canvas, context, debugCanvas, debugContext, stage,
	// Array of all view entities.
	viewEntities = [],
	// If this is "true", parts of the app will stop working! (some events are and must be dependant of the visualisation) 
	b2ddebug = false,
	tilesetSheet,

	init = function() {
		viewEntities.length = 0;
		_initView();
		_ticker();
		_listener();
		_initGenericDataHandler();

		return that;
	},

	resetGame = function() {
		init();
	},

	_initGenericDataHandler = function() {			
		var tileset = new Image();

		// getting imagefile from first tileset
		tileset.src = "res/img/Tileset.png";

		var imageData = {
			images : [ tileset ],
			frames : {
				width : DEFAULT_TILE_SIZE,
				height : DEFAULT_TILE_SIZE
			}
		};

		// create spritesheet for generic objects (ground e.g.)
		tilesetSheet = new createjs.SpriteSheet(imageData);
	},

	createGenericEntity = function(x, y, positionInSprite) {
		var newEntity = new BlobApp.GenericEntity(tilesetSheet, x, y, positionInSprite);
		stage.addChild(newEntity.sprite);
		viewEntities.push(newEntity);
	},

	createEntity = function(xPos, yPos, entityID, data) {
		var entity = _justRecreate(entityID, data);
		if(!entity) {
			switch(entityID) {
				case EntityConfig.GREENBLOBID :
				case EntityConfig.REDBLOBID :
					entity = new BlobApp.Blob(xPos, yPos, entityID);
					break;
				case EntityConfig.BUTTONID :
					entity = new BlobApp.TriggerButton(xPos, yPos, data.buttonID);
					break;
				case EntityConfig.HELITRIGGER :
				case EntityConfig.HELISTOPTRIGGER :
				case EntityConfig.BRIDGELEFTTRIGGER :
				case EntityConfig.BRIDGERIGHTTRIGGER :
				case EntityConfig.TELETRIGGER :
				case EntityConfig.SLINGSHOTTRIGGERLEFT :
				case EntityConfig.SLINGSHOTTRIGGERRIGHT :
				case EntityConfig.SPHERETRIGGER :
					_createSpecialAbilitySprite(entityID, xPos, yPos);
					entity = new BlobApp.CooperationTrigger(xPos, yPos, entityID);
					break;
				case EntityConfig.DOORID : 
					entity = new BlobApp.DynamicDoor(xPos, yPos, data.doorID);
					break;
				case EntityConfig.GOALID :
					entity = new BlobApp.Goal(xPos, yPos, data.goalID);
					break;
				case EntityConfig.KEYID :
					entity = new BlobApp.Key(xPos, yPos, data.keyID);
					break
				case EntityConfig.LEVELDOOR :
					entity = new BlobApp.LevelDoor(xPos, yPos, data.levelID, data.owID);
					break;
				case EntityConfig.MOVINGGROUNDID : 
					entity = new BlobApp.MovingGround(xPos, yPos, data.num);
					break;
				case EntityConfig.NEWGAMEDOOR :
				case EntityConfig.CONTINUEDOOR : 
					entity = new BlobApp.MenuDoor(xPos, yPos, entityID);
					break;
				case "Heli" :
					entity = new BlobApp.Heli(xPos, yPos);
					break;
				case "Sphere" :
					entity = new BlobApp.Sphere(xPos, yPos);
					break;
				case "Bridge" :
					entity = new BlobApp.Bridge(xPos, yPos, data.direction);
					break;
				case "Trampolin" :
					entity = new BlobApp.Trampolin(xPos, yPos);
					break;
				case "Stretch" :
					entity = new BlobApp.Stretch(xPos, yPos);
					break;
				case "Juice" :
					entity = new BlobApp.Juice(xPos, yPos);
					break;
				case "Bubble" :
					entity = new BlobApp.HintBubble(xPos, yPos, data.bubbleInfo);
					break;
			}
		}
		if(entity != undefined && entity != false) {
			viewEntities.push(entity);
			stage.addChild(entity.sprite);
		}	

		if(data.remove) {
			for(var i = 0; i < data.remove.length; i++) {
				stage.removeChild(stage.getChildByName(data.remove[i]));
			}
		}
		if(data.removeBySprite) {
			for(var i = 0; i < data.removeBySprite.length; i++) {
				stage.removeChild(data.removeBySprite[i]);
			}
		}
		_sortSprites();
	},

	_justRecreate = function(entityID, data) {
		var entityName;
		if(entityID == EntityConfig.GREENBLOBID) entityName = "blobGreen";
		if(entityID == EntityConfig.REDBLOBID) entityName = "blobRed";
		if(entityID == "Heli") entityName = "heli";
		if(entityID == "Sphere") entityName = "sphere";
		if(entityID == "Bridge") entityName = "bridge";
		if(entityID == "Trampolin") entityName = "trampolin";
		if(entityID == "Stretch") entityName = "stretch";

		if(!entityName) return false;

		for(var i = 0; i < viewEntities.length; i++) {
			if(viewEntities[i].sprite.name == entityName) {
				if(viewEntities[i].onRecreate) {
					viewEntities[i].onRecreate(data);
				}
				return viewEntities[i];
			}
		}
		return false;
	},

	getViewEntities = function() {
		return viewEntities;
	},

	_createSpecialAbilitySprite = function(entityID, xPos, yPos) {
		var entity;
		switch(entityID){
			case EntityConfig.HELITRIGGER :
				entity = new BlobApp.Tornado(xPos, yPos-10);
				break;
			case EntityConfig.TELETRIGGER :
				entity = new BlobApp.Teleport(xPos, yPos-12.5);
				break;
			case EntityConfig.HELISTOPTRIGGER :
				entity = new BlobApp.Helistop(xPos, yPos-12.5);
				break;
			case EntityConfig.BRIDGERIGHTTRIGGER :
				entity = new BlobApp.BridgePost(xPos-5, yPos+2.5);
				break;
			case EntityConfig.BRIDGELEFTTRIGGER :
				entity = new BlobApp.BridgePost(xPos+5, yPos+2.5);
				break;
			case EntityConfig.SLINGSHOTTRIGGERLEFT :
				entity = new BlobApp.Slingshot(xPos, yPos-25, "left");
				break;
			case EntityConfig.SLINGSHOTTRIGGERRIGHT:	
				entity = new BlobApp.Slingshot(xPos, yPos-25, "right");
				break;
			case EntityConfig.SPHERETRIGGER:	
				entity = new BlobApp.Orb(xPos, yPos-5);
				break;
		}

		if(entity != undefined && entity != false) {
			viewEntities.push(entity);
			stage.addChild(entity.sprite);
		}	
	},
	
	applyBackground = function(event, child) {
		if(!b2ddebug) {
			stage.addChild(child);
		}
	},

	update = function() {
		if(!b2ddebug){
			stage.update();
		}
	},

	_displayPauseScreen = function() {
		_pauseGame();

		var $pauseContainer = $('#pause-container');
		var $gamecanvas = $('#canvas-container');
		var $menuResume = $('#resume');
		var $menuRestart = $('#restart');
		var $menuMenu = $('#retreat');

		$pauseContainer.css('display', 'block');
		$gamecanvas.css('display', 'none');

		$menuResume.unbind("click");
		$menuRestart.unbind("click");
		$menuMenu.unbind("click");

		$menuResume.on('click', _proceedGame);
		$menuRestart.on('click', _restartGame);
		$menuMenu.on('click', _showMenu);
	},

	_hidePauseScreen = function() {
		var $pauseContainer = $('#pause-container');
		$pauseContainer.css('display', 'none');
	},

	_restartGame = function() {
		var $gamecanvas = $('#canvas-container');
		$gamecanvas.css('display', 'block');

		_hidePauseScreen();
		_clearScene();

		$('body').trigger("destroyPhysics");

		_tick();
		_resumeGame();
	},

	_clearScene = function() {
		stage.removeAllChildren();
	},

	_pauseGame = function() {
		createjs.Ticker.setFPS(0);	
	},

	_resumeGame = function() {
		$('body').trigger("restartPhys");
		

		$gamecanvas.fadeIn(1250, function() {
			createjs.Ticker.setFPS(30);
		});
	},

	_showMenu = function() {
		// needs unload everything (world, physics, level etc.)
		var $pauseContainer = $('#pause-container');
		$pauseContainer.css('display', 'none');

		var menu = $('#menu-container');
		menu.css('display', 'block');

		_clearScene();

		$('body').trigger("resetGame");

		_tick();
	},

	_proceedGame = function() {
		$(that).trigger('onProceedingRequested');

		var $gamecanvas = $('#canvas-container');
		$gamecanvas.css('display', 'block');

		_hidePauseScreen();
		_resumeGame();
	},

	_ticker = function() {
		createjs.Ticker.setFPS(30);
		createjs.Ticker.useRAF = true;
		createjs.Ticker.addEventListener("tick", _tick);
	},

	_initView = function() {
		canvas = document.getElementById('gameCanvas');
		debugCanvas = document.getElementById('debugCanvas');

		context = canvas.getContext("2d");

		stage = new createjs.Stage(canvas);
		stage.snapPixelsEnabled = true;
	},

	_tick = function() {
		var onTickRequest = $.Event('onTick');
		$('body').trigger(onTickRequest);		
	},

	//Doesn't really get used anymore since Level finish to Overworld
	_onLevelFinished = function() {		
		iewEntities.length = 0;

		$gamecanvas.css('display', 'none');
		_showMenu();
	},

	_onLevelLoadRequest = function() {		
		viewEntities.length = 0;

		$gamecanvas.fadeOut(1250, function() {
			_clearScene();

			$('body').trigger("destroyPhysics");

			_tick();
			_resumeGame();
		});
	},

	_onSlingshotStarted = function(event, data) {
		stage.removeChild(stage.getChildByName("blobRed"));
		stage.removeChild(stage.getChildByName("blobGreen"));
		stage.removeChild(stage.getChildByName("bubblegreenBlob"));
		stage.removeChild(stage.getChildByName("bubbleredBlob"));

		_addDirectionIndicator(data.slingshotEntity);

		$('body').trigger("blobSpritesRemoved");
	},

	_addDirectionIndicator = function(slingshotEntity) {
		var xPos, yPos;

		if(slingshotEntity.direction == "left") {
			xPos = slingshotEntity.prototype.x_coordinate + 75;
		} else {
			xPos = slingshotEntity.prototype.x_coordinate - 75;
		}
		yPos = slingshotEntity.prototype.y_coordinate - 35;

		var directionIndicator = new BlobApp.DirectionIndicator(xPos, yPos,	slingshotEntity.direction);
		stage.addChild(directionIndicator.sprite);
	},

	_onSlingshotStopped = function(event, data) {
		createEntity(0, 0, EntityConfig.REDBLOBID, {}); // will definitely go into the "justRecreate"-case
		createEntity(0, 0, EntityConfig.GREENBLOBID, {}); // this will do the same thing.
		
		$('body').trigger("blobSpritesAdded");		
		stage.removeChild(stage.getChildByName("directionIndicator"));
	},

	_shakeCanvas = function(event, data) {
		$gamecanvas.effect("shake",{direction: data.direction, distance:8}, 220);
	},

	_sortSprites = function() {
		var triggerCounter = 0;

		for(var i = 0; i < stage.getNumChildren(); i++) {
			var currentChild = stage.getChildAt(i);
			if(currentChild.name == "generic") {
				stage.setChildIndex(currentChild, 1);
			} else if (currentChild.name == "trigger") {
				stage.setChildIndex(currentChild, stage.getNumChildren()-1);
				triggerCounter++;
			}
		}

		if(stage.getChildByName("blobRed")) {
			stage.setChildIndex(stage.getChildByName("blobRed"), stage.getNumChildren()-triggerCounter-1);
		}	
		if(stage.getChildByName("blobGreen")) {
			stage.setChildIndex(stage.getChildByName("blobGreen"), stage.getNumChildren()-triggerCounter-1);
		}
	},

	_listener = function(){		
		$('body').on('backgroundAdded', applyBackground);
		$('body').on('onPause', _displayPauseScreen);
		$('body').on('levelFinished', _onLevelLoadRequest);

		$('body').on('levelLoadRequest', _onLevelLoadRequest);

		$('body').on('onStartSlingshot', _onSlingshotStarted);
		$('body').on('slingshotStopRequested', _onSlingshotStopped);

		$('body').on('onCameraShakeRequested', _shakeCanvas);
		$('body').on('playerOnSpikes', _onLevelLoadRequest);
	};

	that.init = init;
	that.applyEntity = applyEntity;
	that.update = update;
	that.createGenericEntity = createGenericEntity;
	that.createEntity = createEntity;
	that.getViewEntities = getViewEntities;

	return that;
})();

DEFAULT_TILE_SIZE = 25;