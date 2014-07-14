
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
        $body.on('keyDown',_onKeyDown);
    },
    /*start movement left/right, trigger jump/trigger effect*/
    _onKeyUp = function(e){
        switch(e.keyCode){
            case keyMap.p1Jump:
                $(that).trigger('p1ArrowUp');
            break;

            case keyMap.p1Left:
                $(that).trigger('p1ArrowLeftStarted');
            break;

            case keyMap.p1Right:
                $(that).trigger('p1ArrowRightStarted');
            break;

            case keyMap.p1Trigger:
                $(that).trigger('p1ArrowDown');
            break;

            case keyMap.p2Jump:
                $(that).trigger('p2ArrowUp');
            break;

            case keyMapp.p2Left:
                $(that).trigger('p2ArrowLeftStarted');
            break;

            case keyMap.p2Right:
                $(that).trigger('p2ArrowRightStarted');
            break;

            case keyMap.p2Trigger:
                $(that).trigger('p2ArrowDown');
            break;
        }
    },
    /*stopMovement left/right*/
    _onKeyDown = function(e){
        switch(e.keyCode){
            case keyMap.p1Left:
                $(that).trigger('p1ArrowLeftStopped');
            break;

            case keyMap.p1Right:
                $(that).trigger('p1ArrowRightStopped');
            break;

            case keyMapp.p2Left:
                $(that).trigger('p2ArrowLeftStopped');
            break;

            case keyMap.p2Right:
                $(that).trigger('p2ArrowRightStopped');
            break;
        }
    };


    that.init = init;
    return that;
})();
 No newline at end of file
