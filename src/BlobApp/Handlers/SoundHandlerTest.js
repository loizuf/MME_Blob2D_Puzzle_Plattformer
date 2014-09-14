BlobApp.SoundHandlerTest = (function() {

	
	var that = {};
	var sound = createjs.Sound;	
	var manifest = [];
	var assetsPath = 'res/sound/';
	var helisound;
	var SOUNDVOLUME = 0.1;

	init = function() {
		_eventListeners();
		_createSoundManifest();		
		_playBackgroundMusic();
	},

	_createSoundManifest = function() {
		manifest = [
			{id:'jump', src:'jump.ogg'},
            {id:'splat', src:'splat.ogg'},
            {id:'heli', src:'heli.ogg'},
            {id:'tele', src:'teleport.ogg'},
            {id:'nom', src:'nom.ogg'},
            {id:'skweak1', src:'skweak1.ogg'},
            {id:'skweak2', src:'skweak2.ogg'},
            {id:'skweak3', src:'skweak3.ogg'},
            {id:'slingPew', src:'slingPew.ogg'},
            {id:'shake', src:'rumble.ogg'},
            {id:'backGround', src:'Shakeandbake.ogg'},
            {id:'openDoor', src:'doorOpen.ogg'},
            {id:'unlockDoor', src:'unlock.ogg'},
		];

		sound.registerManifest(manifest, assetsPath);
		sound.volume = 2;
	},

	_eventListeners = function() {
		$('body').on('soundJump', _playJumpSound);
        //$('body').on('onReAllowJump', _playSplatSound);
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
        $('body').on('levelFinished',_playDoorOpenedSound);
        $('body').on('animateLevelDoor',_playDoorOpenedSound);
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
		sound.play('backGround', {loop : -1,volume:SOUNDVOLUME/2});
	},

	_playJumpSound = function(){ 
		sound.play('jump',{volume:SOUNDVOLUME}); 
	},

	_playSplatSound = function(){ 
		sound.play('splat',{volume:SOUNDVOLUME}); 
	},

	_playHeliSound = function(){ 
		helisound = sound.play('heli',{loop : -1,volume:SOUNDVOLUME}); 
	},

	_playTeleSound = function(){ 
		sound.play('tele',{volume:SOUNDVOLUME}); 
	},

	_playBridgeSound = function(){ 
		sound.play('skweak1',{volume:SOUNDVOLUME}); 
	},

	_playSphereAssembleSound = function(){ 
		sound.play('nom',{volume:SOUNDVOLUME}); 
	},

	_playSlingshotStartSound = function(){ 
		sound.play('skweak3',{volume:SOUNDVOLUME}); 
	},

	_playSlingshotClutchSound = function(){
		sound.play('skweak1',{volume:SOUNDVOLUME}); 
	},

	_playSlingshotLoosenSound = function(){
		sound.play('skweak2',{volume:SOUNDVOLUME}); 
	},

	_playSlingShotFireSound = function(){ 
		sound.play('slingPew',{volume:SOUNDVOLUME}); 
	},

	_playTrampActSound = function(){ 
		sound.play('skweak2',{volume:SOUNDVOLUME}); 
	},

	_playTrampDeactSound = function(){ 
		sound.play('skweak3',{volume:SOUNDVOLUME}); 
	},

	_playStretchActSound = function(){ 
		sound.play('skweak2',{volume:SOUNDVOLUME}); 
	},

	_playStretchDeactSound = function(){ 
		sound.play('skweak1',{volume:SOUNDVOLUME}); 
	},

	_playShakeSound = function(){ 
		sound.play('shake',{volume:SOUNDVOLUME}); 
	},

	_playUnlockSound = function(){ 
		sound.play('unlockDoor',{volume:SOUNDVOLUME}); 
	},

	_playDoorOpenedSound = function(){ 
		console.log('opendoor');
		sound.play('openDoor',{volume:SOUNDVOLUME}); 
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
    	sound.play('skweak1',{volume:SOUNDVOLUME}); 	
    },

	_stopSphereSound = function() {
		sound.play('nom',{volume:SOUNDVOLUME}); 
	},

	_pauseSound = function() {
		sound.setMute(true);
	},

	_resumeSound = function() {
		sound.setMute(false);
	},

	_stopSound = function() {
		sound.removeAllSounds();
	};

	that.init = init;

	return that;
})();