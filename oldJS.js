var numpad = {
    //CREATE NUMPAD HTML
    hwrap: null, // numpad wrapper container
    hpad: null, // numpad itself
    hdisplay: null, // number display
    hbwrap: null, // buttons wrapper
    hbuttons: {}, // individual buttons
    init: function () {
        // WRAPPER
        numpad.hwrap = document.createElement("div");
        numpad.hwrap.id = "numWrap";

        //ENTIRE NUMPAD ITSELF
        numpad.hpad = document.createElement("div");
        numpad.hpad.id = "numPad";
        numpad.hwrap.appendChild(numpad.hpad);

        //DISPLAY
        numpad.hdisplay = document.createElement("input");
        numpad.hdisplay.id = "numDisplay";
        numpad.hdisplay.type = "text";
        numpad.hdisplay.disabled = true;
        numpad.hdisplay.value = "0";
        numpad.hpad.appendChild(numpad.hdisplay);

        //NUMBER BUTTONS
        numpad.hbwrap = document.createElement("div");
        numpad.hbwrap.id = "numBWrap";
        numpad.hpad.appendChild(numpad.hbwrap);

        //BUTTONS
        function buttonator(txt, css, fn) {
            let button = document.createElement("div");
            button.innerHTML = txt;
            button.classList.add(css);
            button.onclick = fn;
            numpad.hbwrap.appendChild(button);
            numpad.hbuttons[txt] = button;
        };

        // 7 TO 9
        for (let i = 7; i <= 9; i++) {
            buttonator(i, "num", function () {
                numpad.digit(i);
            });
        }
        // BACKSPACE
        buttonator("&#10502;", "del", numpad.delete);
        // 4 TO 6
        for (let i = 4; i <= 6; i++) {
            buttonator(i, "num", function () {
                numpad.digit(i);
            });
        }
        // CLEAR
        buttonator("C", "clr", numpad.reset);
        // 1 to 3
        for (let i = 1; i <= 3; i++) {
            buttonator(i, "num", function () {
                numpad.digit(i);
            });
        }
        // CANCEL
        buttonator("X", "cx", function () {
            numpad.hide(1);
        });
        // 0
        buttonator(0, "zero", function () {
            numpad.digit(0);
        });

        // OK
        buttonator("Done", "ok", numpad.select);

        //ATTACH NUMPAD TO HTML BODY
        document.body.appendChild(numpad.hwrap);
    },

    //BUTTON ACTIONS
    //CURRENTLY SELECTED FIELD + MAX LIMIT
    nowTarget: null, // Current selected input field
    nowMax: 0, // Current max allowed digits

    //NUMBER (0 TO 9)
    digit: function (num) {
        let current = numpad.hdisplay.value;
        if (current.length < numpad.nowMax) {
            if (current == "0") { numpad.hdisplay.value = num; }
            else { numpad.hdisplay.value += num; }
        }
    },

    //BACKSPACE
    delete: function () {
        var length = numpad.hdisplay.value.length;
        if (length == 1) { numpad.hdisplay.value = 0; }
        else { numpad.hdisplay.value = numpad.hdisplay.value.substring(0, length - 1); }
    },

    //CLEAR ALL
    reset: function () {
        numpad.hdisplay.value = "0";
    },

    //OK - SET VALUE
    select: function () {
        numpad.nowTarget.value = numpad.hdisplay.value;
        numpad.hide();

        var event;
        if (typeof (Event) === 'function') {
            event = new Event('submit');
        } else {
            event = document.createEvent('Event');
            event.initEvent('submit', true, true);
        }
        // numpad.nowTarget.dispatchEvent(new Event("numpadok"));
    },

    //ATTACH NUMPAD TO INPUT FIELD
    attach: function (opt) {
        // OPTIONS
        //  target: required, target field.
        //  max: optional, maximum number of characters. Default 255.
        //  onselect: optional, function to call after selecting number.
        //  oncancel: optional, function to call after canceling.

        //DEFAULT OPTIONS
        if (opt.max === undefined) { opt.max = 255; }


        //GET + SET TARGET OPTIONS
        opt.target.readOnly = true; // PREVENT ONSCREEN KEYBOARD
        opt.target.dataset.max = opt.max;

        opt.target.addEventListener("click", function () {
            numpad.show(opt.target);
        });

        //ATTACH CUSTOM LISTENERS
        if (opt.onselect) {
            opt.target.addEventListener("numpadok", opt.onselect);
        }
        if (opt.oncancel) {
            opt.target.addEventListener("numpadcx", opt.oncancel);
        }
    },

    //SHOW NUMPAD
    show: function (target) {
        //SET CURRENT DISPLAY VALUE
        let cv = target.value;
        if (cv == "") { cv = "0"; }
        numpad.hdisplay.value = cv;

        //SET MAX ALLOWED CHARACTERS
        numpad.nowMax = target.dataset.max;

        //SET CURRENT TARGET
        numpad.nowTarget = target;

        //SHOW NUMPAD
        numpad.hwrap.classList.add("open");
    },

    //HIDE NUMPAD
    hide: function (manual) {
        if (manual) {
            var event;
            if (typeof (Event) === 'function') {
                event = new Event('submit');
            } else {
                event = document.createEvent('Event');
                event.initEvent('submit', true, true);
            }

            // numpad.nowTarget.dispatchEvent(new Event("numpadcx"));
        }
        numpad.hwrap.classList.remove("open");
    }
};
window.addEventListener("DOMContentLoaded", numpad.init);










