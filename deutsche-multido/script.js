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
    startQuiz();
}

// auxiliary button functionality
let auxiliary = "ist";
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

// min and max value functionality
// https://stackoverflow.com/questions/62348768/how-to-check-the-state-of-input-event
startIndexInput.addEventListener("change", () => { updateMinMax(); })
endIndexInput.addEventListener("change", () => { updateMinMax(); })
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
    if (submitInfo.style.visibility!="hidden" && e.key == " ") {
        hidePopup();
    }
    if (e.key == "Enter") {
        if (lastTarget != auxiliaryButton) {
            handleStep();
        }
    }
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
})

// for checking where we pressed enter, because we need it to also toggle the button
// https://stackoverflow.com/questions/18316395/javascript-for-handling-tab-key-press
let lastTarget;
document.addEventListener("keyup", (e) => {
    if (e.key == "Tab") {
        lastTarget = e.target;
    }
})


// starting the quiz
let quiz = [];
let currentStep;
let canStep = false;
let startIndex = startIndexInput.value = 80, endIndex = endIndexInput.value = 100; endIndexInput.max = Object.keys(words).length; updateMinMax();
function startQuiz() {
    quiz = Object.keys(words).slice(startIndex, endIndex);
    // https://www.codemzy.com/blog/shuffle-array-javascript
    quiz.sort(() => (Math.random() - 0.5)*(quiz.length/4));
    console.log("New sequence generated.")
    currentStep = -1;
    stepWord();
}


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

// for stepping to the next word
const allInputs = [infinitiv, prasens, prateritum, auxiliaryButton, perfekt];
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


// handling the guessing
let answer = [];
function makeGuess() {
    answer = [];
    allInputs.forEach( e => {
        answer.push(e.value.toLowerCase().trim())
    })
    diffCheck();
    // https://stackoverflow.com/questions/4075057/javascript-unfocus-a-textbox
    document.activeElement.blur();
}

// checks the differences between the word and what the user answered
let score = [];
let quizWord;
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
infoElements.forEach( e => {
    e.normalValue = e.innerText;
})
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

function hideScore() {
    allInputs.forEach( e => {
        if (e.classList.contains("green")) {
            e.classList.toggle("green");
        }
        if (e.classList.contains("red")) {
            e.classList.toggle("red");
        }
        e.readOnly = false;
    })
    infoElements.forEach(e => {
        if (e.classList.contains("correctValue")) {
            e.classList.toggle("correctValue")
        }
        e.innerText = e.normalValue;
    });
}