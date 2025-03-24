const code = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
};

// get wordlist, and after that, start the site
let wordlist;
getWords()
  .then((words) => {
    wordlist = words.split("\n");
    currword = getWord();
    displayMorse();
    displayWord();
  })
  .catch(() => alert("We've encountered an error. See console for details."));

// handling fetching the wordlist
function getWords() {
  return new Promise((resolve, reject) => {
    // this wordlist is from https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/
    fetch("../words.txt")
      .then((response) => response.text())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
}

let currword = "";
// getting a word from the wordlist
function getWord() {
  let randomInt = Math.floor(Math.random() * wordlist.length);
  return wordlist[randomInt].toLowerCase();
}

// keybord input
document.addEventListener("keydown", (e) => {
  switch (e.key) {
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
      delChar();
      break;
  }
});

// adding morse code . or -
let characters = "";
function addChar(char) {
  if (currword.length <= userword.length) {
    return;
  }
  if (characters.length != 5) characters = `${characters}${char}`;

  displayMorse();
}

// deleting character from morse code
function delChar() {
  characters = characters.slice(0, -1);

  displayMorse();
}

// sending morse code feedback
function displayMorse() {
  for (let i = 0; i < 5; i++) {
    codeSequence.children[i].innerText =
      typeof characters[i] != "undefined" ? characters[i] : "_";
    if (characters[i] == ".") codeSequence.children[i].innerText = "·";
  }
}

let userword = "";
let endOfWord = false;
// confirming morse code to a character
// also is the function that handles next word
function confirmChar() {
  if (endOfWord) {
    endOfWord = false;
    currword = getWord();
    userword = "";
    displayMorse();
    displayWord();
    input.children[0].style.visibility = "visible";
    return;
  }
  let char = "";
  Object.keys(code).forEach((key) => {
    if (code[key] == characters) {
      char = key;
    }
  });
  characters = "";
  userword = `${userword}${char}`;
  displayMorse();
  displayWord();
  if (userword.length == currword.length) {
    endOfWord = true;
    input.children[0].style.visibility = "hidden";
  }
}

// sending word feedback
function displayWord() {
  baseSequence.innerHTML = "";
  for (let i = 0; i < userword.length; i++) {
    let node = document.createElement("span");
    node.innerText = userword[i];
    node.classList.add(userword[i] != currword[i] ? "red" : "green");
    // kind of from this answer https://stackoverflow.com/a/42528274/12706133
    baseSequence.appendChild(node);
  }

  let node = document.createElement("span");
  node.innerText =
    userword.length != currword.length ? currword[userword.length] : "";
  node.classList.add("highlight");
  baseSequence.appendChild(node);

  let node2 = document.createElement("span");
  node2.innerText = currword.slice(userword.length + 1);
  baseSequence.appendChild(node2);
  size = currword.length / 5;
  if (currword.length < 5) size = 0;
  baseSequence.style.fontSize = `${5 - size}em`;
}
