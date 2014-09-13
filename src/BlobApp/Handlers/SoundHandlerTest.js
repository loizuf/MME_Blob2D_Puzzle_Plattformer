BlobApp.SoundHandlerTest = (function() {

	
	var that = {};
	var sound = createjs.Sound;	
	var manifest = [];
	var assetsPath = 'res/sound/';
	var helisound;

	init = function() {
		_eventListeners();
		_createSoundManifest();		
		_playBackgroundMusic();
	},

	_createSoundManifest = function() {
		manifest = [
			{id:'jump', src:'jump.ogg'},
            {id:'splat', src:'splat.ogg'},
            {id:'startHeli', src:'heli.ogg'},
            {id:'tele', src:'teleport.ogg'},
            {id:'startSphere', src:'nom.ogg'},
            {id:'startSling', src:'skweak1.ogg'},
            {id:'clutchSling', src:'skweak2.ogg'},
            {id:'loosenSling', src:'skweak3.ogg'},
            {id:'finishSling', src:'slingPew.ogg'},
            {id:'shake', src:'rumble.ogg'},
            {id:'backGround', src:'Shakeandbake.ogg'},
            {id:'openDoor', src:'doorOpen.ogg'},
            {id:'unlockDoor', src:'unlock.ogg'},
		];

		sound.registerManifest(manifest, assetsPath);
	},

	_eventListeners = function() {
		$('body').on('soundJump', _playJumpSound);
        $('body').on('onReAllowJump', _playSplatSound);
        $('body').on('startHeli', _playHeliSound);
        $('body').on('startTele', _playTeleSound);
        $('body').on('startBridge', _playBridgeSound);
        $('body').on('startSphere', _playSphereAssembleSound);
        $('body').on('startSlingshot', _playSlingshotStartSound);
        $('body').on('soundSlingshotClutched', _playSlingshotClutchSound);
        $('body').on('soundSlingshotLoosened', _playSlingshotLoosenSound);      
        $('body').on('specialFinished', _stopSpecial);
        $('body').on('onTrampolinActive', _playTrampActSound);
        $('body').on('onTrampolinInactive', _playTrampDeactSound);
        $('body').on('onStretchActive', _playStretchActSound);
        $('body').on('onStretchInactive', _playStretchDeactSound);
        $('body').on('onCameraShakeRequested', _playShakeSound);
        $('body').on('playerOnSpikes',_playSplatSound);
        $('body').on('onKeyPickedUp',_playUnlockSound);
        $('body').on('soundDoorOpen',_playDoorOpenedSound);
        $('body').on('soundPause', _pauseSound);
        $('body').on('soundResume', _resumeSound);
        $('body').on('destroyPhysics', _stopSound);

       	$stopSound = $('#stop-sound');
		$resumeSound  = $('#resume-sound');
        $stopSound.unbind('click');
        $resumeSound.unbind('click');
        $stopSound.on('click', _pauseSound);
        $resumeSound.on('click', _resumeSound);
	},

	_playBackgroundMusic = function() {
		sound.play('backGround', {loop : -1});
		sound.volume = 0.2;
	},

	_playJumpSound = function(){ 
		sound.play('jump'); 
	},

	_playSplatSound = function(){ 
		sound.play('splat'); 
	},

	_playHeliSound = function(){ 
		console.log('heli sound play');
		helisound = sound.play('heli'); 
	},

	_playTeleSound = function(){ 
		sound.play('teleport'); 
	},

	_playBridgeSound = function(){ 
		sound.play('skweak1'); 
	},

	_playSphereAssembleSound = function(){ 
		sound.play('nom'); 
	},

	_playSlingshotStartSound = function(){ 
		sound.play('skweak3'); 
	},

	_playSlingshotClutchSound = function(){
		sound.play('skweak1'); 
	},

	_playSlingshotLoosenSound = function(){
		sound.play('skweak2'); 
	},

	_playSlingShotFireSound = function(){ 
		sound.play('slingPew'); 
	},

	_playTrampActSound = function(){ 
		sound.play('skweak2'); 
	},

	_playTrampDeactSound = function(){ 
		sound.play('skweak3'); 
	},

	_playStretchActSound = function(){ 
		sound.play('skweak2'); 
	},

	_playStretchDeactSound = function(){ 
		sound.play('skweak1'); 
	},

	_playShakeSound = function(){ 
		sound.play('shake'); 
	},

	_playUnlockSound = function(){ 
		sound.play('unlockDoor'); 
	},

	_playDoorOpenedSound = function(){ 
		sound.play('openDoor'); 
	},

	_stopSpecial = function(event, data) {  
        switch(data.specialName){
            case 'heli':
            _stopHeliSound();
            break;

            case 'bridge':
            case 'bridgeRight':
            _stopBridgeSound();
            break;

            case 'sphere':
            _stopSphereSound();
            break;

            case 'slingshot':
            _playSlingShotFireSound();
            break;
        }
    },

    _stopHeliSound = function() {  
        helisound.pause();
    },

    _stopBridgeSound = function() {
    	sound.play('skweak1'); 	
    },

	_stopSphereSound = function() {
		sound.play('nom'); 
	},

	_pauseSound = function() {
		sound.setMute(true);
	},

	_resumeSound = function() {
		sound.setMute(true);
	},

	_stopSound = function() {
		sound.removeAllSounds();
	};

	that.init = init;

	return that;
})();