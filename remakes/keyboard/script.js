//! alt gr = ctrl + r-alt, is normal behaviour.
// maybe some help with pressing down
// https://codepen.io/gschier/pen/VKgyaY?editors=1010

// keyboard event util
// https://www.toptal.com/developers/keycode

// sets up id's for all keys, so they can be styled and handled
// it only sets an id if the element does not have one.
// the id is being set to the text of the key
function setupKeys() {
    Array.from(document.getElementById('content').children).forEach(e => {
        Array.from(e.children).forEach(f => {
            if (f.id == "") {
                let key = f.textContent;
                f.id = key;
            }
        });
    });
}

// checking keydowns and keyups
document.addEventListener('keydown', e => {
    if (!e.repeat) {
        if (e.code == "Tab" || e.code == "Digit1" || e.code == "Digit6") e.preventDefault();
        console.log(e.code + ' down');
        toggleKey(e, true);
    }
});
document.addEventListener('keyup', e => {
    console.log(e.code + ' up');
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
            else document.getElementById(e.code).classList.remove("pushed");
    }
    else {
        let checkKey = document.getElementById(e.key.toLowerCase());
        if (checkKey !== null) {
            if (down) {
                document.getElementById(e.key.toLowerCase()).classList.add("pushed");
                handleText(e.key, "key");
            }
            else document.getElementById(e.key.toLowerCase()).classList.remove("pushed");
        }
        else {
            // console.log(e.code + " not found");
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
// output handling, .keys and .codes
function handleText(event, mode) {
    if (mode == "code") {
        if (event.code == "Space") handleText(" ", "key");
        if (event.code.includes("Digit")) {
            handleText(event.code[5], "key");
        }
        if (event.code == "Backspace") {
            text = text.slice(0, -1);
        }
        if (event.code == "Backquote") handleText("0", "key");
        if (event.code == "Enter") {
            // checkCode(text); // secret codes will be checked later here
            text = "";
        }
        if (["Comma", "Period", "Slash"].includes(event.code)) {
            handleText(event.key, "key");
        }
    }
    if (mode == "key") {
        text = `${text}${event}`;
    }
    document.getElementById('output').innerHTML = text;
}

// start the site
setupKeys();