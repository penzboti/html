// auxiliary button functionality
let auxiliary = "ist";

function changeAuxiliary() {
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

// key pressing detection
document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        if (lastTarget != auxiliaryButton) {
            makeGuess();
            stepWord();
            // switch(canStep) {
            //     case false:
            //         makeGuess();
            //         break;
            //     case true:
            //         stepWord();
            //         break;
            // }
            // canStep = !canStep;
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


// load words
let words;
fetch("words.json").then( (data) => data.json() ).then( (data) => {
    words = data;
    startQuiz();
})

// starting the quiz
let quiz = {};
let randomsequence = [];
let currentStep;
let canStep = false;
function startQuiz() {
    quiz = words;
    // https://www.codemzy.com/blog/shuffle-array-javascript
    randomsequence = Object.keys(quiz).sort(() => (Math.random() - 0.5)*3);
    console.log(randomsequence)
    currentStep = -1;
    stepWord();
}


// for stepping to the next word
const allInputs = [infinitiv, prateritum, auxiliaryButton, perfekt];
function stepWord() {
    allInputs.forEach(e => {
        e.value = "";
    });
    auxiliaryButton.value = "ist"
    currentStep++;
    // checks if we ran out of words, restarts the quiz
    if (currentStep == randomsequence.length) startQuiz();
    let nextWord = randomsequence[currentStep]
    word.innerText = nextWord;
}


// handling the guessing
let answer = [];
function makeGuess() {
    console.log(word.innerText)
    answer = [];
    allInputs.forEach( e => {
        answer.push(e.value)
    })
    console.log(answer)
    diffCheck();
    // https://stackoverflow.com/questions/4075057/javascript-unfocus-a-textbox
    document.activeElement.blur();
}

// checks the differences between the word and what the user answered
let score = [];
function diffCheck() {
    score = [];
    let quizWord = quiz[word.innerText];
    for(i = 0; i < 4; i++){
        if (answer[i] == quizWord[i]) {
            score.push(true)
        } else score.push(false)
    }
    console.log(score)
}