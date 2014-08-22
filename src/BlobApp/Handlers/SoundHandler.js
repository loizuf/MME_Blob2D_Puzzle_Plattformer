
//The Sound Handler takes all incoming Sound Request Events and reacts


BlobApp.SoundHandler = (function() {
    
    var that = {},


    init = function() {
        var assetsPath = "res/sound/";
        //TODO: add files here, id is given manually
        manifest = [
            {id:"test", src:"test.ogg"},
        ];

        //createjs.Sound.alternateExtensions = ["mp3"];
         //TODO: maybe exract this to a preload module
        preload = new createjs.LoadQueue(true, assetsPath);
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("complete", _doneLoading);
        preload.loadManifest(manifest);

        _listeners();

        return that;
    },

    _doneLoading = function() {
          createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});

    };

    _listeners = function(){
          //TODO: register events fired for the sound handler
    }

    that.init = init;
    return that;
})();
