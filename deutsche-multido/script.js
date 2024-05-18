content.style.visibility = "hidden";
// hiding initial popup
function hidePopup() {
    submitInfo.style.visibility = "hidden";
    content.style.visibility = "visible";
    let startval = startIndexInput.value, endval = endIndexInput.value;
    // checking if the min and max values have changed and if so, restarting the quiz
    if (startval != startIndex || endval != endIndex) {
        startIndex = startval, endIndex = endval;
    }
    infoElements.forEach( e => {
        e.normalValue = e.innerText;
    })
    startQuiz();
}

let auxiliary = "ist";
// auxiliary button functionality
function changeAuxiliary() {
    if (!canStep) {
        switch(auxiliary){
            case "ist":
                auxiliary = "hat";
                break;
            case "hat":
                auxiliary = "ist";
                break;
        }
        auxiliaryButton.value = auxiliary;
    }
}
auxiliaryButton.addEventListener("click", () => {
    changeAuxiliary();
});

// https://stackoverflow.com/questions/62348768/how-to-check-the-state-of-input-event
startIndexInput.addEventListener("change", () => { updateMinMax(); })
endIndexInput.addEventListener("change", () => { updateMinMax(); })
// min and max value functionality
function updateMinMax() {
    // https://stackoverflow.com/a/31058978/12706133
    // checking for edge cases
    if (parseInt(startIndexInput.value, 10) > parseInt(startIndexInput.max, 10)) startIndexInput.value = parseInt(startIndexInput.max, 10);
    if (parseInt(startIndexInput.value, 10) < parseInt(startIndexInput.min, 10)) startIndexInput.value = parseInt(startIndexInput.min, 10);
    if (parseInt(endIndexInput.value, 10) > parseInt(endIndexInput.max, 10)) endIndexInput.value = parseInt(endIndexInput.max, 10);
    if (parseInt(endIndexInput.value, 10) < parseInt(endIndexInput.min, 10)) endIndexInput.value = parseInt(endIndexInput.min, 10);
    // changing the min and max values
    startIndexInput.max = parseInt(endIndexInput.value, 10) -1;
    endIndexInput.min = parseInt(startIndexInput.value, 10) +1;
    // checking if input was empty, and if so, setting it to the min/max value
    if (startIndexInput.max == "NaN") { startIndexInput.max = endIndexInput.max; endIndexInput.value = endIndexInput.max; updateMinMax(); }
    if (endIndexInput.min == "NaN") { endIndexInput.min = startIndexInput.min; startIndexInput.value = startIndexInput.min; updateMinMax(); }
}

// key pressing detection
document.addEventListener("keydown", (e) => {
    if (submitInfo.style.visibility!="hidden" && e.key == " ") hidePopup();
    if (e.key == "Enter" && lastTarget != auxiliaryButton) handleStep();
    // this might trap the focus, but it might not
    // https://hidde.blog/using-javascript-to-trap-focus-in-an-element/
    if (e.key == "Tab") {
        if (e.shiftKey) {
            if (lastTarget == infinitiv) {
                e.preventDefault();
                perfekt.focus();
            }
        } else {
            if (lastTarget == perfekt) {
                e.preventDefault();
                infinitiv.focus();
            }
        }
    }

    // you can also toggle the button with arrow keys
    if ((e.key == "ArrowUp" || e.key == "ArrowDown") && lastTarget == auxiliaryButton) changeAuxiliary();
    // and also navigate
    if (e.key == "ArrowLeft" && lastTarget == auxiliaryButton) {
        let i = allInputs.indexOf(lastTarget);
        if (i == 0) {
            allInputs[allInputs.length-1].focus();
            lastTarget = allInputs[allInputs.length-1];
        } else {
            allInputs[i-1].focus();
            lastTarget = allInputs[i-1];
        }
    } if (e.key == "ArrowRight" && lastTarget == auxiliaryButton) {
        let i = allInputs.indexOf(lastTarget);
        if (i == allInputs.length-1) {
            allInputs[0].focus();
            lastTarget = allInputs[0];
        } else {
            allInputs[i+1].focus();
            lastTarget = allInputs[i+1];
        }
    }
})

// for checking where we pressed enter (we keep it tracked using tabs), because we need it to also toggle the button
// https://stackoverflow.com/questions/18316395/javascript-for-handling-tab-key-press
let lastTarget;
document.addEventListener("keyup", (e) => {
    if (e.key == "Tab") lastTarget = e.target;
});


