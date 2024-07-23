// assigning basic variables
var possible = [];
let lang = "eng";
document.getElementById("lang").value = lang;

document.getElementById("lang").addEventListener("change", e => {
    lang = e.target.value;
    start();
});

// assisted mode initial load (persist through reloads) and toggle functionality
let assistedMode = true;
// guess its null instead of undefined then https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
if (window.localStorage.getItem("assistedMode") === null) window.localStorage.setItem("assistedMode", assistedMode)
else assistedMode = window.localStorage.getItem("assistedMode") == "true";
document.getElementById("assistedToggle").checked = assistedMode;
document.getElementById("assistedToggle").addEventListener("change", e => {
    assistedMode = !assistedMode;
    window.localStorage.setItem("assistedMode", assistedMode);
    displayWords();
});

// answers mode, code just like assisted mode
// only uses possible answers
let answersMode = false;
if (window.localStorage.getItem("answersMode") === null) window.localStorage.setItem("answersMode", answersMode)
else answersMode = window.localStorage.getItem("answersMode") == "true";
document.getElementById("answersToggle").checked = answersMode;
document.getElementById("answersToggle").addEventListener("change", e => {
    answersMode = !answersMode;
    window.localStorage.setItem("answersMode", answersMode);
    start();
});


let rawwords = "";
let rawanswers = "";
function start() {
    // this runs at the start, and at every restart

    // resets inputs, displays, and if you've won or not
    document.getElementById("words").innerHTML = "";
    document.getElementById("guessinput").value = "";
    document.getElementById("inputrow").innerHTML = "";
    document.getElementById("rows").innerHTML = "";
    feedback = ["w", "w", "w", "w", "w"]
    won = false;

    previous_guess = "";
    previous_feedback = [];

    // we get the words depending on the language
    switch (lang) {
        case "hu":
            rawwords = huwords;
            rawanswers = huwords;
            break;
        case "eng":
            rawwords = engwords;
            rawanswers = enganswers;
            break;
    }

    // resets, then populates possible words
    possible = [];
    if (answersMode) {
        rawanswers.split(", ").forEach(element => {
            possible.push(element);
        });
    } else {
        rawwords.split(", ").forEach(element => {
            possible.push(element);
        });
    }
    updateFeedback();
    displayWords();
}


let won = false;
let previous_guess = "";
let previous_feedback = [];
function guessWord() {
    // only runs if the lettercount is 5
    if (document.getElementById("guessinput").value.trim().length != 5) { alert("You put in the wrong amount of characters."); return; }

    // displays the feedback of the guessed word, just for the user to see
    saveFeedback();

    // resets the input and possible words and feedback displayed for next guess
    document.getElementById("guessinput").value = "";
    document.getElementById("words").innerHTML = "";
    document.getElementById("inputrow").innerHTML = "";
    
    wordEliminator();

    // displays the possible words
    displayWords();

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
                    if (done) return;
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
        won = true;
        displayWords();
    }

    // also resets feedback
    previous_guess = guess;
    previous_feedback = [...feedback];
    feedback = ["w", "w", "w", "w", "w"]
}

// displays the valid words
// this depends on the assisted mode
function displayWords() {
    document.getElementById("words").innerHTML = "";
    
    if (possible.length == 0) addPossibleWord("No more valid words", false);
    else if (won) addPossibleWord("You won!", false);
    else { 

    switch (assistedMode) {
    case true:

        let letterMaps = mapLetters();
        let scoreList = scoreWords(letterMaps);

        addPossibleWord("Here are the best words to choose from", false);
        for(i=0; i<5; i++) {
            if (scoreList[i] == undefined) break;
            addPossibleWord(scoreList[i])
        }

        addPossibleWord(`Overall there are ${possible.length} word(s) left`, false);
        if (previous_feedback.filter(e => e == "g").length > 3) {
            let letterEliminatorWords = letterEliminatorWordMaker(letterMaps);
            addPossibleWord("You may choose these words to eliminate more letters", false);
            for(i = 0; i < 3; i++){
                if (letterEliminatorWords[i] == undefined) break;
                addPossibleWord(letterEliminatorWords[i]);
            }
        }
        
    break;
    case false:

        if (guess == "") {
            // to not display all of the words at first, we simply send this message
            // to not lag the device or have an infinite scroller
            addPossibleWord("Input any 5 letter word.", false)
            addPossibleWord("If you can't think of any, here is a random one:", false)
            addPossibleWord(possible[Math.floor(Math.random() * possible.length)]);
            
        } else {
            addPossibleWord(`Here are the ${possible.length} possible words`, false);
            possible.forEach(element => {
                addPossibleWord(element);
            });
        }
    break;
    } }
}


// in the assisted mode, it gives you top words that you should pick.
// this is calculated by calculating the frequency of letters in the remaining words
// then giving a score to each word
// the positional one just gives a score to each word based on the frequency of the letter in that position
function mapLetters() {
    let list = [...possible];
    let letterMap = {};
    list.forEach( word => {
        word.split("").forEach( letter => {
            if (letter in letterMap) {
                letterMap[letter]++;
            } else {
                letterMap[letter] = 1;
            }
        });
    });

    let positionalLetterMap = [{}, {}, {}, {}, {}];
    list.forEach( word => {
        for (i=0; i<=4; i++) {
            let letter = word.split("")[i];
            if (letter in positionalLetterMap[i]) {
                positionalLetterMap[i][letter]++;
            } else {
                positionalLetterMap[i][letter] = 1;
            }
        }
    });

    return {overall: letterMap, positional: positionalLetterMap}
}

