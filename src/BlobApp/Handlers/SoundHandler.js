
//The Sound Handler takes all incoming Sound Request Events and reacts


BlobApp.SoundHandler = (function() {
    var that = {},
    helisound,
    backGroundSoud,

    debug = true,
    soundActive = true,

    heliActive = false;
    init = function() {
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
            {id:"finishSphere", src:"nom.ogg"},
           /*slingshot*/
            {id:"startSling", src:"skweak1.ogg"},
            {id:"clutchSling", src:"skweak2.ogg"},
            {id:"loosenSling", src:"skweak3.ogg"},
            {id:"finishSling", src:"slingPew.ogg"},
           //{id:"finishHeli", src:"test.ogg"},
            {id:"shake", src:"rumble.ogg"},
            
        ];
        manifest2 = [
            {id:"backGround", src:"Shakeandbake.ogg"},
        ];
        //console.log(manifest);

        createjs.Sound.alternateExtensions = ["mp3"];
         //TODO: maybe exract this to a preload module
        preload = new createjs.LoadQueue(true, assetsPath);
        preload.installPlugin(createjs.Sound);
        preload.loadManifest(manifest2);
        //preload.loadFile("Shakeandbake.ogg");
        preload.removeEventListener('complete',_doneLoading);
        preload.addEventListener("complete", _doneLoading);
        createjs.Sound.setMute(false);

        _listeners();

        return that;
    },

    _doneLoading = function() {
        //TODO: maybe check if already loaded before game starts?
        preload.removeEventListener('complete',_doneLoading);
        preload.loadManifest(manifest1);
        _playBackground();
    },
    
    _playBackground = function(){
        //if(!backGroundSoud.isActive()){
            _logg("_playBackground");
            backGroundSoud = createjs.Sound.play("backGround", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:-1, volume:0.1});
       // }
    },

    _listeners = function(){
        _logg("listeners");
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

        //$('body').on('soundPause',_soundPause);
        $('body').on('soundResume',_resumeSound);

        $('body').on('restartPhys',_resumeSound);
        $('body').on('resetGame',_stopAllSounds);


        $('body').on('onPause',_soundPause);
        
    }, 

    _playJumpSound = function() {
      //  if(soundActive){
            _logg("playJump");
            createjs.Sound.play("jump", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },

    _playSplatSound = function() {
        if(soundActive){
            _logg("playSplat");
            /*currently not playing due to problems regarding stretch/trampolin (multiple triggers of reallow jump)*/
            // createjs.Sound.play("splat", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
            }
    },

    _playHeliSound = function() {  
      //  if(soundActive){
            _logg("helistarts");
            heliActive = true;
            helisound = createjs.Sound.play("startHeli", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
            helisound.addEventListener("complete", _handleHeliSound);
       // }
    },

    _playTeleSound = function() {  
       // if(soundActive){
            _logg("tele");
            createjs.Sound.play("tele", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
       // }
    },

    _playBridgeSound = function() { 
     //   if(soundActive){
            _logg("bridgestart"); 
            createjs.Sound.play(/*"startBridge"*/"startSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },

    _playSphereAssembleSound = function() {
      //  if(soundActive){
            _logg("sphere start");
            createjs.Sound.play("startSphere", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.8});
      //  }
    },

    _playSlingshotStartSound= function() {  
      //  if(soundActive){
            createjs.Sound.play("startSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },
    _playSlingshotClutchSound= function() {  
     //   if(soundActive){
            createjs.Sound.play("clutchSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },
    _playSlingshotLoosenSound= function() {  
      //  if(soundActive){
            createjs.Sound.play("loosenSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
      //  }
    },

    _playSlingShotFireSound= function() {  
     //   if(soundActive){
            createjs.Sound.play("finishSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
       // }
    },
     

    _playTrampActSound = function() {  
      //  if(soundActive){
            _logg("tramp start");
            createjs.Sound.play("skweak2", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.5});
      //  }
    },

    _playTrampDeactSound = function() {
      //  if(soundActive){
            _logg("tramp stop");  
            createjs.Sound.play("skweak3", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.5});
      //  }
    },

    _playStretchActSound = function() {  
      //  if(soundActive){
            _logg("stretch start");
            createjs.Sound.play("skweak1", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.5});
     //   }
    },

    _playStretchDeactSound = function() { 
     //   if(soundActive){
            _logg("stretch stop");
            createjs.Sound.play("skweak3", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.5});
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
            createjs.Sound.play(/*"finishBridge"*/"clutchSling", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.3});
       // }
    },

    _stopSphereSound = function() { 
      //  if(soundActive){
            _logg("sphere stop");
            createjs.Sound.play("finishSphere", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.8});
      //  }
    },

    _handleHeliSound = function (){
      //  if(soundActive){
            if(heliActive){
                helisound = createjs.Sound.play("startHeli", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
                helisound.addEventListener("complete", _handleHeliSound);
            }else{

            }
      //  }
    },

    _playShakeSound = function() {
      //  if(soundActive){
            _logg("shake");
            createjs.Sound.play("shake", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1}); 
      //  }
    },

    _soundPause = function() {
        _logg("stop S"); 
        createjs.Sound.setMute(true);
    },

     _stopAllSounds = function() {
        _logg("stop ALL"); 
        createjs.Sound.stop();
    },
    _resumeSound = function(){
        _logg("res S");
        createjs.Sound.setMute(false);
        soundActive = true;
       // _playBackground();
    },


    _logg = function(inp){
        if(debug){
            console.log(inp);
        }
    };


    that.init = init;
    return that;
})();
