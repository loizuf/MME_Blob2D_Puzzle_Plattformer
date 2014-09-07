BlobApp.LevelLoader = (function() {
	var that = {},

	tileset,
	mapData,
	currentLoadedOverID,
	_globalStateHandler,
	_gameState,
	/* need to be extracted from json!*/
	_createRequestObject = {
		"sprite" : undefined,
		"userData" : undefined
	},

	init = function(lvlID, overID, globalStateHandler){
		var levelID = lvlID;
		var owID = overID;
		_globalStateHandler = globalStateHandler;
		_gameState = _globalStateHandler.getGameState();

		_initBackground();
		_getLevelMapData(levelID, owID);


		mapData = mapDataJson;

		// create EaselJS image for tileset
		tileset = new Image();

		// getting imagefile from first tileset
		tileset.src = "res/img/Tileset.png"//mapData.tilesets[0].image;

		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initLayers();

		return that;
	},

	_initBackground = function(){
		var background = new createjs.Bitmap("res/img/thingy.png");
		$('body').trigger('backgroundAdded', background);
	}

	_initLayers = function() {
		var width = mapData.tilesets[0].tilewidth;
		var height = mapData.tilesets[0].tileheight;

		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height
			}
		};

		// create spritesheet for generic objects (ground e.g.)
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		
		// loading each layer at a time
		for (var i = 0; i < mapData.layers.length; i++) {
			var layerData = mapData.layers[i];
			if (layerData.type == 'tilelayer') {
				_initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
			}
		}
	},

	// layer initialization
	_initLayer = function(layerData, tilesetSheet, tilewidth, tileheight) {
		borders = new Array();

		//Testvariable zur Übergabe von Infos(Doors)
		var doorCount = 0, buttonCount = 0, levelDoorCount = 0, movingGroundCount = 0;

		if(layerData.hasOwnProperty('properties') && layerData.properties.hasOwnProperty('OverWorldID')) {
			currentLoadedOverID = layerData.properties.OverWorldID;
		}

		for ( var y = 0; y < layerData.height; y++) {
			borders.push(new Array());

			for ( var x = 0; x < layerData.width; x++) {
				borders[y][x] = false;

				//get tile id
					var idx = x + y * layerData.width;

					xcoords = x * 25;
					ycoords = y * 25;

					switch(layerData.data[idx]) {
						case EntityConfig.REDBLOBID:
							_createRedBlob(xcoords,ycoords);
						break;

						case EntityConfig.REDBLOBLOWERID: 
						case EntityConfig.DOORLOWERID:
						case EntityConfig.EMPTYTILEID: 
						case EntityConfig.GOADLLOWERID:
						case EntityConfig.NEWGAMEDOORLOWERID:
						case EntityConfig.CONTINUEDOORLOWERID:
						case EntityConfig.LEVELDOORLOWERID:
						case EntityConfig.MOVINGGROUNDMIDDLEID:
						case EntityConfig.MOVINGGROUNDRIGHTID:
						break;

						case EntityConfig.GREENBLOBID:
							_createGreenBlob(xcoords, ycoords);
						break;

						case EntityConfig.DOORID:
							_createDoor(xcoords,ycoords,layerData,doorCount);
							doorCount++;
						break;
		
						case EntityConfig.BUTTONID:
							_createButton(xcoords,ycoords,layerData, buttonCount);
							buttonCount++;
						break;

						case EntityConfig.KEYID:
							_createKey(xcoords, ycoords);
						break;

						case EntityConfig.GOALID:
							_createGoal(xcoords, ycoords);
						break;

						case EntityConfig.NEWGAMEDOOR:
							_createNewGameDoor(xcoords, ycoords);
						break;

						case EntityConfig.CONTINUEDOOR:
							_createContinueDoor(xcoords, ycoords);
						break;

						case EntityConfig.MOVINGGROUNDID:
							_createMovingGround(xcoords, ycoords,movingGroundCount);
							movingGroundCount++;
						break;


						case EntityConfig.LEVELDOOR:
							_createLevelDoor(xcoords, ycoords, layerData, levelDoorCount);
							levelDoorCount++;
						break;

						case EntityConfig.HELITILE:
						case EntityConfig.HELISTOPTILE:
						case EntityConfig.SPHERETILE:
						case EntityConfig.TELE:
						case EntityConfig.BRIDGELEFTTILE:
						case EntityConfig.BRIDGERIGHTTILE:
						case EntityConfig.SLINGSHOTTILELEFT:
						case EntityConfig.SLINGSHOTTRIGGERRIGHT:
							_createTriggerZone(xcoords, ycoords, layerData.data[idx]+1000);
							borders[y][x] = true;
							_loadGenericData(layerData, tilesetSheet, xcoords, ycoords, idx);
						break;

						case EntityConfig.UPSPIKEID:
						case EntityConfig.DOWNSPIKEID:
						case EntityConfig.LEFTSPIKEID:
						case EntityConfig.RIGHTSIKEID:
							_loadSpikes(layerData, tilesetSheet, xcoords, ycoords, idx);
						break;

						default:
							borders[y][x] = true;
							_loadGenericData(layerData, tilesetSheet, xcoords, ycoords, idx);
						break;
					}
				}
			}
		_initBorders(borders);
	},

	_loadSpikes = function(layerData, tilesetSheet, x, y, idx) {
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		cellBitmap.gotoAndStop(layerData.data[idx] - 1);

		cellBitmap.x = x;
		cellBitmap.y = y;

		cellBitmap.regX = 12;
		cellBitmap.regY = 12;

		_createRequestObject["sprite"] = cellBitmap;
		_createRequestObject["userData"] = [EntityConfig.SPIKEID];

		_createRequestObject["height"] = 0.5;
		_createRequestObject["width"] = 0.5;

		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested',_createRequestObject);
	},

	_informModel = function(layerData, doorCount) {
		var doorNumber = layerData.properties.Doors[doorCount];
		var buttonNumber = layerData.properties.Doors[doorCount];
		var eventPackage = {
			"doorNumber": doorNumber,
			"buttonNumber": buttonNumber
		};

		$('body').trigger("doorCreated", eventPackage);
	},

	_initBorders = function(borders) {
		// Horizontal borders
		// Variables have: x, y, width, height
		hBorders = new Array();
		currentHBorder = undefined;

		for(var rowNum = 0; rowNum < borders.length; rowNum++) {
			currentHBorder = undefined;

			for(var colNum = 0; colNum < borders[0].length; colNum++) {
				if(borders[rowNum][colNum]) {
					if(!currentHBorder) {

						// UNLESS: Would be a single item AND is in a vertical line
						singleHorizontal = !((colNum != 0 && borders[rowNum][colNum - 1]) || (colNum != borders[0].length - 1 && borders[rowNum][colNum + 1]));
						verticalLine = ((rowNum != 0 && borders[rowNum - 1][colNum]));
						
						if(!(singleHorizontal && verticalLine)) {
							hBorders.push({
								"x" : colNum * 25,
								"y" : rowNum * 25,
								"width" : 12.5,
								"height" : 12.5,
								"userData" : [EntityConfig.HORIZONTALBORDERID, undefined]
							});

							currentHBorder = true;
						}

					} else {
						hBorders[hBorders.length - 1].width += 12.5;
						hBorders[hBorders.length -1].x += 12.5;
					}

				} else {
					currentHBorder = false;
				}
			}
		}

		for(var i = 0; i < hBorders.length; i++) {
			$('body').trigger('borderRequested', hBorders[i]);
		}

		// Vertical borders
		vBorders = new Array();
		currentVBorder = undefined;
		addStuff = undefined;

		for(var colNum = 0; colNum < borders[0].length; colNum++) {
			currentVBorder = undefined;

			for(var rowNum = 0; rowNum < borders.length; rowNum++) {
				if(borders[rowNum][colNum]) {
					if(!currentVBorder) {

						// IF: not already a horizontal line AND will be a vertical line
						verticalLine = ((rowNum != borders.length - 1 && borders[rowNum + 1][colNum]) || (rowNum != 0 && borders[rowNum - 1][colNum]));
						horizontalLine = ((colNum != 0 && borders[rowNum][colNum - 1]) || (colNum != borders[0].length - 1 && borders[rowNum][colNum + 1]));
						
						if(verticalLine && !horizontalLine){
							vBorders.push({ 
								"x" : colNum * 25,
								"y" : rowNum * 25,
								"width" : 12.5,
								"height" : 12.5,
								"userData" : [EntityConfig.VERTICALBORDERID, undefined]
							});

							currentVBorder = true;
						}

					} else {
						vBorders[vBorders.length - 1].height += 12.5;
						vBorders[vBorders.length -1].y += 12.5;
					}

				} else {
					currentVBorder = false;
				}
			}
		}

		for(var i = 0; i < vBorders.length; i++) {
			$('body').trigger('borderRequested', vBorders[i]);
		}
	},

	_loadGenericData = function(layerData, tilesetSheet, x, y, idx) {
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		// layer data has single dimension array

		// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
		cellBitmap.gotoAndStop(layerData.data[idx] - 1);

		// isometrix tile positioning based on X Y order from Tile
		cellBitmap.x = x;
		cellBitmap.y = y;

		cellBitmap.regX = 12;
		cellBitmap.regY = 12;
		// add bitmap to stage

		_createRequestObject["sprite"] = cellBitmap;
		/*if(layerData.data[]){

		} else {*/
			_createRequestObject["userData"] = [idx, undefined];
		//}
		$('body').trigger('genericRequested',_createRequestObject);
	},


	_createRedBlob = function(x, y) {
		var blob1 = new BlobApp.Blob(x, y, 50, 50, EntityConfig.REDBLOBID);

		_createRequestObject["sprite"] = blob1.sprite;
		_createRequestObject["userData"] = [EntityConfig.REDBLOBID, undefined];

		$('body').trigger('blobRequested', _createRequestObject);
	},

	_createGreenBlob = function(x, y) {
		var blob2 = new BlobApp.Blob(x, y, 50, 25, EntityConfig.GREENBLOBID);

		_createRequestObject["sprite"] = blob2.sprite;
		_createRequestObject["userData"] = [EntityConfig.GREENBLOBID,undefined];

		$('body').trigger('blobRequested', _createRequestObject);
	},


	_createButton = function(x, y,layerData,buttonCount){
		var entity = new BlobApp.TriggerButton(x, y, 25, 25, EntityConfig.BUTTONID);
		var buttonNumber = layerData.properties.Buttons[buttonCount];

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.BUTTONID, buttonNumber, layerData.properties.Doors[buttonCount]];

		entity.setUserData(_createRequestObject["userData"]);

		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createDoor = function(x, y, layerData, doorCount){
		var doorNumber = layerData.properties.Doors[doorCount];
		
		_informModel(layerData, doorCount);

		var entity = new BlobApp.DynamicDoor(x, y, 50, 75, doorNumber);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.DOORID, doorNumber];
		_createRequestObject["height"] = 2;
		
		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createNewGameDoor = function(x, y){
		var entity = new BlobApp.MenuDoor(x, y+12.5, 25, 50, 0);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.NEWGAMEDOOR];
		_createRequestObject["height"] = 2;
		
		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createContinueDoor = function(x, y){
		var entity = new BlobApp.MenuDoor(x, y+12.5, 25, 50, 1);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.CONTINUEDOOR];
		_createRequestObject["height"] = 2;
		
		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createMovingGround = function(x, y, movingGroundCount){
		var entity = new BlobApp.MovingGround(x+27.5, y, 75, 25, movingGroundCount);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.MOVINGGROUNDID, movingGroundCount];
		_createRequestObject["num"] = movingGroundCount
		
		$('body').trigger('entityRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createLevelDoor = function(x, y, layerData, levelDoorCount) {
		var levelDoorLevelID = layerData.properties.LevelDoorID[levelDoorCount];
		var levelDoorOverID = layerData.properties.OverWorldID;
		var entity = new BlobApp.LevelDoor(x, y+12.5, 25, 50, levelDoorLevelID);
		_createRequestObject["sprite"] = entity.sprite;
		if(currentLoadedOverID<_gameState.currentOverworldMapID){
			_createRequestObject["userData"] = [EntityConfig.LEVELDOOR, levelDoorLevelID, levelDoorOverID, true];
		} else {
			if(levelDoorLevelID<=_gameState.currentLevel){
				_createRequestObject["userData"] = [EntityConfig.LEVELDOOR, levelDoorLevelID, levelDoorOverID, true];
			} else {
				_createRequestObject["userData"] = [EntityConfig.LEVELDOOR, levelDoorLevelID, levelDoorOverID, false];
			}
		}
		_createRequestObject["height"] = 2;
		
		$('body').trigger('sensorRequested', _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},
	
	_createKey = function(x, y) {
		var entity = new BlobApp.Key(x, y, 30, 30, EntityConfig.KEYID);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.KEYID];
		_createRequestObject["height"] = 1;

		$('body').trigger("sensorRequested", _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createGoal = function(x, y) {
		var entity = new BlobApp.Goal(x, y+12.5, 25, 50, EntityConfig.GOALID);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [EntityConfig.GOALID];
		_createRequestObject["height"] = 2;

		$('body').trigger("sensorRequested", _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);
	},

	_createTriggerZone = function(x, y, entityID) {
		var entity = new BlobApp.CooperationTrigger(x, y-25, 60, 60, entityID);

		_createRequestObject["sprite"] = entity.sprite;
		_createRequestObject["userData"] = [entityID];
		_createRequestObject["height"] = 1.2;
		_createRequestObject["width"] = 1.2;

		$("body").trigger("sensorRequested", _createRequestObject);
		$('body').trigger('genericRequested', _createRequestObject);

		_createRequestObject["width"] = 1.0;

		if(entityID == EntityConfig.SLINGSHOTTRIGGERLEFT) {
			var entity = new BlobApp.Slingshot(x, y-50, 75, 75);
			_createRequestObject["sprite"] = entity.sprite;
			$('body').trigger('genericRequested', _createRequestObject);
		}

		if(entityID == EntityConfig.SLINGSHOTTRIGGERRIGHT) {

		}
	},

	// utility function for loading assets from server
	_httpGet = function(theUrl) {
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false);
		xmlHttp.send(null);
		return xmlHttp.responseText;
	},

	// utility function for loading json data from server
	_httpGetData = function(theUrl) {
		var responseText = httpGet(theUrl);
		return JSON.parse(responseText);
	},

	_getLevelMapData = function(levelNumber, overworldNumber) {
		switch (overworldNumber){
			case 0:
				mapDataJson = LevelConfig.MENU;
				break;

			case 1:
				loadLevelOverOne(levelNumber);
				break;

			case 2:
				loadLevelOverTwo(levelNumber);
				break;

			case 3:
				loadLevelOverThree(levelNumber);
		}
	},

	loadLevelOverOne = function(lvlNumber) {
		switch(lvlNumber){
			case 0:
				mapDataJson = LevelConfig.OVER0;
				break;

			case 1:
				mapDataJson = LevelConfig.INTRODUCTION;
				break;

			case 2:
				mapDataJson = LevelConfig.SNAKES;
				break;

			case 3:
				mapDataJson = LevelConfig.ROULETTE;
				break;

			case 4:
				mapDataJson = LevelConfig.HELI;
				break;

			case 5:
				mapDataJson = LevelConfig.TEMPLE;
				break;
		}
	},

	loadLevelOverTwo = function(lvlNumber) {
		switch(lvlNumber){
			case 0:
				mapDataJson = LevelConfig.OVER1;
				break;

			case 1:
				mapDataJson = LevelConfig.PRECISION;
				break;

			case 2:
				mapDataJson = LevelConfig.SIMPLEJUMP;
				break;

			case 3:
				mapDataJson = LevelConfig.FINISHTEST;
				break;

			case 4:
				mapDataJson = LevelConfig.TRAMPOLINE;
				break;

			case 5:
				mapDataJson = LevelConfig.SPECIALTEST;
				break;
		}
	},

	loadLevelOverThree = function(lvlNumber) {
		switch(lvlNumber){
			case 0:
				mapDataJson = LevelConfig.OVER3;
				break;

			case 1:
				mapDataJson = LevelConfig.RECURSIVE;
				break;

			case 2:
				mapDataJson = LevelConfig.RECURSIVE;
				break;

			case 3:
				mapDataJson = LevelConfig.RECURSIVE;
				break;

			case 4:
				mapDataJson = LevelConfig.RECURSIVE;
				break;

			case 5:
				mapDataJson = LevelConfig.RECURSIVE;
				break;
		}
	};

	that.init = init;
	
	return that;
})();