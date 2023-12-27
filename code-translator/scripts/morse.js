const code = {
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
}
// https://api-ninjas.com/api/randomword
//? get the definiton of the word you gotten, because it gives you interesting words
// https://api-ninjas.com/api/dictionary
let req = new Request("https://api.api-ninjas.com/v1/randomword", {
    method: "GET",
    headers: {
        'X-Api-Key': apiNinjaKey,
    },
});

function getWord() {
    return new Promise((resolve, reject) => {
        fetch(req)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                resolve(data.word);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}

let currword = "";
let nextword = "";
// gets both words if nextword is empty, but only gets nextword if it isn't
function HandleWords() {
    if (nextword == "") {
        getWord().then(word => {
            nextword = word;
            document.getElementById("word").innerHTML = word;
        });
    }
    currword = nextword;
    document.getElementById("word").innerHTML = currword;
    getWord().then(word => {
        nextword = word;
        gettingWordsInProgress = false;
    });
}

// keybord input
document.addEventListener("keydown", e => {
    switch(e.key) {
        case " ":
            confirmChar();
            break;
        case ".":
            addChar(".");
            break;
        case "-":
            addChar("-");
            break;
        case "Backspace":
            addChar("Del");
            break;
    }
});

// adding morse code . or -
let characters = "";
function addChar(char) {
    if (char == "Del") {
        characters = characters.slice(0, -1);
    } else {
        characters = `${characters}${char}`;
    }
    if (characters.length > 0) {
        sendCharFeedback();
    } else {
        sendWordFeedback();
    }
}

// sending morse code feedback
function sendCharFeedback() {
    inputfeedback.innerHTML = "";
    for (let i = 0; i < characters.length; i++) {
        let node = document.createElement("span");
        node.innerText = characters[i];
        inputfeedback.appendChild(node);
    }
    let node = document.createElement("span");
    node.innerText = "|";
    node.classList.add("highlight");
    inputfeedback.appendChild(node);
}

let userword = "";
//TODO: next word switching is kind of clunky still
let endOfWord = false;
let gettingWordsInProgress = false;
// confirming morse code to a character
// also is the function that handles next word
function confirmChar() {
    if (userword.length == currword.length) {endOfWord = true;}
    if (!endOfWord && !gettingWordsInProgress) {
        let char = "";
        Object.keys(code).forEach(key => {
            if (code[key] == characters) {
                char = key;
            }
        });
        characters = "";
        userword = `${userword}${char}`;
        sendWordFeedback();
    } else {
        gettingWordsInProgress = true;
        HandleWords();
        endOfWord = false;
        userword = "";
        sendWordFeedback();
    }
}

// sending word feedback
function sendWordFeedback() {
    inputfeedback.innerHTML = "";
    for (let i = 0; i < userword.length; i++) {
        let node = document.createElement("span");
        node.innerText = userword[i];
        if (userword[i] != currword[i]) {
            node.classList.add("red");
        } else {
            node.classList.add("green");
        }
        inputfeedback.appendChild(node);
    }
    for (let i = userword.length; i < currword.length; i++) {
        let node = document.createElement("span");
        node.innerText = currword[i];
        if (i == userword.length) {
            node.classList.add("highlight");
        }
        inputfeedback.appendChild(node);
    }
}

// initializing words
// HandleWords();
currword = "hello";
document.getElementById("word").innerHTML = currword;
nextword = "world";

// starting initial feedback
sendWordFeedback();