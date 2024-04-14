// assigning basic variables
var possible = [];
var possible_split = [];
let lang = "eng";
document.getElementById("lang").value = lang;

document.addEventListener("click", e => {
    if (e.target.tagName == "OPTION") {
        lang = e.target.value;
        start();
    }
});

function start() {
    // this runs at the start, and at every restart
    // resets inputs, divs, and "won"

    document.getElementById("words").innerHTML = "";
    document.getElementById("guess").value = "";
    document.getElementById("feedback").innerHTML = "";
    feedback = ["w", "w", "w", "w", "w"]
    won = false;

    let words_split0 = "";
    switch (lang) {
        case "hu":
            words_split0 = huwords;
            break;
        case "eng":
            words_split0 = engwords;
            break;
    }

    // resets possible words too
    possible = [];
    var words_split1;
    words_split1 = words_split0.split(", ");
    words_split1.forEach(element => {
        possible.push(element);
    });
}


var won;
function guessWord() {
    // only runs if the lettercount is 5

    if (document.getElementById("guess").value.length == 5) {
    
    // console.log(possible, 1);
    wordEliminator();
    // this is an async function because these need to be run after wordEliminator();
    // ? why does this work when the function isnt async?
    if (!possible.length == 0) {
        if (!won){
            possible.forEach(element => {
                addPossibleWord(element);
            });
        }
    } else {
        // if no words, tells no words
        addPossibleWord("Nincs több helyes szó!", false)
    }
    // console.log(possible, 2);
    
    }
}

var guess;
var guess_split;
let feedback = [];
function wordEliminator() {
    // eliminates words by the wordle rules

    // resets the input for next guess
    document.getElementById("guess").value = "";
    // also resets possible words
    document.getElementById("words").innerHTML = "";

    // splits every word in the possible array to charachters
    possible_split = [];
    possible.forEach(element => {
        words_split2 = element.split("");
        possible_split.push(words_split2);
    });

    // eliminates the words.
    for(w=possible.length-1; 0<=w; w--) {
        for(i=0; i<5; i++) {
            // explaining everything here is hard, so ill just skip it
            if(feedback[i] == "w" && possible[w].includes(guess_split[i])) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
            else if(feedback[i] == "g" && guess_split[i] !== possible_split[w][i]) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
            else if(feedback[i] == "y" && !possible[w].includes(guess_split[i])) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }

            else if(feedback[i] == "y" && guess_split[i] == possible_split[w][i]) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
        }
    } 

    // if feedback is all green, it tells you, you won
    if (feedback.every((val, i, arr) => val === "g")) {
        addPossibleWord("Eltaláltad!", false);
        won = true;
    }

    // also resets feedback
    feedback = ["w", "w", "w", "w", "w"]
    document.getElementById("feedback").innerHTML = "";
}

function addPossibleWord(word, clickable) {
    // adds possible words to the div

    const node = document.createElement("p");
    node.innerText = word;
    node.classList.add("word");
    
    // some messages dont need to be easily chosen, only runs if undefined
    if (typeof(clickable) == "undefined") {
        node.setAttribute("onclick",'easyChoose("'+word+'")');
    }
    document.getElementById("words").appendChild(node);
}

function easyChoose(word) {
    // lets you click on a word, and select it easily
    
    document.getElementById("guess").value = word;
    updateFeedback();
}


document.addEventListener("keyup", (event) => {
    // run at every key stopped being held

    var length = document.getElementById("guess").value.length;
    if (length != 0) {
        // this tells you if you have more or less letters than you should do
        document.getElementById("words").innerHTML = "";
        if (length < 5){
            addPossibleWord("Túl kevés betű!", false);
        } else if (length > 5) {
            addPossibleWord("Túl sok betű!", false);
        }
    }

    // if you press enter, the guessing will start
    if (event.key == "Enter"){
        guessWord();
    }

    // and updates feedback
    updateFeedback();
});

function updateFeedback() {
    // resets, then updates the feedback

    document.getElementById("feedback").innerHTML = "";
    guess = document.getElementById("guess").value.toLowerCase();
    guess_split = guess.split("");

    // adds every letter to feedback div. Never adds more then 5
    // ? this isnt really nescecary because it doesnt allow you to send it unless its five letters, but ok
    length = guess.length-1; if (length > 4) { length = 4; };
    for(i=0; i<=length; i++) {
        addFeedbackLetter(guess_split[i], i);
    }
}

function addFeedbackLetter(letter, position) {
    // adds the letters to the div
    // also adds the text, class, and onclick func

    const node = document.createElement("p");
    node.innerText = letter;
    node.classList.add("letter", "letter-white")
    node.setAttribute("onclick",'feedbackToggler('+position+')');
    node.id = position;

    document.getElementById("feedback").appendChild(node);
}

var classWh;
var classYl;
var classGr;
function feedbackToggler(id) {
    // Toggles letter colors
    // also changes the colors in the feedback array

    e = document.getElementById(id).classList;
    classWh = e.contains("letter-white");
    classYl = e.contains("letter-yellow");
    classGr = e.contains("letter-green");

    if (classWh == true) {
        e.replace("letter-white", "letter-yellow");
        feedback[id] = "y";
    }
    else if (classYl == true) {
        e.replace("letter-yellow", "letter-green");
        feedback[id] = "g";
    }
    else if (classGr == true) {
        e.replace("letter-green", "letter-white");
        feedback[id] = "w";
    }
}


// starts the entire thing
start();