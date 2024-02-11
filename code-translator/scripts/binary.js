// keybord input
document.addEventListener("keydown", e => {
    switch(e.key) {
        case " ":
            confirmNum();
            break;
        case "0":
            addChar("0");
            break;
        case "1":
            addChar("1");
            break;
        case "Backspace":
            delChar();
            break;
    }
});

currCode = "";
function newCode() {
    characters = "";
    let n = Math.floor(Math.random() * 256);
    currCode = n.toString(2).padEnd(8, "0");
    displayBinary();
}

function displayBinary() {
    for (let i = 0; i <= 7; i++) {
        codeSequence.children[i].innerText = typeof(characters[i]) != "undefined" ? characters[i] : " ";
    }
}

let characters = "";
function addChar(char) {
    // if (currword.length <= userword.length) {return;}
    if (characters.length != 8) characters = `${characters}${char}`;

    displayBinary();
}

function delChar() {
    characters = characters.slice(0, -1);

    displayBinary();
}

function confirmNum() {
    console.log(parseInt(characters, 2));
}

newCode();