BlobApp.LevelLoader = (function() {
	var that = {},
	tileset,
	mapData,
	/* need to be extracted from json!*/
	_createRequestObject = {
		"sprite" : undefined,
		"number" : undefined
	},

	init = function(){
		console.log("levelloader started");
		mapData = mapDataJson;

		// create EaselJS image for tileset
		tileset = new Image();
		// getting imagefile from first tileset
		tileset.src = "res/img/Tileset.png"//mapData.tilesets[0].image;
		// callback for loading layers after tileset is loaded
		tileset.onLoad = _initLayers();
		return that;
	},

	_initLayers = function() {
		var w = mapData.tilesets[0].tilewidth;
		var h = mapData.tilesets[0].tileheight;
		var imageData = {
			images : [ tileset ],
			frames : {
				width : w,
				height : h
			}
		};
		// create spritesheet for generic objects (ground e.g.)
		var tilesetSheet = new createjs.SpriteSheet(imageData);
		
		// loading each layer at a time
		for (var idx = 0; idx < mapData.layers.length; idx++) {
			var layerData = mapData.layers[idx];
			if (layerData.type == 'tilelayer')
				_initLayer(layerData, tilesetSheet, mapData.tilewidth, mapData.tileheight);
		}
	}

	// layer initialization
	_initLayer = function(layerData, tilesetSheet, tilewidth, tileheight) {
		for ( var y = 0; y < layerData.height; y++) {
			for ( var x = 0; x < layerData.width; x++) {
				//get tile id
					var idx = x + y * layerData.width;
					xcoords = x*25;
					ycoords = y*25;
					switch(layerData.data[idx]){
					case EntityConfig.REDBLOBID:
					_createRedBlob(xcoords,ycoords);
					break;

					case EntityConfig.REDBLOBLOWERID:
					break;

					case EntityConfig.GREENBLOBID:
					_createGreenBlob(xcoords, ycoords);
					break;

					case EntityConfig.SPIKESID:
					_createSpike();
					break;
					/*case DOORTRIGGER:
					
					break;
					case DOOR:

					break;*/
					case 0: break;
					default:
					_loadGenericData(layerData, tilesetSheet, xcoords, ycoords, idx);
					break;
				}
			}
		}
	},

	_loadGenericData = function(layerData, tilesetSheet, x, y, idx){
		var cellBitmap = new createjs.Sprite(tilesetSheet);
		// layer data has single dimension array

		// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
		cellBitmap.gotoAndStop(layerData.data[idx]-1);
		// isometrix tile positioning based on X Y order from Tile

		cellBitmap.x = x;
		cellBitmap.y = y;

		cellBitmap.regX = 12;
		cellBitmap.regY = 12;
		// add bitmap to stage

		_createRequestObject["sprite"] = cellBitmap;
		_createRequestObject["number"] = idx;

		$('body').trigger('entityRequested',_createRequestObject);
	},


	_createRedBlob = function(x,y){
		var blob = new BlobApp.Blob(x, y, 25, 50, EntityConfig.REDBLOBID);

		_createRequestObject["sprite"] = blob.sprite;
		_createRequestObject["number"] = EntityConfig.REDBLOBID;

		$('body').trigger('blobRequested',_createRequestObject);
	},

	_createGreenBlob = function(x, y){
		var blob = new BlobApp.Blob(x, y, 25, 25, EntityConfig.GREENBLOBID);

		_createRequestObject["sprite"] = blob.sprite;
		_createRequestObject["number"] = EntityConfig.GREENBLOBID;

		$('body').trigger('blobRequested', _createRequestObject);
	},

	_createSpike = function() {

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
	};

	mapDataJson ={ "height":25,
					"layers":[
					        {
					        "data":[129, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 130, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 85, 85, 85, 85, 85, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 25, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 145, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 146],
					        "height":25,
					        "name":"Kachelebene 1",
					        "opacity":1,
					        "type":"tilelayer",
					        "visible":true,
					        "width":33,
					        "x":0,
					        "y":0
					        }, 
					        {
					        "height":25,
					        "name":"Objektebene 1",
					        "objects":[
					                {
					                "height":624,
					                "name":"",
					                "properties":
					                    {

					                    },
					                "type":"",
					                "visible":true,
					                "width":21,
					                "x":1,
					                "y":1
					                }, 
					                {
					                "height":21,
					                "name":"",
					                "properties":
					                    {

					                    },
					                "type":"",
					                "visible":true,
					                "width":825,
					                "x":0,
					                "y":0
					                }, 
					                {
					                "height":624,
					                "name":"",
					                "properties":
					                   {
					                    },
					                "type":"",
					                "visible":true,
					                "width":21,
					                "x":801,
					                "y":-1
					                }, 
					                {
					                "height":21,
					                "name":"",
					                "properties":
					                	{

					                    },
					                "type":"",
					                "visible":true,
					                "width":799,
					                "x":16,
					                "y":604
					                }],
					        "opacity":1,
					        "type":"objectgroup",
					        "visible":true,
					        "width":33,
					        "x":0,
					        "y":0
					        }],
					 "orientation":"orthogonal",
					 "properties":
					    {

					    },
					 "tileheight":25,
					 "tilesets":[
					        {
					         "firstgid":1,
					         "image":"..\/Documents\/MME_Project\/res\/img\/Tileset.png",
					         "imageheight":250,
					         "imagewidth":400,
					         "margin":0,
					         "name":"Tileset",
					         "properties":
					            {

					            },
					         "spacing":0,
					         "tileheight":25,
					         "tilewidth":25
					        }],
					 "tilewidth":25,
					 "version":1,
					 "width":33
					};
	that.init = init;

	return that;
})();