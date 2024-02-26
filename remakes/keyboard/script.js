//! alt gr = ctrl + r-alt, is normal behaviour.
// maybe some help with pressing down
// https://codepen.io/gschier/pen/VKgyaY?editors=1010

// keyboard event util
// https://www.toptal.com/developers/keycode

// bunch of id presets, needed for setupkeys()
const numberrowids = ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"]
const toprowids = ["BracketLeft", "BracketRight", "Backslash"];
const midrowendids = ["Semicolon", "Quote"];
const botrowendids = ["Comma", "Period", "Slash"];
const rows = [numberrowids, toprowids, midrowendids, botrowendids];

// all state keys from top to bottom, left to right
const keys = "0123456789öüóqwertzuiopőúűasdfghjkléáíyxcvbnm,.-";
const shiftkeys = "0'\"+!%/=()ÖÜÓQWERTZUIOPŐÚŰASDFGHJKLÉÁÍYXCVBNM:_?";
const altkeys = "0~ˇ^˘°˛`˙´˝¨¸\\|Ä®™ €Í  ÷×¤äđĐ[] íłŁ$ß<>#&@{} ;>*";
const capskeys = "0123456789ÖÜÓQWERTZUIOPŐÚŰASDFGHJKLÉÁÍYXCVBNM,.-";
const capsshiftkeys = "0'\"+!%/=()öüóqwertzuiopőúűasdfghjkléáíyxcvbnm:_?";

let generalkeys = [];

// sets up id's for all keys, so they can be styled and handled
// it only sets an id if the element does not have one. this basically means non-function keys, only keys that return text.
// the id is being set to a key from keys[], or if it has a special code, then it sets it to that.
// also creates an array with the keys, so they can be modified later
function setupKeys() {
    let keysindex = -1;
    let htmlrows = Array.from(document.getElementById('content').children);
    for(j = 0; j < 4; j++){
        e = htmlrows[j];
        currow = rows[j];
        // seems like a great resource for the rust / linq way in js
        // https://gist.github.com/DanDiplo/30528387da41332ff22b
        let list = Array.from(e.children).filter(f => f.id == "");

        let idlist = [];
        // for normal id keys
        for(i = 0; i < (list.length-currow.length); i++){
            keysindex++;
            if (keys[keysindex] == "z") {
                idlist.push(`KeyY`);
                // continue means skipping this iteration, and going to the next one
                continue;
            }
            if (keys[keysindex] == "y") {
                idlist.push(`KeyZ`);
                continue;
            }
            idlist.push(`Key${keys[keysindex].toUpperCase()}`);
        }

        // for 'í', because it is a special case in the front of the third row
        if (i == 3) idlist.splice(0, 1, "IntlBackslash");

        // for special id keys
        for(i = 0; i < currow.length; i++){
            keysindex++;
            idlist.push(currow[i]);
        }

        // setting ids
        list.forEach( e => {
            e.id = idlist.shift();
        });

        // setting a full array of modifiable keys for later
        generalkeys = generalkeys.concat(list);
    }

    // setting keys initially
    switchKeys("");
}

// checking keydowns and keyups
document.addEventListener('keydown', e => {
    if (!e.repeat) {
        if (e.code == "Tab" || e.code == "Digit1" || e.code == "Digit6") e.preventDefault();
        if (e.ctrlKey) e.preventDefault();
        // console.log(e.code + ' down')
        toggleKey(e, true);
    }
});
document.addEventListener('keyup', e => {
    // console.log(e.code + ' up');
    toggleKey(e, false);
});

// handling styling keypresses, and back to normal
// calls the output text handler, and on keyup, calls the switchKeys function
function toggleKey(e, down) {
    let checkCode = document.getElementById(e.code);
    // console.log(checkCode, e.code)
    if (checkCode !== null) {
            if (down) {
                document.getElementById(e.code).classList.add("pushed");
                handleText(e, "code");
            }
            else {
                document.getElementById(e.code).classList.remove("pushed");
                if (["ShiftLeft", "ShiftRight", "AltRight"].includes(e.code)) switchKeys(e.code);
            }

    }
}

// alt tabbing does not leave alt key in pushed style
// basically checking for leaving the document
// from here: https://developer.mozilla.org/en-US/docs/Web/API/Window/focus_event
document.addEventListener('blur', e => {
    Array.from(document.getElementById('content').children).forEach(e => {
        Array.from(e.children).forEach(f => {
            f.classList.remove("pushed");
        });
    });
});

