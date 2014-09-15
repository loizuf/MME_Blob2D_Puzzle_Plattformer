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
		}

		if(entity != undefined && entity != false) {
			viewEntities.push(entity);
			stage.addChild(entity.sprite);
		}	
	},

	applyEntity = function(event, data) {
		if(!b2ddebug){
			stage.addChild(data.sprite);
			if(data.remove) {
				for(var i = 0; i < data.remove.length; i++) {
					stage.removeChild(data.remove[i]);
				}
			}
			if(data.removeByName) {
				for(var i = 0; i < data.removeByName.length; i++) {
					stage.removeChild(stage.getChildByName(data.removeByName[i]));
				}
			}
		}
	},

	// TODO: The view Controller should not have to know that such a thing as "heli" exists, it should just be told "remove blobs, add sprite" in a more general way!!
	applyHeli = function(event, data) {
		stage.removeChild(stage.getChildByName("blobRed"));
		stage.removeChild(stage.getChildByName("blobGreen"));

		$('body').trigger("blobSpritesRemoved");
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	removeHeli = function(event, data) {
		stage.removeChild(stage.getChildByName("heli"));

		$('body').trigger("blobSpritesAdded");
		if(!b2ddebug){
			stage.addChild(data.sprites[0]);
			stage.addChild(data.sprites[1]);
		}
	},

	applyBridge = function(event, data) {
		stage.removeChild(stage.getChildByName("blobRed"));
		stage.removeChild(stage.getChildByName("blobGreen"));

		$('body').trigger("blobSpritesRemoved");
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	removeBridge = function(event, data) {
		stage.removeChild(stage.getChildByName("bridge"));

		$('body').trigger("blobSpritesAdded");
		if(!b2ddebug){
			stage.addChild(data.sprites[0]);
			stage.addChild(data.sprites[1]);
		}
	},

	removeSphere = function(event, data) {
		stage.removeChild(stage.getChildByName("sphere"));

		$('body').trigger("blobSpritesAdded");
		if(!b2ddebug){
			stage.addChild(data.sprites[0]);
			stage.addChild(data.sprites[1]);
		}
	},

	applyTrampolin = function(event, data) {
		stage.removeChild(stage.getChildByName("blobGreen"));
		
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	removeTrampolin = function(event, data) {
		stage.removeChild(stage.getChildByName("trampolin"));

		if(!b2ddebug){
			stage.addChild(data.sprite);
		}	
	},

	applyStretch = function(event, data) {
		stage.removeChild(stage.getChildByName("blobRed"));
		
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	removeStretch = function(event, data) {
		stage.removeChild(stage.getChildByName("stretch"));
		
		if(!b2ddebug){
			stage.addChild(data.sprite);
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
		$gamecanvas.css('display', 'none');
		_showMenu();
	},

	_onLevelLoadRequest = function() {
		$gamecanvas.fadeOut(1250, function() {
			_clearScene();

			$('body').trigger("destroyPhysics");

			_tick();
			_resumeGame();
		});
	},

	_onSlingshotStarted = function(event, data) {
		data.slingshotEntity.setBlobSprites([stage.getChildByName("blobRed"), stage.getChildByName("blobGreen")]);

		stage.removeChild(stage.getChildByName("blobRed"));
		stage.removeChild(stage.getChildByName("blobGreen"));

		$('body').trigger("blobSpritesRemoved");
	},

	_onSlingshotStopped = function(event, data) {
		stage.addChild(data.sprites[0]);
		stage.addChild(data.sprites[1]);
		$('body').trigger("blobSpritesAdded");
	},

	_shakeCanvas = function(event, data) {
		$gamecanvas.effect("shake",{direction: data.direction, distance:8}, 220);
	},

	_listener = function(){
		// TODO change all the other requests to this one, then rename it!!
		$('body').on('juiceRequested', applyEntity);

		$('body').on('genericRequested', applyEntity);
		$('body').on('blobRequested', applyEntity);

		$('body').on('heliEntityRequested', applyHeli);
		$('body').on('removeHeliFromView', removeHeli);

		$('body').on('bridgeEntityRequested', applyBridge);
		$('body').on('removeBridgeFromView', removeBridge);

		$('body').on('sphereEntityRequested', applyHeli);
		$('body').on('removeSphereFromView', removeSphere);

		$('body').on('trampolinEntityRequested', applyTrampolin);

		$('body').on('stretchEntityRequested', applyStretch);

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