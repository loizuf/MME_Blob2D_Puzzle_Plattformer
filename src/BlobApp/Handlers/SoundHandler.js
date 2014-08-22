
//The Sound Handler takes all incoming Sound Request Events and reacts


BlobApp.SoundHandler = (function() {
    // public interface
    var that = {},


    init = function() {
        var assetsPath = "res/sound/";
        manifest = [
            {id:"test", src:"test.ogg"},
        ];

    //    createjs.Sound.alternateExtensions = ["mp3"];
        preload = new createjs.LoadQueue(true, assetsPath);
        preload.installPlugin(createjs.Sound);
        preload.addEventListener("complete", doneLoading);
        preload.loadManifest(manifest);
        return that;
    },

    doneLoading = function() {
        console.log("woop");
        // start the music
        createjs.Sound.play("test", {interrupt:createjs.Sound.INTERRUPT_NONE, loop:-1, volume:0.4});
    };

    that.init = init;
    return that;
})();
