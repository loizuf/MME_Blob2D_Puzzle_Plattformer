appTest.controllerTest = (function() {
	var that = {},
	viewTest = null,
	physicsTest = null,
	entityTest = null,

	init = function() {
		_initModules();
		_registerListeners();
	},

	_initModules = function() {
		viewTest = appTest.viewTest.init();
		physicsTest = appTest.physicsTest.setup();
		entityTest = appTest.entityTest.init();
	},

	_registerListeners = function(event, data) {
		$(entityTest).on('onSpawnRequested', _spawnEntity);
		$(viewTest).on('onTick', _fetchEntity);
		$('body').on('keydown', _spawnOnThingy);
	},
	_spawnOnThingy = function(e){
		/*levelloader ruft entity spawn mit parameter auf und bestimmt, welche entity gezeichnet werden soll*/

		switch(e.keyCode) {
			 //       p2Jump : 38,
      //  p2Left : 37,
     //   p2Right : 39,
      //  p2Trigger : 40 

      		case 37: 
      			//console.log("1left");
	      		_moveEntityLeft(); 
	      		break;
	      	case 38:
	      		_jumpP1();
	      		break;
      		case 39: 
      			//console.log("1right");
      			_moveEntityRight(); 
      			break;
      		case 65: 
      			//console.log("2left");
      			_moveEntity2Left(); 
      			break;
      		case 87:
      			_jumpP2();
      			break;
      		case 68: 
      			//console.log("2right");
      			_moveEntity2Right(); 
      			break;
      			
      		case 13: entityTest.spawn();
      			//console.log("spawn");
				break;
		}

	},

	_moveEntityLeft = function() {
		physicsTest.moveLeft();
	},

	_jumpP2 = function() {
		physicsTest.jumpP2();
	},

	_jumpP1 = function() {
		physicsTest.jumpP1();
	},

	_moveEntityRight = function() {
		physicsTest.moveRight();
	},
	
	_moveEntity2Left = function() {
		physicsTest.moveLeft2();
	},
	_moveEntity2Right = function() {
		physicsTest.moveRight2();
	},

	_spawnEntity = function(event, data) {
		viewTest.applyEntity(data);
		physicsTest.applyEntity(data);
	},

	_fetchEntity = function() {
		physicsTest.update();
		viewTest.update();
		//entityTest.spawn();
	};

	that.init = init;
	return that;
})();