// keybord input
document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case " ":
      confirmNum();
      break;
    case "0":
      addChar("0");
      break;
    case "1":
      addChar("1");
      break;
    case "Backspace":
      delChar();
      break;
  }
});

let characters = "";
// adds a character
function addChar(char) {
  if (answerPhase) return;
  // if (currword.length <= userword.length) {return;}
  if (characters.length != 8) characters = `${characters}${char}`;

  displayBinary();
}

// deletes a character
function delChar() {
  if (answerPhase) return;
  characters = characters.slice(0, -1);

  displayBinary();
}

let answerPhase = false;
// confirms the number and displays answer to the user
function confirmNum() {
  if (!answerPhase) {
    input.children[0].style.visibility = "hidden";
    characters = characters.padEnd(8, "0");
    let n = parseInt(characters, 2);
    if (n == currN) {
      baseSequence.classList.add("green");
    } else {
      baseSequence.innerHTML = `${currN}≠<span class="red">${n}</span>`;
      let code = currN.toString(2).padStart(8, "0");
      console.log(characters, code);
      console.log(currN, n);
      for (let i = 0; i <= 7; i++) {
        if (code[i] != characters[i]) {
          codeSequence.children[i].innerHTML =
            `<span class="red">${typeof characters[i] != "undefined" ? characters[i] : "0"}</span>`;
        } else {
          codeSequence.children[i].innerText =
            typeof characters[i] != "undefined" ? characters[i] : "0";
        }
      }
    }
  } else {
    baseSequence.classList.remove("green");
    input.children[0].style.visibility = "visible";
    newCode();
  }
  answerPhase = !answerPhase;
}

currN = "";
// generates a new binary code
function newCode() {
  characters = "";
  currN = Math.floor(Math.random() * 256);
  // let currCode = n.toString(2).padEnd(8, "0");
  baseSequence.innerText = currN;
  displayBinary();
}

// displays the binary code
function displayBinary() {
  for (let i = 0; i <= 7; i++) {
    if (typeof characters[i] != "undefined") {
      codeSequence.children[i].innerText = characters[i];
    } else {
      codeSequence.children[i].innerHTML = '<span class="grey">0</span>';
    }
  }
}

// start the site
newCode();