let text = "";
// output handling, .keys and .codes
function handleText(event, mode) {
    if (mode == "code") {
        if (event.code == "Space") handleText(" ", "key");
        else if (event.code == "Backspace") {
            text = text.slice(0, -1);
        }
        else if (event.code == "Backquote") handleText("0", "key");
        else if (event.code == "Enter" || event.code == "Tab") {
            // checkCode(text); // secret codes will be checked later here
            text = "";
        }
        else if (["ShiftLeft", "ShiftRight", "AltRight", "CapsLock"].includes(event.code)) switchKeys(event.code);
        // skipping unused codes
        else if (["ControlLeft", "AltLeft", "ControlRight", "MetaLeft"].includes(event.code)) {}
        // if not a special case, then it is a key, so it will be output to the screen
        else {
            handleText(event.key, "key");
        }
    }
    if (mode == "key" && event != "Dead") {
        text = `${text}${event}`;
    }
    document.getElementById('output').innerHTML = text;
}

let isCaps = false;
let isAltGr = false;
let isShift = false;
let isShiftRight = false;
// switching between shifted, capslocked, ol altgred states & keys
function switchKeys(code) {
    // switches bools
    switch (code) {
        case "CapsLock":
            isCaps = !isCaps;
            break;
        case "AltRight":
            isAltGr = !isAltGr;
            break;
        case "ShiftLeft":
            isShift = !isShift;
            break;
            case "ShiftRight":
                isShiftRight = !isShiftRight;
                break;
    }


    // switches keys
    // it is set up in a hierarchical way, so the last one will be the one that is shown
    if (isCaps) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${capskeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if (isAltGr) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${altkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if (isShift || isShiftRight) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${shiftkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if (isCaps && (isShift || isShiftRight)) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${capsshiftkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if ((!isShift && !isAltGr && !isCaps && !isShiftRight) || code == "") {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${keys[generalkeys.indexOf(e)]}</p>`;
        });
    }

    // this is cool af
    // let object = {
    //     isAltGr, isShift, isCaps, isShiftRight
    // }
    // console.table(object);
}

// start the site
setupKeys();

// needed for the apple special key layout
// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
if (navigator.userAgent.includes("Iphone") || navigator.userAgent.includes("Mac OS")) {
    alert("nagyon apple");
}

// phone detection, for handling touch and mouse events right
let isMobile = false;
if (navigator.userAgent.includes("Android") || navigator.userAgent.includes("Iphone")) {
    isMobile = true;
}

let mouseDownKeys = [];
let switchOnMobile = false;
// mouse and touch event handling
["mousedown", "touchstart"].forEach(t => {
    document.getElementById("content").addEventListener(t, e => {
        //! sometimes touchstart doesn't trigger on mobile????
        //! also special keys are broken on mobile
        // on default, both triggers on mobile. thats why whe have a switch, to only have it true on one of them
        if (isMobile) switchOnMobile = !switchOnMobile;
        let target = e.target;
        if (target.tagName == "P") target = target.parentElement;
        if (!target.classList.contains("row") && target.id != "content" && !target.classList.contains("sys")) {
            mouseDownKeys.push(target);
            // this is the check we use to only trigger on one of the events
            if (!isMobile || switchOnMobile) toggleKey({code: target.id, key: target.children[0].innerText}, true);
        }
    });
});

// adding the same code for two event listeners is fine like this, but i kinda hate it
// https://www.tutorialspoint.com/How-to-add-many-Event-Handlers-to-the-same-element-with-JavaScript-HTML-DOM
["mouseup", "touchend"].forEach(t => {
    document.getElementById("content").addEventListener(t, e => {
        mouseDownKeys.forEach(e => {
            //! touchlist object is interesting
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event
            // touchend event refers to touchlist on .changedTouches .targetTouches .touches
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event
            let target = mouseDownKeys.shift();
            // tought i could fire a keyboard event, but you can only fire mouse events???? sure whatever
            // https://stackoverflow.com/questions/21354060/how-to-fire-keyboard-events-in-javascript
            // luckily its literally just a call function, so im happy with myself for thinking ahead
            toggleKey({code: target.id, key: target.children[0].innerText}, false);
        });
    });
});