let quiz = [];
let currentStep;
let canStep = false;
let startIndex = startIndexInput.value = 0, endIndex = endIndexInput.value = 130; endIndexInput.max = Object.keys(words).length; updateMinMax();
// starting the quiz
function startQuiz() {
    quiz = Object.keys(words).slice(startIndex, endIndex);
    // https://www.codemzy.com/blog/shuffle-array-javascript
    quiz.sort(() => (Math.random() - 0.5)*(quiz.length/4));
    console.log("New sequence generated.")
    currentStep = -1;
    stepWord();
}

// handles between stepping to next word and scoreing guesses
function handleStep() {
    switch(canStep) {
        case false:
            makeGuess();
            break;
        case true:
            hideScore();
            stepWord();
            break;
        }
    canStep = !canStep;
}

const allInputs = [infinitiv, prasens, prateritum, auxiliaryButton, perfekt];
// for stepping to the next word
function stepWord() {
    allInputs.forEach(e => {
        e.value = "";
    });
    auxiliaryButton.value = "ist";
    auxiliary = "ist";
    currentStep++;
    console.log(currentStep)
    // checks if we ran out of words, restarts the quiz
    let nextWord = quiz[currentStep]
    word.innerText = nextWord;
    if (currentStep == quiz.length) startQuiz();
}


let answer = [];
// handling the guessing (just gets what the user answers, and passes it down to diffCheck)
function makeGuess() {
    answer = [];
    allInputs.forEach( e => {
        answer.push(e.value.toLowerCase().trim())
    })
    diffCheck();
    // unfocusing an element
    // https://stackoverflow.com/questions/4075057/javascript-unfocus-a-textbox
    document.activeElement.blur();
}

let score = [];
let quizWord;
// checks the differences between the correct answer and what the user answered
function diffCheck() {
    score = [];
    quizWord = words[word.innerText];
    for(i = 0; i < 5; i++){
        if (answer[i] == quizWord[i] || answer[i] == "PITE") {
            score.push(true)
        } else score.push(false)
    }
    displayScore()
}


const infoElements = [infoInfinitiv, infoPrasens, infoPrateritum, infoAuxiliary, infoPerfekt];
// displays the score
function displayScore() {
    for(i = 0; i < 5; i++){
        if (score[i] == false) {
            allInputs[i].classList.toggle("red")
            infoElements[i].innerText = quizWord[i]
            infoElements[i].classList.toggle("correctValue")
        } else allInputs[i].classList.toggle("green")
        allInputs[i].readOnly = true;
    }
}

// hides the score
function hideScore() {
    // resetting inputs
    allInputs.forEach( e => {
        if (e.classList.contains("green")) {
            e.classList.toggle("green");
        }
        if (e.classList.contains("red")) {
            e.classList.toggle("red");
        }
        e.readOnly = false;
    })
    // resseting input elements
    infoElements.forEach(e => {
        if (e.classList.contains("correctValue")) {
            e.classList.toggle("correctValue")
        }
        e.innerText = e.normalValue;
    });
}

dictionaryCont.style.visibility = "hidden";
function toggleDictionary() {
    dictionaryCont.style.visibility = dictionaryCont.style.visibility == "hidden" ? "visible" : "hidden";
    if (dictionaryCont.style.visibility == "visible") {
        // https://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
        let event = document.createEvent("HTMLEvents");
        event.initEvent("input", true, true);
        event.eventName = "input";
        searchbar.dispatchEvent(event);
    }
}
searchbar.addEventListener("input", () => {
    let search = searchbar.value.toLowerCase().trim();
    let results = [];
    Object.keys(words).forEach( e => {
        if (e.includes(search)) {results.push(e); return;}
        let done = false;
        words[e].forEach( f => {
            if (done) return;
            if (f.includes(search)) {results.push(e); done = true;}
        });
    });
    dictionary.innerHTML = "";
    results.forEach( e => {
        let entry = document.createElement("div");
        let content = [e, ...words[e]];
        content.forEach( (f, i) => {
            // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
            [...f.matchAll(new RegExp(search, 'gi'))].map(a => a.index).forEach( g => {
                // https://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
                let s = f.split("");
                s.splice(g, search.length, `<b>${search}</b>`);
                content[i] = s.join("");
            });
        });
        content.forEach( f => {
            entry.innerHTML += `<div><p>${f}</p></div>`
        });
        // entry.classList.add("dictionaryEntry");
        dictionary.appendChild(entry);
    });
});