BlobApp.SoundHandlerTest = (function() {

	var sound = createjs.Sound;	
	var that = {};
	var manifest = [];
	var assetsPath = "res/sound/"

	init = function() {
		_createSoundManifest();
		_registerListeners();
		_playBackgroundMusic();
	},

	_createSoundManifest = function() {
		manifest = [
			{id:"jump", src:"jump.ogg"},
            
            {id:"splat", src:"splat.ogg"},
            
            {id:"startHeli", src:"heli.ogg"},
            
            {id:"tele", src:"teleport.ogg"},
            
            {id:"startSphere", src:"nom.ogg"},
            
            {id:"startSling", src:"skweak1.ogg"},
            {id:"clutchSling", src:"skweak2.ogg"},
            {id:"loosenSling", src:"skweak3.ogg"},
            {id:"finishSling", src:"slingPew.ogg"},
            
            {id:"shake", src:"rumble.ogg"},
            
            {id:"backGround", src:"Shakeandbake.ogg"} 
		];

		sound.registerManifest(manifest, assetsPath);
	},

	_registerListeners = function() {
		//$('body').on('soundBackground', _playBackgroundMusic);
		$('body').on('soundJump', _playGenericSound);
        $('body').on('onReAllowJump', _playGenericSound);

        $('body').on("startHeli", _playHeliSound);
        $('body').on("startTele", _playGenericSound);
        $('body').on("startBridge", _playGenericSound);

        $('body').on("startSphere", _playGenericSound);

        $('body').on('startSlingshot', _playGenericSound);
        $('body').on('soundSlingshotClutched', _playGenericSound);
        $('body').on('soundSlingshotLoosened', _playGenericSound);
        
        //$('body').on('specialFinished', _stopSpecial);

        $('body').on("onTrampolinActive", _playGenericSound);
        $('body').on("onTrampolinInactive", _playGenericSound);

        $('body').on("onStretchActive", _playGenericSound);
        $('body').on("onStretchInactive", _playGenericSound);

        $('body').on("onCameraShakeRequested", _playGenericSound);

        /*$('body').on('soundPause', _soundPause);
        $('body').on('soundResume', _resumeSound);
		*/
        $('body').on('destroyPhysics', _stopSound);
	},

	_playBackgroundMusic = function() {
		sound.play("backGround", {loop : -1});
		sound.volume = 0.2;
	},

	_playGenericSound = function(event, data) {

	},

	_playHeliSound = function(event, data) {

	},

	_stopSound = function() {
		console.log("called");
		sound.removeAllSounds();
	};

	that.init = init;

	return that;
})();