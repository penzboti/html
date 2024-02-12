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
    
let characters = "";
// adds a character
function addChar(char) {
    // if (currword.length <= userword.length) {return;}
    if (characters.length != 8) characters = `${characters}${char}`;

    displayBinary();
}

// deletes a character
function delChar() {
    characters = characters.slice(0, -1);

    displayBinary();
}

let answerPhase = false;
// confirms the number and displays answer to the user
function confirmNum() {
    if (!answerPhase) {
        let n = parseInt(characters, 2);
        if (n == currN) {
            baseSequence.classList.add("green");
        } else {
            baseSequence.innerHTML = `${currN}≠<span class="red">${n}</span>`;
        }
    }
    else {
        baseSequence.classList.remove("green");
        newCode();
    }
    answerPhase = !answerPhase;
}

currN = "";
// generates a new binary code
function newCode() {
    characters = "";
    currN = Math.floor(Math.random() * 256);
    // let currCode = n.toString(2).padEnd(8, "0");
    baseSequence.innerText = currN;
    displayBinary();
}

// displays the binary code
function displayBinary() {
    for (let i = 0; i <= 7; i++) {
        codeSequence.children[i].innerText = typeof(characters[i]) != "undefined" ? characters[i] : " ";
    }
}

// start the site
newCode();