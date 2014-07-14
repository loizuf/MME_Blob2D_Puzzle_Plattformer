
//The Input Handler takes all incoming Key Events (and !TODO! possibly XBox-/Controller-Inputs) and informs the Controller.


BlobApp.InputHandler = (function() {
    // public interface
    var that = {},

    // Contains key codes for the two blobs for the basic interaction: Movement, Triggers
    var keyMap = {
        p1Jump : 87,
        p1Left : 65,
        p1Right : 68,
        p1Trigger : 83,

        p2Jump : 38,
        p2Left : 37,
        p2Right : 39,
        p2Trigger 40: 
    },

    init = function() {
        $body = $('body');
        $body.on('keyUp',_onKeyUp);
    },
    /*fire callback for thingy*/
    _onKeyUp = function(e){
        switch(e.keyCode){
            case keyMap.p1Jump:
            
            break;

            case keyMap.p1Left:

            break;

            case keyMap.p1Right:

            break;

            case keyMap.p1Trigger:

            break;

            case keyMap.p2Jump:

            break;

            case keyMapp.p2Left:

            break;

            case keyMap.p2Right:

            break;

            case keyMap.p2Trigger:

            break;
        }
    };


    that.init = init;
    return that;
})();
 No newline at end of file
