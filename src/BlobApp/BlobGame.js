BlobApp.BlobGame = (function() {
	var that = {},

	p1Controls,
	p2Controls,

	$selectLevel1 = $('#level1'),
	$selectLevel2 = $('#level2'),
	$selectLevel3 = $('#level3'),
	$selectLevel4 = $('#level4'),
	$selectLevel5 = $('#level5'),
	$selectLevel6 = $('#level6'),
	$selectLevel7 = $('#level7'),
	$selectLevel8 = $('#level8'),
	$selectLevel9 = $('#level9'),
	$TestMenu = $('#TestMenu'),
	$specialTestLevel = $('#specialTestLevel'),
	$Over0 = $('#Over0'),
	$Over1 = $('#Over1'),

	$keyboard1 = $('#keyboard1');
	$keyboard2 = $('#keyboard2');

	$controller1 = $('#controller1');
	$controller2 = $('#controller2');

	$p1SelectionContainer = $('#player1-control-selection-container');
	$p2SelectionContainer = $('#player2-control-selection-container');

	$menuplay = $('#menu-play'),
	$menucontainer = $('#menu-container'),

	$levelSelectContainer = $('#levelselect-container'),

	$gamecanvas = $('#canvas-container'),

	init = function(){
		$menuplay.unbind("click");
		$menuplay.on('click', _enableControlsSelection);	
	},

	_enableControlsSelection = function() {
		$menucontainer.css('display', 'none');
		$p1SelectionContainer.css('display', 'block');

		$keyboard1.unbind('click');
		$keyboard2.unbind('click');

		$controller1.unbind('click');
		$controller2.unbind('click');

		$keyboard1.on('click', function() {
			p1Controls = 1;
			_progressToPlayerToControlsSelection();
		});

		$controller1.on('click', function() {
			p1Controls = 2;
			_progressToPlayerToControlsSelection();
		});
 
		$keyboard2.on('click', function() {
			p2Controls = 1;
			$p2SelectionContainer.css('display', 'none');
			_enableLevelSelection();
		});

		$controller2.on('click', function() {
			p2Controls = 2;
			$p2SelectionContainer.css('display', 'none');
			_enableLevelSelection();
		});
	},

	_progressToPlayerToControlsSelection = function() {
		$p1SelectionContainer.css('display', 'none');
		$p2SelectionContainer.css('display', 'block');
	},

	_enableLevelSelection = function() {			
		$levelSelectContainer.css('display', 'block');

		$selectLevel1.unbind("click");
		$selectLevel2.unbind("click");
		$selectLevel3.unbind("click");
		$selectLevel4.unbind("click");
		$selectLevel5.unbind("click");
		$selectLevel6.unbind("click");
		$selectLevel7.unbind("click");
		$selectLevel8.unbind("click");
		$selectLevel9.unbind("click");
		$TestMenu.unbind("click");
		$Over0.unbind("click");
		$Over1.unbind("click");
		$specialTestLevel.unbind("click");

		$selectLevel1.on('click', {lvlID:1}, _startGame);
		$selectLevel2.on('click', {lvlID:2}, _startGame);
		$selectLevel3.on('click', {lvlID:3}, _startGame);
		$selectLevel4.on('click', {lvlID:4}, _startGame);
		$selectLevel5.on('click', {lvlID:5}, _startGame);
		$selectLevel6.on('click', {lvlID:6}, _startGame);
		$selectLevel7.on('click', {lvlID:7}, _startGame);
		$selectLevel8.on('click', {lvlID:8}, _startGame);
		$selectLevel9.on('click', {lvlID:9}, _startGame);	
		$specialTestLevel.on('click', {lvlID: 9001}, _startGame);
		$TestMenu.on('click', {lvlID:0}, _startGame);
		$Over0.on('click', {lvlID:98}, _startGame);
		$Over1.on('click', {lvlID:99}, _startGame);
	},

	_startGame = function(event) {
		lvlID = event.data.lvlID;

		$('body').unbind();
		
		$levelSelectContainer.css('display', 'none');	
		$gamecanvas.css('display', 'block');

		BlobApp.MainController.init(lvlID, p1Controls, p2Controls);
	};
 
	that.init = init;
	
	return that;
})();

