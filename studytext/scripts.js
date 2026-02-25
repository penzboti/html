// #### config
const replaceText = "[replace this]" // note that '<' and '>' produce different html
// i should probably find a better one
const replaceAmount = 10;

// #### globals
navbar.style.visibility = "hidden";

let globaltxt = "";
let globallist = [];

// #### functions
function start() {
  if (globaltxt === "") {
    alert("no input text detected")
    return;
  }
  hide()
  let {text,list} = selectWords(globaltxt,replaceAmount)
  globallist=list;
  render(text);
  replaceReplacements(list);
}

function end() {
  unhide();
  render(globaltxt);
}

function hide() {
  inputfields.style.visibility = "hidden";
  main.classList.add("main-top");
  navbar.style.visibility = "visible";
}
function unhide() {
  inputfields.style.visibility = "visible";
  main.classList.remove("main-top");
  navbar.style.visibility = "hidden";
}

// #### handling input
// file
fileinput?.addEventListener('change', () => {
  const file = fileinput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = function({ target }) {
    const txt = target.result;
    globaltxt = txt;
    render(globaltxt);
  }
});

// text (doesnt work yet)
textinput?.addEventListener('change', () => {
  const txt = textinput.value;
  console.log(txt)
  render(txt)
})

// #### handling 'quiz'
function test(c) {
  return "0123456789öüóqwertzuiopőúűasdfghjkléáíyxcvbnmQWERTZUIOPŐÚŰÖÜÓASDFGHJKLÉÁÍYXCVBNM".includes(c)
}

function selectWords(text, amount) {
  let n = 0;
  let list = [];

  while (n < amount){
    let pos = Math.floor(Math.random() * text.length);
    let c = text[pos];
    if (!test(c)) continue;

    // go back to start of the word
    while (test(c)) {
      pos--;
      c = text[pos];
    }
    startpos = pos+1;

    // go to the end of the word
    do {
      pos++;
      c = text[pos];
    } while (test(c));
    endpos = pos;

    if (endpos-startpos <= 3) continue;
    let word = text.substring(startpos,endpos)
    if (list.flat().includes(word)) continue;

    list.push({startpos, endpos, word})
    n++;
  }

  let bruh = text;
  let offset = 0;

  list.sort((a,b) => {return a.startpos>b.startpos})
  list.forEach(e => {
    let chars = [...bruh]
    chars.splice(e.startpos+offset, e.endpos-e.startpos, replaceText)
    bruh = chars.join('')
    offset = bruh.length-text.length;
  });
  return {text: bruh, list};
}

function replaceReplacements(list) {
  let text = main.innerHTML;
  list.forEach((e,i) => {
    let replacement = `<input type="text" value="${e.word}" id="${i}">`;
    let n = text.indexOf(replaceText)

    let chars = [...text]
    chars.splice(n, replaceText.length, replacement)
    bruh = chars.join('')

    text = bruh;
  })
  main.innerHTML = text; 
}
