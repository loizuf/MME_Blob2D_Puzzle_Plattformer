BlobApp.ViewController = (function() {
	var that = {},
	canvas, context, debugCanvas, debugContext, stage,
	b2ddebug = true,

	init = function() {
		_initView();
		_ticker();
		_listener();

		return that;
	},

	applyEntity = function(event, data) {
		if(!b2ddebug){
			stage.addChild(data.sprite);
		}
	},
	applyBackground = function(event, wurst) {
		if(!b2ddebug){
			stage.addChild(wurst);
		}
	},

	update = function() {
		if(!b2ddebug){
			stage.update();
		}
	},

	displayPauseScreen = function() {
		_pauseGame();
		var $pauseContainer = $('#pause-container');
		var $gamecanvas = $('#canvas-container');
		var $menuResume = $('#resume');
		var $menuRestart = $('#restart');
		var $menuMenu = $('#retreat');

		$pauseContainer.css('display', 'block');
		$gamecanvas.css('display', 'none');

		$menuResume.on('click', _proceedGame);
		$menuRestart.on('click', _restartGame);
		$menuMenu.on('click', _showMenu);
	},

	_hidePauseScreen = function() {
		var $pauseContainer = $('#pause-container');
		$pauseContainer.css('display', 'none');
	},

	_restartGame = function() {
		//if(restarting){return;}
		var $gamecanvas = $('#canvas-container');
		$gamecanvas.css('display', 'block');
		_hidePauseScreen();
		_clearScene();
		$('body').trigger("destroyPhysics");
		_tick();
	},

	_clearScene = function(){
		stage.removeAllChildren();
	},

	_pauseGame = function(){
		createjs.Ticker.setFPS(0);
	},
	_resumeGame = function(){
		createjs.Ticker.setFPS(30);
	},

	_showMenu = function() {
		// needs unload everything (world, physics, level etc.)
	},

	_proceedGame = function() {
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
		console.log("tick");
		var onTickRequest = $.Event('onTick');
		$('body').trigger(onTickRequest);		
	},

	_deleteDoor = function(event , data){
		var i = stage.getChildIndex(data.sprite);
		stage.removeChildAt(i);
	},

	_listener = function(){
		$('body').on('genericRequested',applyEntity);
		$('body').on('blobRequested', applyEntity);
		$('body').on('backgroundAdded', applyBackground);
		$('body').on('viewOpenDoor', _deleteDoor);
	};

	that.init = init;
	that.applyEntity = applyEntity;
	that.update = update;
	that.displayPauseScreen = displayPauseScreen;

	return that;
})();