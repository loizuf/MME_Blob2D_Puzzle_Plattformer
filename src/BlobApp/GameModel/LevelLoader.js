BlobApp.LevelLoader = (function() {
	var that = {},
	tileset,
	mapData;
	/* need to be extracted from json!*/
	var REDBLOB = 2000;
	var GREENBLOB = 7;
	var SPIKES = 2000;


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
				switch(layerData.data[idx]){
					case REDBLOB:
					_createRedBlob();
					break;
					case GREENBLOB:
					_createGreenBlob(layerData, tilesetSheet, x, y, idx);
					break;
					case SPIKES:
					_createSpike();
					break;
					/*case DOORTRIGGER:
					
					break;
					case DOOR:

					break;*/
					case 0: break;
					default:
					_loadGenericData(layerData, tilesetSheet, x, y, idx);
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
		// isometrix tile positioning based on X Y order from Tiled
		cellBitmap.x = x*25 -12;
		cellBitmap.y = y*25 -12;
		// add bitmap to stage
		$('body').trigger('entityRequested',cellBitmap, null);
	},


	_createRedBlob = function(){
	//	var blob = new BlobbApp.Blob();#
		//$(this).trigger()

	},

	_createGreenBlob = function(layerData, tilesetSheet, x, y, idx){

		var cellBitmap = new createjs.Sprite(tilesetSheet);
		// layer data has single dimension array

		// tilemap data uses 1 as first value, EaselJS uses 0 (sub 1 to load correct tile)
		cellBitmap.gotoAndStop(layerData.data[idx]-1);
		// isometrix tile positioning based on X Y order from Tiled
		cellBitmap.x = x*25 -12;
		cellBitmap.y = y*25 -12;
		// add bitmap to stage


		var blob = new BlobApp.Blob(cellBitmap, x, y, 25, 25, 1);



		//$('body').trigger('entityRequested',cellBitmap, null);
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
		         "data":[129, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 34, 130, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 84, 85, 85, 85, 85, 85, 88, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 145, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 146],
		         "height":25,
		         "name":"Kachelebene 1",
		         "opacity":1,
		         "type":"tilelayer",
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