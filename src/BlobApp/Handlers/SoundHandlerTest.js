BlobApp.SoundHandlerTest = (function() {

	var sound = createjs.Sound;	
	var that = {};
	var manifest = [];

	init = function() {
		_createSoundManifest();
		_registerListeners();
	},

	playSound = function(event, data) {

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
	},

	_registerListeners = function() {
		$('body').on('soundJump', _playJumpSound);
        $('body').on('onReAllowJump', _playSplatSound);

        $('body').on("startHeli",_playHeliSound);
        $('body').on("startTele",_playTeleSound);
        $('body').on("startBridge",_playBridgeSound);

        $('body').on("startSphere",_playSphereAssembleSound);

        $('body').on('startSlingshot',_playSlingshotStartSound);
        $('body').on('soundSlingshotClutched',_playSlingshotClutchSound);
        $('body').on('soundSlingshotLoosened',_playSlingshotLoosenSound);
        
        $('body').on('specialFinished',_stopSpecial);

        $('body').on("onTrampolinActive", _playTrampActSound );
        $('body').on("onTrampolinInactive",_playTrampDeactSound);

        $('body').on("onStretchActive",_playStretchActSound);
        $('body').on("onStretchInactive",_playStretchDeactSound);

        $('body').on("onCameraShakeRequested",_playShakeSound);

        $('body').on('soundPause',_soundPause);
        $('body').on('soundResume',_resumeSound);

        $('body').on('restartPhys',_resumeSound);
        $('body').on('destroyPhysics',_stopAllSounds);
	};

	that.init = init;
	that.playSound = playSound;

	return that;
})();