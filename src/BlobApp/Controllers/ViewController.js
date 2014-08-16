BlobApp.ViewController = (function() {
	var that = {},
	canvas, context, debugCanvas, debugContext, stage,

	b2ddebug = false,

	init = function() {
		_initView();
		_ticker();
		_listener();

		return that;
	},

	resetGame = function() {
		init();
	},

	applyEntity = function(event, data) {
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	// TODO: The view Controller should not have to know that such a thing as "heli" exists, it should just be told "remove blobs, add sprite" in a more general way!!
	applyHeli = function(event, data) {
		stage.removeChild(stage.getChildByName("blobRed"));
		stage.removeChild(stage.getChildByName("blobGreen"));

		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},

	removeHeli = function(event, data) {
		stage.removeChild(stage.getChildByName("heli"));

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
		createjs.Ticker.setFPS(30);
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

	_deleteDoor = function(event , data){
		var childIndex = stage.getChildIndex(data.sprite);
		stage.removeChildAt(childIndex);
	},

	_onLevelFinished = function() {
		$gamecanvas.css('display', 'none');
		_showMenu();
	},

	_listener = function(){
		$('body').on('genericRequested',applyEntity);
		$('body').on('blobRequested', applyEntity);

		$('body').on('heliEntityRequested', applyHeli);
		$('body').on('removeHeliFromView', removeHeli);

		$('body').on('trampolinEntityRequested', applyTrampolin);
		$('body').on('trampolinStopRequested', removeTrampolin);

		$('body').on('stretchEntityRequested', applyStretch);
		$('body').on('stretchStopRequested', removeStretch);

		$('body').on('backgroundAdded', applyBackground);
		$('body').on('viewOpenDoor', _deleteDoor);
		$('body').on('onPause', _displayPauseScreen);
		$('body').on('levelFinished', _onLevelFinished);
	};

	that.init = init;
	that.applyEntity = applyEntity;
	that.update = update;

	return that;
})();