// sorting words by the score calculated in mapLetters
function scoreWords(letterMaps) {
    // this version uses the overall letter map, which is slightly worse than the positional one
    // it scores the words based on letter frequency. if a letter is more frequent in the remaining words, the word gets a higher score
    // list.forEach( word => {
    //     let score = 0;
    //     new Set(word.split("")).forEach( letter => {
    //         score += letterMap[letter];
    //     });
    //     scoreMap[word] = score;
    // });
    // list.sort((a, b) => scoreMap[a] - scoreMap[b]).reverse();

    // this version splits the words into 5 different letter position groups, and scores them individually
    // and then based on what letter is where in the word, it scores them
    let letterMap = letterMaps.positional;
    let list = [...possible];
    let scoreMap = {};

    list.forEach( word => {
        let score = 0;
        let letters = {};

        for (i=0; i<=4; i++) {
            let letter = word.split("")[i];
            let scoreBuffer = letterMap[i][letter];

            // also making sure that the same letter is not counted twice
            if (letter in letters) {
                if (letters[letter] < scoreBuffer) {
                    score -= letters[letter];
                } else {
                    scoreBuffer = 0;
                }
            }

            score += scoreBuffer;
            letters[letter] = scoreBuffer > letters[letter] ? scoreBuffer : letters[letter];
        }

        scoreMap[word] = score;
    });

    list.sort((a, b) => scoreMap[a] - scoreMap[b]).reverse();

    return list;
}

function letterEliminatorWordMaker(letterMaps) {
    // this feature solves one issue, written in this article
    // https://www.dailymail.co.uk/femail/article-10568771/Furious-Wordle-players-arms-word-options-letter.html
    // when you guess 4 letters, but the last one can be multiple letters
    // so this function returns some words that can eliminate some of these letters
    // so you dont have to guess one at a time and maybe run out of guesses
    let allwords = !answersMode ? rawwords.split(", ") : rawanswers.split(", ");
    let letterEliminatorScoreMap = {};

    allwords.forEach( word => {
        let score = 0;
        let letters = {};
        
        for (i=0; i<=4; i++) {
            let letter = word.split("")[i];
            let scoreBuffer = letterMaps.overall[letter];
            let positionalScoreBuffer = letterMaps.positional[i][letter];

            if (isNaN(scoreBuffer)) scoreBuffer = 0;
            if (isNaN(positionalScoreBuffer)) positionalScoreBuffer = 0;

            // also making sure that the same letter is not counted twice
            if (letter in letters) {
                if (letters[letter] < scoreBuffer) score -= letters[letter];
                else scoreBuffer = 0;
                positionalScoreBuffer = 0;
            }
            // and also, since we want the most unknown information, then its the best to leave out the letters that are already guessed
            if (previous_guess.includes(letter)) {scoreBuffer = 0; positionalScoreBuffer = 0};

            score += scoreBuffer + positionalScoreBuffer;
            letters[letter] = scoreBuffer > letters[letter] ? scoreBuffer : letters[letter];
        }
        letterEliminatorScoreMap[word] = score;
    });

    let filteredWords = allwords.filter(e => letterEliminatorScoreMap[e] != 0);
    let scores = filteredWords.map(e => letterEliminatorScoreMap[e]);

    // max is not array.max, but Math.max https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    // only returning the best words by score
    return filteredWords.filter(e => letterEliminatorScoreMap[e] == Math.max(...scores));
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
    } else {
        node.classList.add("infoword");
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
    guess = document.getElementById("guessinput").value.trim().toLowerCase();
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
        node.setAttribute("onclick", `feedbackToggler(${position}, 1)`);
        // https://stackoverflow.com/questions/4235426/how-can-i-capture-the-right-click-event-in-javascript
        node.setAttribute("oncontextmenu", `feedbackToggler(${position}, 2);return false;`);
        node.id = position;
    } else {
        node.innerText = "";
        node.classList.add("pending-letter", "deactivated-letter");
    }

    document.getElementById("inputrow").appendChild(node);
}

function feedbackToggler(id, button) {
    // Toggles letter colors
    // also changes the colors in the feedback array
    // right click to go back, left click to go forward

    e = document.getElementById(id).classList;
    let index = e.contains("letter-white") ? 0 : e.contains("letter-yellow") ? 1 : 2;
    index = button == 1 ? index + 1 : index - 1;
    if (index == 3) index = 0; 
    if (index == -1) index = 2;
    switch (index) {
    case 0:
        e.remove("letter-yellow", "letter-green");
        e.add("letter-white");
        feedback[id] = "w";
        break;
    case 1: 
        e.remove("letter-white", "letter-green");
        e.add("letter-yellow");
        feedback[id] = "y";
        break;
    case 2:
        e.remove("letter-yellow", "letter-white");
        e.add("letter-green");
        feedback[id] = "g";
        break;
    }
}

// starts the entire thing
start();