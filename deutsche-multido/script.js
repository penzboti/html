let helpPopup = true;
function toggleHelpPopup() {
  switch (helpPopup) {
    case true:
      submitInfo.style.visibility = "hidden";
      content.style.visibility = "visible";
      menuCont.style.visibility = "visible";
      infoElements.forEach((e) => {
        e.normalValue = e.innerText;
      });
      break;
    case false:
      content.style.visibility = "hidden";
      menuCont.style.visibility = "hidden";
      submitInfo.style.visibility = "visible";
      break;
  }
  helpPopup = !helpPopup;
}

let auxiliary = "ist";
// auxiliary button functionality
function changeAuxiliary() {
  if (!canStep) {
    switch (auxiliary) {
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

// key pressing detection
document.addEventListener("keydown", (e) => {
  if (submitInfo.style.visibility != "hidden" && e.key == " ")
    toggleHelpPopup();
  if (e.key == "Enter" && lastTarget != auxiliaryButton && !helpPopup)
    handleStep();
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
  if (
    (e.key == "ArrowUp" || e.key == "ArrowDown") &&
    lastTarget == auxiliaryButton
  )
    changeAuxiliary();
  // and also navigate, but only from the button lol
  if (e.key == "ArrowLeft" && lastTarget == auxiliaryButton) {
    let i = allInputs.indexOf(lastTarget);
    if (i == 0) {
      allInputs[allInputs.length - 1].focus();
      lastTarget = allInputs[allInputs.length - 1];
    } else {
      allInputs[i - 1].focus();
      lastTarget = allInputs[i - 1];
    }
  }
  if (e.key == "ArrowRight" && lastTarget == auxiliaryButton) {
    let i = allInputs.indexOf(lastTarget);
    if (i == allInputs.length - 1) {
      allInputs[0].focus();
      lastTarget = allInputs[0];
    } else {
      allInputs[i + 1].focus();
      lastTarget = allInputs[i + 1];
    }
  }
});

// for checking where we pressed enter (we keep it tracked using tabs), because we need it to also toggle the button
// https://stackoverflow.com/questions/18316395/javascript-for-handling-tab-key-press
let lastTarget;
document.addEventListener("keyup", (e) => {
  if (e.key == "Tab") lastTarget = e.target;
});

let quiz = [];
let currentStep;
let canStep = false;
let startIndex = 0,
  endIndex = Object.keys(words).length;
// starting the quiz
function startQuiz() {
  quiz = Object.keys(words).slice(startIndex, endIndex);
  // https://www.codemzy.com/blog/shuffle-array-javascript
  quiz.sort(() => (Math.random() - 0.5) * (quiz.length / 4));
  console.log("New sequence generated.");
  currentStep = -1;
  stepWord();
}

// handles between stepping to next word and scoreing guesses
function handleStep() {
  switch (canStep) {
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
  allInputs.forEach((e) => {
    e.value = "";
  });
  auxiliaryButton.value = "ist";
  auxiliary = "ist";
  currentStep++;
  console.log(currentStep);
  // checks if we ran out of words, restarts the quiz
  let nextWord = quiz[currentStep];
  word.innerText = nextWord;
  if (currentStep == quiz.length) startQuiz();
}

let answer = [];
// handling the guessing (just gets what the user answers, and passes it down to diffCheck)
function makeGuess() {
  answer = [];
  allInputs.forEach((e) => {
    answer.push(e.value.toLowerCase().trim());
  });
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
  for (i = 0; i < 5; i++) {
    if (answer[i] == quizWord[i] || answer[i] == "PITE") {
      score.push(true);
    } else score.push(false);
  }
  displayScore();
}

const infoElements = [
  infoInfinitiv,
  infoPrasens,
  infoPrateritum,
  infoAuxiliary,
  infoPerfekt,
];
// displays the score
function displayScore() {
  for (i = 0; i < 5; i++) {
    if (score[i] == false) {
      allInputs[i].classList.toggle("red");
      infoElements[i].innerText = quizWord[i];
      infoElements[i].classList.toggle("correctValue");
    } else allInputs[i].classList.toggle("green");
    allInputs[i].readOnly = true;
  }
}

// hides the score
function hideScore() {
  // resetting inputs
  allInputs.forEach((e) => {
    if (e.classList.contains("green")) {
      e.classList.toggle("green");
    }
    if (e.classList.contains("red")) {
      e.classList.toggle("red");
    }
    e.readOnly = false;
  });
  // resseting input elements
  infoElements.forEach((e) => {
    if (e.classList.contains("correctValue")) {
      e.classList.toggle("correctValue");
    }
    e.innerText = e.normalValue;
  });
}

dictionaryCont.style.visibility = "hidden";
function toggleDictionary() {
  dictionaryCont.style.visibility =
    dictionaryCont.style.visibility == "hidden" ? "visible" : "hidden";
  menuCont.style.visibility =
    menuCont.style.visibility == "visible" ? "hidden" : "visible";
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
  Object.keys(words).forEach((e) => {
    if (e.includes(search)) {
      results.push(e);
      return;
    }
    let done = false;
    words[e].forEach((f) => {
      if (done) return;
      if (f.includes(search)) {
        results.push(e);
        done = true;
      }
    });
  });
  dictionary.innerHTML = "";
  results.forEach((e, i) => {
    let entry = document.createElement("div");
    let content = [e, ...words[e]];
    content.forEach((f, i) => {
      // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript
      [...f.matchAll(new RegExp(search, "gi"))]
        .map((a) => a.index)
        .forEach((g) => {
          // https://stackoverflow.com/questions/20817618/is-there-a-splice-method-for-strings
          let s = f.split("");
          s.splice(g, search.length, `<b>${search}</b>`);
          content[i] = s.join("");
        });
    });
    content.forEach((f) => {
      entry.innerHTML += `<div><p>${f}</p></div>`;
    });
    if (i % 2 === 0) entry.classList.toggle("tableRow");
    // entry.classList.add("dictionaryEntry");
    dictionary.appendChild(entry);
  });
});

// start the quiz
toggleHelpPopup();
startQuiz();

