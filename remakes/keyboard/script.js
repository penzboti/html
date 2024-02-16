//! alt gr = ctrl + r-alt, is normal behaviour.
// maybe some help with pressing down
// https://codepen.io/gschier/pen/VKgyaY?editors=1010

// keyboard event util
// https://www.toptal.com/developers/keycode

function setupKeys() {
    Array.from(document.getElementById('content').children).forEach(e => {
        Array.from(e.children).forEach(f => {
            if (f.id != "") console.log(f.id);
            else {
                let key = f.textContent;
                f.id = key;
                console.log(f.id);
            }
        });
    });
}

document.addEventListener('keydown', e => {
    // console.log(e.code + ' down');
    if (e.code == "Tab" || e.code == "Digit1" || e.code == "Digit6") e.preventDefault();
    toggleKey(e, true);
});

document.addEventListener('keyup', e => {
    // console.log(e.code + ' up');
    e.preventDefault();
    toggleKey(e, false);
});

function toggleKey(e, down) {
    let checkCode = document.getElementById(e.code);
    if (checkCode !== null) document.getElementById(e.code).classList.toggle("pushed");
    else {
        let checkKey = document.getElementById(e.key.toLowerCase());
        if (checkKey !== null) {
            if (down) document.getElementById(e.key.toLowerCase()).classList.add("pushed");
            else document.getElementById(e.key.toLowerCase()).classList.remove("pushed");
        }
        else {
            console.log(e.code + " not found");
        }
    }
}

// alt tabbing does not leave alt key in pushed style
document.addEventListener('blur', e => {
    Array.from(document.getElementById('content').children).forEach(e => {
        Array.from(e.children).forEach(f => {
            f.classList.remove("pushed");
        });
    });
});

setupKeys();