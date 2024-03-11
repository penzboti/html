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
// they are 'let' instead of 'const' because they change on apple devices
let keys = "0123456789öüóqwertzuiopőúűasdfghjkléáíyxcvbnm,.-";
let shiftkeys = "0'\"+!%/=()ÖÜÓQWERTZUIOPŐÚŰASDFGHJKLÉÁÍYXCVBNM:_?";
let altkeys = "0~ˇ^˘°˛`˙´˝¨¸\\|Ä®™ €Í  ÷×¤äđĐ[] íłŁ$ß<>#&@{} ;>*";
let capskeys = "0123456789ÖÜÓQWERTZUIOPŐÚŰASDFGHJKLÉÁÍYXCVBNM,.-";
let capsshiftkeys = "0'\"+!%/=()öüóqwertzuiopőúűasdfghjkléáíyxcvbnm:_?";

let generalkeys = [];

// sets up id's for all keys, so they can be styled and handled
// it only sets an id if the element does not have one. this basically means non-function keys, only keys that return text.
// the id is being set to a key from keys[], or if it has a special code, then it sets it to that.
// also creates an array with the keys, so they can be modified later
function setupKeys() {
    let keysindex = -1;
    let htmlrows = Array.from(content.children);
    for(i = 0; i < 4; i++){
        e = htmlrows[i];
        currow = rows[i];
        // seems like a great resource for the rust / linq way in js
        // https://gist.github.com/DanDiplo/30528387da41332ff22b
        let list = Array.from(e.children).filter(f => f.id == "");

        let idlist = [];
        // for normal id keys
        for(j = 0; j < (list.length-currow.length); j++){
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
        for(j = 0; j < currow.length; j++){
            keysindex++;
            idlist.push(currow[j]);
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
                if (["ShiftLeft", "ShiftRight", "AltRight", "AltLeft"].includes(e.code)) switchKeys(e.code);
                // capslock is toggled in the firmware, we don't need to handle it differently
                if (isApple && e.code == "CapsLock") switchKeys(e.code);
            }

    }
}

// alt tabbing does not leave alt key in pushed style
// basically checking for leaving the document
// from here: https://developer.mozilla.org/en-US/docs/Web/API/Window/focus_event
document.addEventListener('blur', e => {
    Array.from(content.children).forEach(e => {
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
        else if (event.code == "Enter" || event.code == "Tab") {
            // checkCode(text); // secret codes will be checked later here
            text = "";
        }
        else if (["ShiftLeft", "ShiftRight", "AltRight", "CapsLock"].includes(event.code)) switchKeys(event.code);
        else if (isApple && ["AltLeft", "MetaLeft", "MetaRight"].includes(event.code)) switchKeys(event.code);
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
    output.innerHTML = text;
}

let isCaps = false, isAltGr = false, isShift = false, isShiftRight = false;
// the only apple one
let isOption = false;
// switching between shifted, capslocked, ol altgred states & keys
function switchKeys(code) {
    
    //  switches bools
    if (!isApple) {
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
    } else {
        //! apple mode
        switch (code) {
            case "CapsLock":
                isCaps = !isCaps;
                break;
            case "ShiftLeft":
                isShift = !isShift;
                break;
            case "ShiftRight":
                isShiftRight = !isShiftRight;
                break;
            // case OH
            case "AltLeft":
                isOption = !isOption;
                break;
            case "AltRight":
                isAltGr = !isAltGr;
                break;
        }
    }


    // switches keys
    // it is set up in a hierarchical way, so the last one will be the one that is shown
    if (isCaps) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${capskeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if (isAltGr || isOption) {
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
    if (isApple && (isOption || isAltGr) && (isShift || isShiftRight)) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${altshiftkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    if ((!isShift && !isAltGr && !isCaps && !isShiftRight && !isOption) || code == "") {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${keys[generalkeys.indexOf(e)]}</p>`;
        });
    }

    // this is cool af
    // let object = {
    //     isAltGr, isShift, isCaps, isShiftRight, isOption
    // }
    // console.table(object);
}

let isApple = true;
const altshiftkeys = "•ŕŘ#$řŖŗ™}°īĪļŁš®śŹ†ťĮłÝýĄżŽžŪÕÔ&ŮōˇĢŔ<>©‚’Ųų*÷—";
// needed for the apple special key layout
// https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
if (navigator.userAgent.includes("Iphone") || navigator.userAgent.includes("Mac OS")) {
    // some of the sysrow keys are switched, aswell as new keyboard combinations
    let list = Array.from((Array.from(content.children))[4].children);
    list[0].innerHTML = "<p>Fn</p>"; list[0].classList.add("sys"); list[0].id = "FnLeft";
    list[1].innerHTML = "<p>^</p>"; list[1].classList.remove("sys"); list[1].id = "ControlLeft";
    list[2].innerHTML = "<p>⌥</p>"; list[2].id = "AltLeft";
    list[3].innerHTML = "<p>⌘</p>"; list[3].id = "MetaLeft";
    list[5].innerHTML = "<p>⌘</p>"; list[5].id = "MetaRight";
    list[6].innerHTML = "<p>⌥</p>"; list[6].classList.remove("sys"); list[6].id = "AltRight";
    list[7].innerHTML = ""; list[7].classList.add("sys"); list[7].id = "undefined";
    // special key layouts are different
    shiftkeys = '§' + shiftkeys.substring(1);
    altkeys = "¬&™£$‹›{[]}\\≠@ę€¶†ź¨^ŅĻ¨~`ąß∂ń©ķ∆Ż•…^|«»ć„”~Ķ–;–";
    
    setupKeys();
    // these two are switched on apple for some reason, hopefully this fixes the issue
    generalkeys[0].id = "IntlBackslash";
    generalkeys[37].id = "Backquote";
}

// this useragentdata is only built-in in some browsers, (firefox does not have it, and also safari so now it does not have the apple detection feature i wanted to use it for but whatever)
// and also secure context (https) is required
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
// if (typeof(navigator.userAgentData) != "undefined") alert(navigator.userAgentData.platform);

// phone detection, for handling touch and mouse events right
let isMobile = false;
if (navigator.userAgent.includes("Android") || navigator.userAgent.includes("Iphone")) isMobile = true;
// https://stackoverflow.com/a/11381730/12706133 - found it first here, but i didn't want to use regex
if (typeof(navigator.userAgentData) != "undefined") isMobile = navigator.userAgentData.mobile;

// mouse and touch event handling
let mouseDownKeys = [];
// we have a down event list here. if it is mobile, then we remove the first event, because a mouse event also triggers on touch. i kinda get why its there, but its just a bit of a pain here.
// but if we're on desktop, touch never happens so we can just leave it.
// we also do this on the up events
let downevents = ["mousedown", "touchstart"];
if (isMobile) downevents.splice(0, 1);
// adding the same code for two event listeners is fine like this, but i kinda hate it
// https://www.tutorialspoint.com/How-to-add-many-Event-Handlers-to-the-same-element-with-JavaScript-HTML-DOM
downevents.forEach(t => {
    // got a 'violation here'. and a link with it: https://chromestatus.com/feature/5745543795965952
    // [Violation] Added non-passive event listener to a scroll-blocking 'touchstart' event. Consider marking event handler as 'passive' to make the page more responsive.
    content.addEventListener(t, e => {
        let target = e.target;
        if (target.tagName == "P") target = target.parentElement;
        if (isMobile) console.log("down", e, target);
        if (!target.classList.contains("row") && target.id != "content" && !target.classList.contains("sys")) {
            mouseDownKeys.push(target);
            toggleKey({code: target.id, key: target.children[0].innerText}, true);
        }
    });
});

// there is a custom user agent setting in crome dev tools, so i was able to test mobile events on desktop
// touch upevents have a target that is the original down element, so on mobile this works. 
// on desktop with mouse movement, the target changes to where the mouse upevent was triggered.
// but the original array idea works, since only one mouse cursor
// so now im separating the two
if (isMobile) {
    document.addEventListener("touchend", e => {
        let target = e.target;
        if (target.tagName == "P") target = target.parentElement;
        // tought i could fire a keyboard event, but you can only fire mouse events???? sure whatever
        // https://stackoverflow.com/questions/21354060/how-to-fire-keyboard-events-in-javascript
        // luckily its literally just a call function, so im happy with myself for thinking ahead
        toggleKey({code: target.id, key: target.children[0].innerText}, false);
        // there is an issue when sometimes chrome doesn't fire touchend events
        // i found out using this cool debugging tool, just wanted to show it off
        // i phisically can't fix this tho
        // https://developer.chrome.com/docs/devtools/remote-debugging/
        // https://stackoverflow.com/questions/37256331/is-it-possible-to-open-developer-tools-console-in-chrome-on-android-phone
    });
} else {
    content.addEventListener("mouseup", e => {
        let target = mouseDownKeys.shift();
        toggleKey({code: target.id, key: target.children[0].innerText}, false);
    });
}
// now the only people left out should be the ones with a touchscreen and a mouse, idk if i want to support them or not

// start the site
setupKeys();