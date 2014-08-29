
//The Sound Handler takes all incoming Sound Request Events and reacts


BlobApp.SoundHandler = (function() {
    var that = {},

    debug = true;

    heliActive = false;
    init = function() {
        var assetsPath = "res/sound/";
        //TODO: add files here, id is given manually
        manifest = [
            {id:"test", src:"test.ogg"},
        ];
        console.log(manifest);

        createjs.Sound.alternateExtensions = ["mp3"];
         //TODO: maybe exract this to a preload module
        preload = new createjs.LoadQueue(true, assetsPath);
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("complete", _doneLoading);
        preload.loadManifest(manifest);

        //_listeners();

        return that;
    },

    _doneLoading = function() {
        //TODO: maybe check if already loaded before game starts?
    },

    _listeners = function(){
        logg("listeners");
        //TODO: register events fired for the sound handler
        //jump sound for both players
        $('body').on('soundJump', _playJumpSound);
        //special ability start sounds with both players active, needs to be reworked for sphere and slingshot who are constantly producing sound rather than playing one looped sound or one single loop
        $('body').on("startHeli",_playHeliSound);
        $('body').on("startTele",_playTeleSound);
        $('body').on("startBridge",_playBridgeSound);
        $('body').on("startSphere",_playSphereSound);
        $('body').on('startSlingshot',_playSlingshotSound);
        $('body').on('specialFinished',_stopSpecial);

        //special ability sounds for greenblob only special
        $('body').on("onTrampolinActive", _playTrampActSound );
        $('body').on("onTrampolinInactive",_playTrampDeactSound);

        //special ability sounds for redBlob only special
        $('body').on("onStretchActive",_playStretchActSound);
        $('body').on("onStretchInactive",_playStretchDeactSound);
    }, 

    _playJumpSound = function() {
        logg("playJump");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },
    _playHeliSound = function() {  
        logg("helistarts");
        heliActive = true;
        helisound = createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
        helisound.addEventListener("complete", _handleHeliSound);
    },

    _playTeleSound = function() {  
        logg("tele");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playBridgeSound = function() { 
        logg("bridgestart"); 
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playSphereSound = function() {  
        logg("sphere start");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playSlingshotSound = function() {  

        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playTrampActSound = function() {  
        logg("tramp start");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playTrampDeactSound = function() {
        logg("tramp stop");  
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playStretchActSound = function() {  
        logg("stretch start");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _playStretchDeactSound = function() {  
        logg("stretch stop");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _stopSpecial = function(event, data) {  
        console.log(data.specialName)
        switch(data.specialName){
            case "heli":
            _stopHeliSound();
            break;

            case "tele":
            //unused
            break;

            case "bridgeLeft":
            case "bridgeRight":
            _stopBridgeSound();
            break;

            case "sphere":
            _stopSphereSound();
            break;

            case "slingshot":
            //unused
            break;
        }
    },

    _stopHeliSound = function() {  
        logg("heli stop");
        heliActive = false;
    },

    //unused now, tele has no real "stop sound"
    _stopTeleSound = function() {  

    },

    _stopBridgeSound = function() {  
        logg("bridge stop");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },

    _stopSphereSound = function() {  
        logg("sphere stop");
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
    },
    //unused now, slingshot has no real "stop sound" (other than the 'phew')
    _stopSlingshotSound = function() {  

    },

    _handleHeliSound = function (){
        if(heliActive){
            helisound = createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_ANY , loop:0, volume:0.1});
            helisound.addEventListener("complete", _handleHeliSound);
        }else{
            logg("heli stopped");
        }
    },


    logg = function(inp){
        if(debug){
            console.log(inp);
        }
    };


    that.init = init;
    return that;
})();
