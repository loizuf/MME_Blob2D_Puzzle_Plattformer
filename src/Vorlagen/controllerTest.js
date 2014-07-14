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
		$('body').on('keyup', _spawnOnThingy);
	},
	_spawnOnThingy = function(){
		console.log("thingy");
		/*levelloader ruft entity spawn mit parameter auf und bestimmt, welche entity gezeichnet werden soll*/
		entityTest.spawn();
	}


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