function hidePopup() {
    submitInfo.style.visibility = "hidden";
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
})
auxiliaryButton.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        changeAuxiliary();
    }
})

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
        if (!e.shiftKey) {
            if (lastTarget == perfekt) {
                infinitiv.focus();
                e.preventDefault();
            }
        } else {
            if (lastTarget == infinitiv) {
                perfekt.focus();
                e.preventDefault();
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
let quiz = {};
let randomsequence = [];
let currentStep;
let canStep = false;
function startQuiz() {
    quiz = words;
    // https://www.codemzy.com/blog/shuffle-array-javascript
    randomsequence = Object.keys(quiz).sort(() => (Math.random() - 0.5)*(Object.keys(quiz).length/4));
    // randomsequence = Object.keys(quiz);
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
    auxiliaryButton.value = "ist"
    currentStep++;
    console.log(currentStep)
    // checks if we ran out of words, restarts the quiz
    let nextWord = randomsequence[currentStep]
    word.innerText = nextWord;
    if (currentStep == randomsequence.length) startQuiz();
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
    quizWord = quiz[word.innerText];
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

// load words
let words = allwords
startQuiz();