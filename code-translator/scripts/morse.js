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

// get wordlist, and after that, start the site
let wordlist;
getWords().then(words => {
    wordlist = words.split("\n");
    currword = getWord();
    displayWord();
});

// handling fetching the wordlist
function getWords() {
    return new Promise((resolve, reject) => {
        // this wordlist is from https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/
        fetch('words.txt')
            .then(response => response.text())
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
};

let currword = "";
// getting a word from the wordlist
function getWord() {
    let randomInt = Math.floor(Math.random() * wordlist.length);
    return wordlist[randomInt-1];
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
            addChar("←");
            break;
    }
});

// adding morse code . or -; and deleting characters
let characters = "";
function addChar(char) {
    if (currword.length == userword.length) {return;}
    if (char == "←") {
        characters = characters.slice(0, -1);
    } else { 
        if (characters.length == 5) {
            characters = characters.slice(0, -1);
        }
        characters = `${characters}${char}`;
    }

    displayMorse();
}

// sending morse code feedback
function displayMorse() {
    for (let i = 0; i < 5; i++) {
        inputfeedback.children[i].innerText = typeof(characters[i]) != "undefined" ? characters[i] : "";
    }
}

let userword = "";
let endOfWord = false;
// confirming morse code to a character
// also is the function that handles next word
function confirmChar() {
    if (userword.length == currword.length) endOfWord = true;
    if (!endOfWord) {
        let char = "";
        Object.keys(code).forEach(key => {
            if (code[key] == characters) {
                char = key;
            }
        });
        characters = "";
        userword = `${userword}${char}`;
    } else {
        endOfWord = false;
        currword = getWord();
        userword = "";
    }
    displayMorse();
    displayWord();
}

// sending word feedback
function displayWord() {
    //? do we keep the colors here? or move it elsewhere?
    document.getElementById("word").innerHTML = "";
    for (let i = 0; i < userword.length; i++) {
        let node = document.createElement("span");
        node.innerText = userword[i];
        node.classList.add(userword[i] != currword[i] ? "red" : "green");
        // kind of from this answer https://stackoverflow.com/a/42528274/12706133
        document.getElementById("word").appendChild(node);
    }

    let node = document.createElement("span");
    node.innerText = userword.length != currword.length ? currword[userword.length] : "";
    node.classList.add("highlight");
    document.getElementById("word").appendChild(node);

    let node2 = document.createElement("span");
    node2.innerText = currword.slice(userword.length+1);
    document.getElementById("word").appendChild(node2);
}