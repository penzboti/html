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

// next update sneak peek
const keys = "0123456789öüóqwertzuiopőúűasdfghjkléáíyxcvbnm,.-";
const shiftkeys = "§'\"+!%/=()ÖÜÓQWERTZUIOPŐÚŰASDFGHJKLÉÁÍYXCVBNM:_?";
const altkeys = " ~ˇ^˘°˛`˙´˝¨¸\\|Ä®™ €Í  ÷×¤äđĐ[] íłŁ$ß<>#&@{} ;>*"

let generalkeys = [];

// sets up id's for all keys, so they can be styled and handled
// it only sets an id if the element does not have one. this basically means non-function keys, only keys that return text.
// the id is being set to the text of the key, or if it has a special code, then it sets it to that.
function setupKeys() {
    let row = 0;
    Array.from(document.getElementById('content').children).forEach(e => {
        if (!e.classList.contains("sysrow")) {
            currow = rows[row];
            // seems like a great resource for the rust / linq way
            // https://gist.github.com/DanDiplo/30528387da41332ff22b
            let list = Array.from(e.children).filter(f => f.id == "");
            let idlist = [];
            for(i = 0; i < (list.length-currow.length); i++){
                if (list[i].innerText == "z") {
                    idlist.push(`KeyY`);
                    continue;
                }
                if (list[i].innerText == "y") {
                    idlist.push(`KeyZ`);
                    continue;
                }
                idlist.push(`Key${list[i].innerText.toUpperCase()}`);
            }
            if (row == 3) idlist.splice(0, 1, "IntlBackslash");
            for(i = 0; i < currow.length; i++){
                idlist.push(currow[i]);
            }
            list.forEach( e => {
                e.id = idlist.shift();
            });
            // for modifying later
            generalkeys = generalkeys.concat(list);
        }

        row++;
    });

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
// it does separate .keys and .codes, because the id's have been setup that way
function toggleKey(e, down) {
    let checkCode = document.getElementById(e.code);
    if (checkCode !== null) {
            if (down) {
                document.getElementById(e.code).classList.add("pushed");
                handleText(e, "code");
            }
            else {
                document.getElementById(e.code).classList.remove("pushed");
                if (e.code == "ShiftLeft" || e.code == "AltRight" || e.code == "CapsLock") {
                    switch (e.code) {
                        case "ShiftLeft":
                            isShift = false;
                            break;
                        case "AltRight":
                            isAltGr = false;
                            break;
                    }
                    if (isCaps || isShift) switchKeys("ShiftLeft");
                    else if (isAltGr) switchKeys("AltRight");
                    else {
                        switchKeys("");
                    }
                }
            }

    }
}

// alt tabbing does not leave alt key in pushed style
// basically checking for leaving the document
document.addEventListener('blur', e => {
    Array.from(document.getElementById('content').children).forEach(e => {
        Array.from(e.children).forEach(f => {
            f.classList.remove("pushed");
        });
    });
});

let text = "";
let isShift = false;
let isCaps = false;
let isAltGr = false;
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
        // else if (event.code == "CapsLock") {
        //     isCaps = !isCaps;
        //     if (isCaps) {
        //         switchKeys("ShiftLeft");
        //     } else {
        //         switchKeys("");
        //     }
        // }
        else if (event.code == "ShiftLeft") {
            isShift = true;
            if (isCaps) switchKeys("");
            else switchKeys(event.code);
        }
        else if (event.code == "AltRight") {
            isAltGr = true;
            switchKeys(event.code);
        }
        // skipping unused codes
        else if (["ControlLeft", "AltLeft", "ShiftRight", "CapsLock", "AltRight", "ControlRight", "MetaLeft"].includes(event.code)) {}
        else {
            handleText(event.key, "key");
        }
    }
    if (mode == "key" && event != "Dead") {
        text = `${text}${event}`;
    }
    document.getElementById('output').innerHTML = text;
}

// hierarchy:
// 1. shift
// 2. alt gr
// 3. caps
// caps + shift = normal
// alt gr + shift = shift
// altgr + caps = altgr
function switchKeys(code) {
    if (code == "ShiftLeft" || isShift) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${shiftkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    else if (code == "AltRight" && !isShift) {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${altkeys[generalkeys.indexOf(e)]}</p>`;
        });
    }
    else {
        generalkeys.forEach(e => {
            e.innerHTML = `<p>${keys[generalkeys.indexOf(e)]}</p>`;
        });
    }
}

// start the site
setupKeys();