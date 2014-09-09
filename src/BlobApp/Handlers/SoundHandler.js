
//The Sound Handler takes all incoming Sound Request Events and reacts


BlobApp.SoundHandler = (function() {
    var that = {},
    helisound,
    backGroundSoud,
    preload1,
    preload2,
    soundSlave,

    debug = true,
    soundActive = true,

    /*sound ui? or leave it here*/
    $stopSound = $('#stop-sound'),
    $resumeSound = $('#resume-sound'),


    heliActive = false;


    init = function() {
        console.log("hoot");
        soundSlave.setMute(false);
        soundSlave.stop();
        _listeners();
        _playBackground();
        return that;
    },

    loadAssets = function(){
        console.log("woot");
        var assetsPath = "res/sound/";
        //TODO: add files here, id is given manually
        manifest1 = [ 
            {id:"jump", src:"jump.ogg"},
            {id:"splat", src:"splat.ogg"},
            {id:"startHeli", src:"heli.ogg"},
            {id:"tele", src:"teleport.ogg"},
            /*bridge*/
           // {id:"startBridge", src:"test.ogg"},
           // {id:"finishBridge", src:"test.ogg"},
            /*sphere*/
            {id:"startSphere", src:"nom.ogg"},
           //{id:"finishSphere", src:"nom.ogg"},
           /*slingshot*/
            {id:"startSling", src:"skweak1.ogg"},
            {id:"clutchSling", src:"skweak2.ogg"},
            {id:"loosenSling", src:"skweak3.ogg"},
            {id:"finishSling", src:"slingPew.ogg"},
           //{id:"finishHeli", src:"test.ogg"},
            {id:"shake", src:"rumble.ogg"},
            {id:"backGround", src:"Shakeandbake.ogg"} 
        ];
          
        soundSlave = createjs.Sound;
        soundSlave.alternateExtensions = ["mp3"];
         //TODO: maybe exract this to a preload module
        preload1 = new createjs.LoadQueue(true, assetsPath);
        preload1.installPlugin(soundSlave);
        preload1.addEventListener('complete', _doneLoading);
        preload1.loadManifest(manifest1);
       
    },

    _doneLoading = function() {
        //TODO: maybe check if already loaded before game starts?
        $('body').trigger("doneLoading");
    },
    
    _playBackground = function(){
        //if(!backGroundSoud.isActive()){
            _logg("_playBackground");
            backGroundSoud = soundSlave.play("backGround", {interrupt:soundSlave.INTERRUPT_ANY , loop:-1, volume:0.1});
        //}
    },

    _listeners = function(){
         console.log("fuckenlisteners");
        //TODO: register events fired for the sound handler
        //jump sound for both players
        $('body').on('soundJump', _playJumpSound);
        $('body').on('onReAllowJump', _playSplatSound);
        //special ability start sounds with both players active, needs to be reworked for sphere and slingshot who are constantly producing sound rather than playing one looped sound or one single loop
        $('body').on("startHeli",_playHeliSound);
        $('body').on("startTele",_playTeleSound);
        $('body').on("startBridge",_playBridgeSound);

        $('body').on("startSphere",_playSphereAssembleSound);

        $('body').on('startSlingshot',_playSlingshotStartSound);
        $('body').on('soundSlingshotClutched',_playSlingshotClutchSound);
        $('body').on('soundSlingshotLoosened',_playSlingshotLoosenSound);
        /*thats already done in slingshot*/
        // $('body').on('slingshotFinished',_playSlingShotFireSound);
        
        $('body').on('specialFinished',_stopSpecial);

        //special ability sounds for greenblob only special
        $('body').on("onTrampolinActive", _playTrampActSound );
        $('body').on("onTrampolinInactive",_playTrampDeactSound);

        //special ability sounds for redBlob only special
        $('body').on("onStretchActive",_playStretchActSound);
        $('body').on("onStretchInactive",_playStretchDeactSound);

        $('body').on("onCameraShakeRequested",_playShakeSound);

        $('body').on('soundPause',_soundPause);
        $('body').on('soundResume',_resumeSound);

        $('body').on('restartPhys',_resumeSound);
        $('body').on('destroyPhysics',_stopAllSounds);
     // $('body').on('resetGame',_stopAllSounds);


        $('body').on('onPause',_soundPause);

        $stopSound.unbind("click");
        $stopSound.on('click', _soundPause);

        $resumeSound.unbind("click");
        $resumeSound.on('click', _resumeSound);
        
    }, 

    _playJumpSound = function() {
      //  if(soundActive){
            _logg("playJump");
            soundSlave.play("jump", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },

    _playSplatSound = function() {
        //if(soundActive){
        //   _logg("playSplat");
            /*currently not playing due to problems regarding stretch/trampolin (multiple triggers of reallow jump)*/
            // soundSlave.play("splat", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        //}
    },

    _playHeliSound = function() {  
      //  if(soundActive){
            _logg("helistarts");
            heliActive = true;
            helisound = soundSlave.play("startHeli", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
            helisound.addEventListener("complete", _handleHeliSound);
       // }
    },

    _playTeleSound = function() {  
       // if(soundActive){
            _logg("tele");
            soundSlave.play("tele", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
       // }
    },

    _playBridgeSound = function() { 
        //   if(soundActive){
            _logg("bridgestart"); 
            soundSlave.play(/*"startBridge"*/"startSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        //  }
    },

    _playSphereAssembleSound = function() {
        //  if(soundActive){
            _logg("sphere start");
            soundSlave.play("startSphere", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.8});
        //  }
    },

    _playSlingshotStartSound= function() {  
        //  if(soundActive){
            soundSlave.play("startSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        //  }
    },
    _playSlingshotClutchSound= function() {  
        //   if(soundActive){
            soundSlave.play("clutchSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        //  }
    },
    _playSlingshotLoosenSound= function() {  
        //  if(soundActive){
            soundSlave.play("loosenSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        //  }
    },

    _playSlingShotFireSound= function() {  
        //   if(soundActive){
            soundSlave.play("finishSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
        // }
    },
     

    _playTrampActSound = function() {  
      //  if(soundActive){
            _logg("tramp start");
            soundSlave.play("skweak2", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.5});
      //  }
    },

    _playTrampDeactSound = function() {
      //  if(soundActive){
            _logg("tramp stop");  
            soundSlave.play("skweak3", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.5});
      //  }
    },

    _playStretchActSound = function() {  
      //  if(soundActive){
            _logg("stretch start");
            soundSlave.play("skweak1", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.5});
     //   }
    },

    _playStretchDeactSound = function() { 
     //   if(soundActive){
            _logg("stretch stop");
            soundSlave.play("skweak3", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.5});
     //   }
    },

    _stopSpecial = function(event, data) {  
        console.log(data.specialName)
        switch(data.specialName){
            case "heli":
            _stopHeliSound();
            break;

            case "bridge":
            case "bridgeRight":
            _stopBridgeSound();
            break;

            case "sphere":
            _stopSphereSound();
            break;

            case "slingshot":
            _playSlingShotFireSound();
            break;
        }
    },


    _stopHeliSound = function() {  
      //  if(soundActive){
            _logg("heli stop");
            helisound.pause();
            heliActive = false;
     //   }
    },

    //unused now, tele has no real "stop sound"
    _stopTeleSound = function() {  

    },

    _stopBridgeSound = function() {  
       // if(soundActive){
            _logg("bridge stop");
            soundSlave.play(/*"finishBridge"*/"clutchSling", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.3});
       // }
    },

    _stopSphereSound = function() { 
      //  if(soundActive){
            _logg("sphere stop");
            soundSlave.play("startSphere", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.8});
      //  }
    },

    _handleHeliSound = function (){
      //  if(soundActive){
            if(heliActive){
                helisound = soundSlave.play("startHeli", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1});
                helisound.addEventListener("complete", _handleHeliSound);
            }else{

            }
      //  }
    },

    _playShakeSound = function() {
      //  if(soundActive){
            _logg("shake");
            soundSlave.play("shake", {interrupt:soundSlave.INTERRUPT_ANY , loop:0, volume:0.1}); 
      //  }
    },

    _soundPause = function() {
        _logg("stop S"); 
        soundSlave.setMute(true);
    },

     _stopAllSounds = function() {
        _logg("stop ALL"); 
        soundSlave.stop();
      // soundSlave.removeAllSounds();
      //  preload1.removeAll ();
    },

    _resumeSound = function(){
        _logg("res S");
        soundSlave.setMute(false);
        _playBackground();
    },


    _logg = function(inp){
        if(debug){
            console.log(inp);
        }
    };


    that.init = init;
    that.loadAssets = loadAssets;
    return that;
})();
