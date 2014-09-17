BlobApp.BlobGame = (function() {
	var that = {},

	p1Controls,
	p2Controls,

	worldToTest = 2,
	debug = false,

	$selectLevel1 = $('#level1'),
	$selectLevel2 = $('#level2'),
	$selectLevel3 = $('#level3'),
	$selectLevel4 = $('#level4'),
	$selectLevel5 = $('#level5'),
	$selectLevel6 = $('#level6'),
	/*$selectLevel7 = $('#level7'),
	$selectLevel8 = $('#level8'),
	$selectLevel9 = $('#level9'),
	$selectLevel10 = $('#level10'),
	$selectLevel11 = $('#level11'),
	$selectLevel12 = $('#level12'),
	$selectLevel13 = $('#level13'),
	$selectLevel14 = $('#level14'),*/
	$specialTest = $('#specialTest'),

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
			if(debug) {
				_enableLevelSelection();
			} else {
				_startActualGame();
			}
		});

		$controller2.on('click', function() {
			p2Controls = 2;
			$p2SelectionContainer.css('display', 'none');
			if(debug) {
				_enableLevelSelection();
			} else {
				_startActualGame();
			}
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
		$specialTest.unbind("click");
		/*$selectLevel7.unbind("click");
		$selectLevel8.unbind("click");
		$selectLevel9.unbind("click");
		$selectLevel10.unbind("click");
		$selectLevel11.unbind("click");
		$selectLevel12.unbind("click");
		$selectLevel13.unbind("click");
		$selectLevel14.unbind("click");*/
		
		$selectLevel1.on('click', {lvlID:0, owID:worldToTest}, _startGame);
		$selectLevel2.on('click', {lvlID:1, owID:worldToTest}, _startGame);
		$selectLevel3.on('click', {lvlID:2, owID:worldToTest}, _startGame);
		$selectLevel4.on('click', {lvlID:3, owID:worldToTest}, _startGame);
		$selectLevel5.on('click', {lvlID:4, owID:worldToTest}, _startGame);
		$selectLevel6.on('click', {lvlID:5, owID:worldToTest}, _startGame);
		$specialTest.on('click', {lvlID:9001, owID:900}, _startGame);
		/*$selectLevel7.on('click', {lvlID:2, owID:2}, _startGame);
		$selectLevel8.on('click', {lvlID:3, owID:2}, _startGame);
		$selectLevel9.on('click', {lvlID:4, owID:2}, _startGame);
		$selectLevel10.on('click', {lvlID:5, owID:2}, _startGame);
		$selectLevel11.on('click', {lvlID:0, owID:0}, _startGame);
		$selectLevel12.on('click', {lvlID:0, owID:1}, _startGame);
		$selectLevel13.on('click', {lvlID:0, owID:2}, _startGame);
		$selectLevel14.on('click', {lvlID:1, owID:3}, _startGame);*/
	},

	_startGame = function(event) {
		lvlID = event.data.lvlID;
		owID = event.data.owID;


		$('body').unbind();
		
		$levelSelectContainer.css('display', 'none');	
		$gamecanvas.css('display', 'block');

		BlobApp.MainController.init(lvlID, owID, p1Controls, p2Controls);
	},

	_startActualGame = function(){
		lvlID = 0;
		owID = 0;


		$('body').unbind();
		
		$levelSelectContainer.css('display', 'none');	
		$gamecanvas.css('display', 'block');

		BlobApp.MainController.init(lvlID, owID, p1Controls, p2Controls);
	};
 
	that.init = init;
	
	return that;
})();

