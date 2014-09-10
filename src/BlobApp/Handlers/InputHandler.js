
//The Input Handler takes all incoming Key Events (and !TODO! possibly XBox-/Controller-Inputs) and informs the Controller.


BlobApp.InputHandler = (function() {
    // public interface
    var that = {},

    ID_CONTROLLER_ONE = 0,
    ID_CONTROLLER_TWO = 1,
    GAMEPAD_ANALOG_STICK_DEADZONE = 0.3,

    isHeliActive = false,
    isLeftActiveButton = false,
    isRightActiveButton = true,

    controller1,
    controller2,
    player1,
    player2,
    _requestAnimFrame,
    isChrome,
    haveEvents,
    isSlingshot,

    XBOX_AXES = {
        LEFT_STICK_X: 0,
        LEFT_STICK_Y: 1,

        RIGHT_STICK_X: 2,
        RIGHT_STICK_Y: 3
    };
   
    XBOX_BUTTONS = {
        A: 0,
        B: 1,
        X: 2,
        Y: 3,

        LB: 4,
        RB: 5,

        LEFT_STICK: 6,
        RIGHT_STICK: 7,

        BACK: 8,
        START: 9,

        HOME: 10,

        DPAD_UP: 12,
        DPAD_DOWN: 13,
        DPAD_LEFT: 14,
        DPAD_RIGHT: 15
    };

    // Contains key codes for the two blobs for the basic interaction: Movement, Triggers
    keyMap = {
        p1Jump : 87,
        p1Left : 65,
        p1Right : 68,
        p1Trigger : 83,

        p2Jump : 38,
        p2Left : 37,
        p2Right : 39,
        p2Trigger : 40,

        pause : 27
    },

    controller1ButtonsPressed = {
        left_pressed: false,
        right_pressed: false,
        a_pressed: false,
        x_pressed: false
    },

    controller2ButtonsPressed = {
        left_pressed: false,
        right_pressed: false,
        a_pressed: false,
        x_pressed: false,
        lb_pressed: false,
        rb_pressed: false
    },

    init = function(p1ControlsID, p2ControlsID) {
        controller1 = undefined;
        controller2 = undefined;

        player1 = p1ControlsID;
        player2 = p2ControlsID;

        isHeliActive = false;
        isSlingshot = false;

        $body = $('body');

        $body.on('keyup',_onKeyUp);
        $body.on('keydown',_onKeyDown);
        $body.on('startSlingshot', function() {
            isSlingshot = true;
        });

        $body.on('onSlingshotFinished', function() {
            isSlingshot = false;
        });

        _initGamepads(p1ControlsID, p2ControlsID);

        
        
        return that;
    },

    changeControls = function() {
        isHeliActive = !isHeliActive;
    },

    _initGamepads = function() {
        _requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame,
        isChrome = navigator.userAgent.match(/Chrome/),
        haveEvents = !isChrome;

        if (!haveEvents) {
            _updateControllers();
        } 
    },

    _updateControllers = function() {
        if (!haveEvents) {
            if(player1 == 2 && player2 == 2) {
                controller1 = navigator.getGamepads()[ID_CONTROLLER_ONE];
                controller2 = navigator.getGamepads()[ID_CONTROLLER_TWO];
            } else if(player1 == 2){
                controller1 = navigator.getGamepads()[ID_CONTROLLER_ONE];
            } else if(player2 == 2){
                controller2 = navigator.getGamepads()[ID_CONTROLLER_ONE];
            }  
        }

        if(controller1 !== undefined || controller2 != undefined) {
            _updateXboxControllers();
            _requestAnimFrame(_updateControllers); 
        } else {
            _requestAnimFrame(_updateControllers); 
        }
    },

    _updateXboxControllers = function() {
        if(controller1 !== undefined) {
            _trackPlayerOneGreenBlob();
        }

        if (controller2 !== undefined) {
            _trackPlayerTwoRedBlob();
        }
    },

    _trackPlayerOneGreenBlob = function() {
        _checkGamepad1Buttons();
        _checkGamepad1StickAxes();
    },

    _trackPlayerTwoRedBlob = function() {
        _checkGamepad2Buttons();
        _checkGamepad2StickAxes();  
    },

    _checkGamepad1Buttons  = function() {
        for (var buttonPos = 0; buttonPos < controller1.buttons.length; buttonPos++) {
            if (!_buttonPressed(controller1.buttons[buttonPos])) {
                _releaseGamepadsButtonsInput(ID_CONTROLLER_ONE, buttonPos);
                continue;
            }

            _handleGamepadsButtonsInput(ID_CONTROLLER_ONE, buttonPos);
        }
    },

    _checkGamepad2Buttons  = function() {
        for (var buttonPos = 0; buttonPos < controller2.buttons.length; buttonPos++) {
            if (!_buttonPressed(controller2.buttons[buttonPos])) {
                _releaseGamepadsButtonsInput(ID_CONTROLLER_TWO, buttonPos);
                continue;
            }      

            _handleGamepadsButtonsInput(ID_CONTROLLER_TWO, buttonPos);
        }
    },

    _checkGamepad1StickAxes = function() {
        for (var axePos = 0; axePos < controller1.axes.length; axePos++) {
            _releaseSticksInput(ID_CONTROLLER_ONE, axePos);            
            _handleGamepadsSticksInput(ID_CONTROLLER_ONE, axePos);
        }
    },

    _checkGamepad2StickAxes = function() {
        for (axePos = 0; axePos < controller2.axes.length; axePos++) {
            _releaseSticksInput(ID_CONTROLLER_TWO, axePos);
            _handleGamepadsSticksInput(ID_CONTROLLER_TWO, axePos);
        }
    },

    _releaseSticksInput = function(id, position) {
        switch(position) {
            case XBOX_AXES.LEFT_STICK_X:
                if(id == ID_CONTROLLER_ONE) {
                    if(controller1ButtonsPressed.left_pressed == true) {
                        if(controller1.axes[position] >= -GAMEPAD_ANALOG_STICK_DEADZONE) {
                            _onKeyUp({keyCode:keyMap.p1Left});
                            controller1ButtonsPressed.left_pressed = false;
                        }                
                    }

                    if(controller1ButtonsPressed.right_pressed == true) {
                        if(controller1.axes[position] <= GAMEPAD_ANALOG_STICK_DEADZONE) {
                            _onKeyUp({keyCode:keyMap.p1Right});
                            controller1ButtonsPressed.right_pressed = false;
                        }
                    }
                } else if(id == ID_CONTROLLER_TWO) {
                    if(controller2ButtonsPressed.left_pressed == true && !isHeliActive) {
                        if(controller2.axes[position] >= -GAMEPAD_ANALOG_STICK_DEADZONE) {
                            _onKeyUp({keyCode:keyMap.p2Left});
                            controller2ButtonsPressed.left_pressed = false;
                        }
                    }

                    if(controller2ButtonsPressed.right_pressed == true && !isHeliActive) {
                        if(controller2.axes[position] <= GAMEPAD_ANALOG_STICK_DEADZONE) {
                            _onKeyUp({keyCode:keyMap.p2Right});
                            controller2ButtonsPressed.right_pressed = false;
                        }
                    }
                }
            break;

            case XBOX_AXES.LEFT_STICK_Y:
                if(id == ID_CONTROLLER_TWO) {
                    if(isSlingshot) {
                        if(controller2ButtonsPressed.x_pressed == true) {
                            if(controller2.axes[position] <= GAMEPAD_ANALOG_STICK_DEADZONE) {
                                _onKeyUp({keyCode:keyMap.p2Trigger});
                                controller2ButtonsPressed.x_pressed = false;
                            }
                        }

                        if(controller2ButtonsPressed.a_pressed == true) {
                            if(controller2.axes[position] >= -GAMEPAD_ANALOG_STICK_DEADZONE) {
                                _onKeyUp({keyCode:keyMap.p2Jump});
                                controller2ButtonsPressed.a_pressed = false;
                            }
                        }
                    }
                }
            break;
        }
        
    },  

    _handleGamepadsSticksInput = function(id, position) {
        switch (position) {
            case XBOX_AXES.LEFT_STICK_X:
                switch(id) {
                    case ID_CONTROLLER_ONE: 
                        if(controller1.axes[position] > GAMEPAD_ANALOG_STICK_DEADZONE) {
                            if(controller1ButtonsPressed.right_pressed == false) {
                                _onKeyDown({keyCode:keyMap.p1Right});
                                controller1ButtonsPressed.right_pressed = true;
                            }
                            
                        } else if(controller1.axes[position] < -GAMEPAD_ANALOG_STICK_DEADZONE) { 
                            if(controller1ButtonsPressed.left_pressed == false) {
                                _onKeyDown({keyCode:keyMap.p1Left});
                                controller1ButtonsPressed.left_pressed = true;
                            }
                        } 
                    break;

                    case ID_CONTROLLER_TWO: 
                       if(controller2.axes[position] > GAMEPAD_ANALOG_STICK_DEADZONE) {
                            if(controller2ButtonsPressed.right_pressed == false) {
                                _onKeyDown({keyCode:keyMap.p2Right});
                                controller2ButtonsPressed.right_pressed = true;
                            }
                            
                        } else if(controller2.axes[position] < -GAMEPAD_ANALOG_STICK_DEADZONE) { 
                            if(controller2ButtonsPressed.left_pressed == false) {
                                _onKeyDown({keyCode:keyMap.p2Left});
                                controller2ButtonsPressed.left_pressed = true;
                            }
                        }
                    break;
                }       
            break;

            case XBOX_AXES.LEFT_STICK_Y:
                if(id == ID_CONTROLLER_TWO) {
                    if(isSlingshot) {
                         if(controller2.axes[position] > GAMEPAD_ANALOG_STICK_DEADZONE) {   
                             if(controller2ButtonsPressed.x_pressed == false) {                         
                                _onKeyDown({keyCode:keyMap.p2Trigger});
                                controller2ButtonsPressed.x_pressed = true;
                            }
                        } else if(controller2.axes[position] < -GAMEPAD_ANALOG_STICK_DEADZONE) { 
                            if(controller2ButtonsPressed.a_pressed == false) {                         
                                _onKeyDown({keyCode:keyMap.p2Jump});
                                controller2ButtonsPressed.a_pressed = true;
                            }
                        } 
                    }
                }
            break;
        }
    },

    _releaseGamepadsButtonsInput = function(id, position) {
        switch(position) {
            case XBOX_BUTTONS.A:
                switch(id) {
                    case ID_CONTROLLER_ONE: 
                        if(controller1ButtonsPressed.a_pressed == true) {
                            _onKeyUp({keyCode:keyMap.p1Jump});
                            controller1ButtonsPressed.a_pressed = false;
                        }                        
                    break;

                    case ID_CONTROLLER_TWO: 
                        if(controller2ButtonsPressed.a_pressed == true) {
                            _onKeyUp({keyCode:keyMap.p2Jump});
                            controller2ButtonsPressed.a_pressed = false;
                        }                        
                    break;
                } 
            break;

            case XBOX_BUTTONS.X:
                switch(id) {
                    case ID_CONTROLLER_ONE: 
                        if(controller1ButtonsPressed.x_pressed == true) {
                            _onKeyUp({keyCode:keyMap.p1Trigger});
                            controller1ButtonsPressed.x_pressed = false;
                        }
                                                                    
                    break;

                    case ID_CONTROLLER_TWO: 
                        if(controller2ButtonsPressed.x_pressed == true) {
                            _onKeyUp({keyCode:keyMap.p2Trigger});
                            controller2ButtonsPressed.x_pressed = false;
                        }
                        
                    break;
                }
            break;

            case XBOX_BUTTONS.RB:
                if(id == ID_CONTROLLER_TWO && isHeliActive) {
                    if(controller2ButtonsPressed.right_pressed == true) {
                        _onKeyUp({keyCode:keyMap.p2Right});
                        controller2ButtonsPressed.right_pressed = false;
                    }                    
                }
            break;

            case XBOX_BUTTONS.LB:
                if(id == ID_CONTROLLER_TWO && isHeliActive) {
                    if(controller2ButtonsPressed.left_pressed == true) {
                        _onKeyUp({keyCode:keyMap.p2Left});
                        controller2ButtonsPressed.left_pressed = false;
                    }                    
                }
            break;
        }
    },

    _handleGamepadsButtonsInput = function(id, position) {
       switch (position) {
            case XBOX_BUTTONS.A:
                switch(id) {
                    case ID_CONTROLLER_ONE: 
                        if(controller1ButtonsPressed.a_pressed == false) {
                            _onKeyDown({keyCode:keyMap.p1Jump});
                            controller1ButtonsPressed.a_pressed = true;
                        }                        
                    break;

                    case ID_CONTROLLER_TWO: 
                        if(controller2ButtonsPressed.a_pressed == false) {
                            _onKeyDown({keyCode:keyMap.p2Jump});
                            controller2ButtonsPressed.a_pressed = true;
                        }                        
                    break;
                }
            break;

            case XBOX_BUTTONS.X:
                switch(id) {
                    case ID_CONTROLLER_ONE: 
                        if(controller1ButtonsPressed.x_pressed == false) {
                            _onKeyDown({keyCode:keyMap.p1Trigger});
                            controller1ButtonsPressed.x_pressed = true;
                        } 
                    break;

                    case ID_CONTROLLER_TWO:
                        if(controller2ButtonsPressed.x_pressed == false) {
                            _onKeyDown({keyCode:keyMap.p2Trigger});
                            controller2ButtonsPressed.x_pressed = true;
                        } 
                    break;
                }
            break;


            case XBOX_BUTTONS.RB:
                if(id == ID_CONTROLLER_TWO && isHeliActive) {
                    if(controller2ButtonsPressed.right_pressed == false) {
                        console.log("down mash right");
                        _onKeyDown({keyCode:keyMap.p2Right});
                        controller2ButtonsPressed.right_pressed = true;
                    }                    
                }
            break;

            case XBOX_BUTTONS.LB:
                if(id == ID_CONTROLLER_TWO && isHeliActive) {
                    if(controller2ButtonsPressed.left_pressed == false) {
                        console.log("down mash left");
                        _onKeyDown({keyCode:keyMap.p2Left});
                        controller2ButtonsPressed.left_pressed = true;
                    }
                }
                    
            break;
        }
    },

    _buttonPressed = function(button) {
        if (typeof(button) == "object") {
            return button.pressed;
        }

        return button > 0.5;
    },

    /*start movement left/right, trigger jump/trigger/special ability effects*/
    _onKeyDown = function(e) {
        switch(e.keyCode){
            case keyMap.p1Jump:
                $(that).trigger('p1ArrowUpStarted');                
            break;

            case keyMap.p1Left:
                $(that).trigger('p1ArrowLeftStarted');
            break;

            case keyMap.p1Right:
                $(that).trigger('p1ArrowRightStarted');
            break;

            case keyMap.p1Trigger:
                $(that).trigger('p1ArrowDownStarted');
            break;

            case keyMap.p2Jump:
                $(that).trigger('p2ArrowUpStarted');
            break;

            case keyMap.p2Left:
                if (isHeliActive && isLeftActiveButton) {
                    _trackMashingInput()
                } else {
                    $(that).trigger('p2ArrowLeftStarted');
                }
            break;

            case keyMap.p2Right:
                if (isHeliActive && isRightActiveButton) {
                   _trackMashingInput();
                } else {
                    $(that).trigger('p2ArrowRightStarted');
                }
            break;

            case keyMap.p2Trigger:
                $(that).trigger('p2ArrowDownStarted');
            break;

            case keyMap.pause:
                $(that).trigger('onPauseScreenRequested');
            break;
        }
    },

    _trackMashingInput = function() {
        $(that).trigger('p2ButtonMashEvent');
        
        isLeftActiveButton = !isLeftActiveButton;
        isRightActiveButton = !isRightActiveButton;
    },

    /*stopMovement left/right*/
    _onKeyUp = function(e) {
        switch(e.keyCode) {
            case keyMap.p1Jump:
                $(that).trigger('p1ArrowUpStopped');
            break;

            case keyMap.p1Left:
                $(that).trigger('p1ArrowLeftStopped');
            break;

            case keyMap.p1Right:
                $(that).trigger('p1ArrowRightStopped');
            break;

            case keyMap.p1Trigger:
                $(that).trigger('p1ArrowDownStopped');
            break;

            case keyMap.p2Jump:
                $(that).trigger('p2ArrowUpStopped');
            break;

            case keyMap.p2Left:
                $(that).trigger('p2ArrowLeftStopped');
            break;

            case keyMap.p2Right:
                $(that).trigger('p2ArrowRightStopped');
            break;

            case keyMap.p2Trigger:
                $(that).trigger('p2ArrowDownStopped');
            break;
        }
    };

    that.init = init;
    that.changeControls = changeControls;
    return that;
})();
