// assigning basic variables
var possible = [];
let lang = "eng";
document.getElementById("lang").value = lang;

document.getElementById("lang").addEventListener("change", e => {
    lang = e.target.value;
    start();
});

function start() {
    // this runs at the start, and at every restart

    // resets inputs, displays, and if you've won or not
    document.getElementById("words").innerHTML = "";
    document.getElementById("guessinput").value = "";
    document.getElementById("inputrow").innerHTML = "";
    document.getElementById("rows").innerHTML = "";
    feedback = ["w", "w", "w", "w", "w"]
    won = false;

    // we get the words depending on the language
    let rawwords = "";
    switch (lang) {
        case "hu":
            rawwords = huwords;
            break;
        case "eng":
            rawwords = engwords;
            break;
    }

    // resets, then populates possible words
    possible = [];
    rawwords.split(", ").forEach(element => {
        possible.push(element);
    });
    updateFeedback();
}


let won = false;
function guessWord() {
    // only runs if the lettercount is 5
    if (document.getElementById("guessinput").value.length != 5) { alert("You put in the wrong amount of characters."); return; }

    // displays the feedback of the guessed word, just for the user to see
    saveFeedback();

    // resets the input and possible words and feedback displayed for next guess
    document.getElementById("guessinput").value = "";
    document.getElementById("words").innerHTML = "";
    document.getElementById("inputrow").innerHTML = "";
    
    wordEliminator();

    // displays the possible words
    if (!possible.length == 0) {
        if (!won){
            possible.forEach(element => {
                addPossibleWord(element);
            });
        }
    } else {
        // if no words are left, it displays this message
        addPossibleWord("No more valid words", false)
    }

    updateFeedback();
    
}

var guess;
let guess_split;
let feedback = [];
function wordEliminator() {
    // eliminates words by the wordle rules
    // this func became a mess because if you input a word with multiple same letters, the simple ruleset breaks.
    // for example: "sleep"
    // if one of the e-s is yellow, then the word has to include that letter, but not on the same index
    // but if also one of the e-s is grey, then the word must not include that letter, which in this case is not true.
    // wordle also count how many same letters have been inputted, and only gives yellow or green for the number of this letter in the word we're searching for.
    // if this was any helpful for you, you're welcome.

    // https://stackoverflow.com/a/28965567/12706133
    let hashset = new Set(guess_split);

    // eliminates the words.
    //* if this breaks, the older version is found in the git history.
    // we go trough the set, and getting the indexes and feedbacks of the letters
    hashset.forEach( e=> {
        // some variable setup beforehand
        let indexListFunc = () => {
            let list = [];
            guess_split.forEach((element, index) => {
                if (element == e) {
                    list.push(index);
                }
            });
            return list;
        }
        let feedbackListFunc = () => {
            let list = [];
            indexListFunc().forEach(element => {
                list.push(feedback[element]);
            });
            return list;
        }
        let indexList = indexListFunc();
        let feedbackList = feedbackListFunc();
        
        // if all of the feedback on the same letters are the same, we use these simple rules
        // if no multiple same letters, we go by the simple rules
        // green -> the letter is in the correct place in the word
        // yellow -> the letter is included in the letter, but not at that place
        // grey -> it has to not include the letter
        // we break out of the loop if one of these is true
        // this .every was copilots idea
        if (feedbackList.every((val, i, arr) => val === "w")) {
            for(w=possible.length-1; 0<=w; w--) {
                if (possible[w].includes(e)) {
                    possible.splice(possible.indexOf(possible[w]), 1);
                }
            }
            // https://masteringjs.io/tutorials/fundamentals/foreach-continue
            return;
        }
        if (feedbackList.every((val, i, arr) => val === "g")) {
            for(w=possible.length-1; 0<=w; w--) {
                if (!indexList.every((val, i, arr) => possible[w].split("")[val] == e)) {
                    possible.splice(possible.indexOf(possible[w]), 1);
                }
            }
            return;
        }
        if (feedbackList.every((val, i, arr) => val === "y")) {
            for(w=possible.length-1; 0<=w; w--) {
                let done = false;
                // if in the yellows place there is a green, it eliminates the word
                indexList.forEach((val, i, arr) => {
                    if (possible[w].split("")[val] != e) return;
                    possible.splice(possible.indexOf(possible[w]), 1);
                    done = true;
                });
                if (done) continue;
                // if the character appears less times in the word than the indexList, it eliminates the word
                // filter found at https://stackoverflow.com/a/6121234/12706133
                if (possible[w].split("").filter(x => x == e).length < indexList.length) {
                    possible.splice(possible.indexOf(possible[w]), 1);
                }
            }
            return;
        }

        // now we go trough feedback individually.
        // we cannot go trough the entire word, because there might be multiple same letters
        // so the rules change:
        // green -> the letter is in the correct place in the word
        // yellow -> the letter is included in the letter, but not at that place
        // grey -> it has to not include the letter AT THAT PLACE
        // this rewrite might have been overkill just for this rule change
        if (feedbackList.includes("g")) {
            feedbackList.forEach((val, i) => {
                if (val != "g") return;
                let index = indexList[i];

                for(w=possible.length-1; 0<=w; w--) {
                    if (possible[w].split("")[index] != e) {
                        possible.splice(possible.indexOf(possible[w]), 1);
                    }
                }
            });
        }
        if (feedbackList.includes("y")) {
            feedbackList.forEach((val, i) => {
                if (val != "y") return;
                let index = indexList[i];
                for(w=possible.length-1; 0<=w; w--) {
                    if (possible[w].split("")[index] == e) {
                        possible.splice(possible.indexOf(possible[w]), 1);
                    }
                }
            });
        }
        if (feedbackList.includes("w")) {
            feedbackList.forEach((val, i) => {
                if (val != "w") return;
                let index = indexList[i];
                for(w=possible.length-1; 0<=w; w--) {
                    if (possible[w].split("")[index] == e) {
                        possible.splice(possible.indexOf(possible[w]), 1);
                    }
                }
            });
        }
    });

    // if feedback is all green, it tells you, you won
    if (feedback.every((val, i, arr) => val === "g")) {
        addPossibleWord("Eltaláltad!", false);
        won = true;
    }

    // also resets feedback
    feedback = ["w", "w", "w", "w", "w"]
}

// displays the feedback of the guessed word, just for the user to see
function saveFeedback() {
    let node = document.createElement("div");
    node.classList.add("row");
    let children = document.getElementById("inputrow").children;
    for(i=0; i<=4; i++) {
        let letter = document.createElement("p");
        letter.innerText = children[i].innerText;
        letter.classList.add(children[i].classList[1], "letter", "deactivated-letter");
        node.appendChild(letter);
    }
    document.getElementById("rows").appendChild(node);
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

//? can it be done with "this"?
function easyChoose(word) {
    // lets you click on a word, and select it easily
    
    document.getElementById("guessinput").value = word;
    updateFeedback();
}


document.addEventListener("keyup", event => {
    // if you press enter, the guessing will start
    if (event.key == "Enter"){
        guessWord();
    }
});
// updates feedback on input change
document.getElementById("guessinput").addEventListener("input", updateFeedback);

function updateFeedback() {
    // resets, then updates the feedback

    document.getElementById("inputrow").innerHTML = "";
    guess = document.getElementById("guessinput").value.toLowerCase();
    guess_split = guess.split("");

    // adds every letter to feedback div. Never adds more then 5
    for(i=0; i<=4; i++) {
        addFeedbackLetter(guess_split[i], i);
    }
}

function addFeedbackLetter(letter, position) {
    // adds the letters to the div
    // also adds the text, class, and onclick func

    const node = document.createElement("p");
    node.classList.add("letter");
    if (typeof letter !== "undefined") {
        node.innerText = letter;
        node.classList.add("letter-white");
        node.setAttribute("onclick",'feedbackToggler('+position+')');
        node.id = position;
    } else {
        node.innerText = "";
        node.classList.add("pending-letter", "deactivated-letter");
    }

    document.getElementById("inputrow").appendChild(node);
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