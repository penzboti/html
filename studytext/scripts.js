// #### config
const replaceText = "[replace this]" // note that '<' and '>' produce different html

// #### globals
navbar.style.visibility = "hidden";

let replaceAmount = 10;
let globaltxt = "";
let globallist = [];
let globaltype;

let is_started = false;
let is_check_mode = false;
let strict = document.getElementById("strict").checked;

// #### functions
function start() {
  if (globaltxt === "") {
    alert("no input text detected")
    return;
  }
  hide()

  strict = document.getElementById("strict").checked;
  globaltxt = globaltxt.split('').filter(c => c !== "\r").join("");
  // parse [[links]] and ![[images]]
  globaltxt = globaltxt.split('\n').map(l => {
    if (l.includes('[[') && l.includes(']]')) {
      if (l.includes('png') || l.includes('jpg')) {
        let new_l = "";
        let inside = false;
        for (let i = 1; i < l.length; i++) {
          let prev = l[i-1];
          let cur = l[i]
          if (prev == cur && cur == "[") inside = true
          if (!inside) new_l += cur
          if (prev == cur && cur == "]") {inside = false; new_l = new_l.substring(0,new_l.length-1) + "[image]" }
        }
        l = new_l
      }
      else if (l.includes('|')){
        let new_l = "";
        let inside = false;
        let after = false;
        for (let i = 1; i < l.length; i++) {
          let prev = l[i-1];
          let cur = l[i]
          if (after) new_l += cur
          if (prev == cur && cur == "[") { inside = true; new_l = new_l.substring(0,new_l.length-2) }
          if (inside && cur == "|") { after = true; new_l = new_l.substring(0,new_l.length-2) }
          if (prev == cur && cur == "]") { inside = false; after = false; new_l = new_l.substring(0,new_l.length-2) }
        }
        l = new_l
      }
      else {
        let new_l = "";
        let inside = false;
        for (let i = 1; i < l.length; i++) {
          let prev = l[i-1];
          let cur = l[i]
          if (inside) new_l += cur
          if (prev == cur && cur == "[") { inside = true; new_l = new_l.substring(0,new_l.length-2) }
          if (prev == cur && cur == "]") { inside = false; new_l = new_l.substring(0,new_l.length-2) }
        }
        l = new_l
      }
    }
    return l;
  }).join("\n")

  globaltype = type.value;

  if (globaltype == "normal") {
    let {text,list} = selectWords(globaltxt,replaceAmount)
    globallist=list;
    render(text);
    replaceReplacements(list);
  }
  if (globaltype == "bold" || globaltype == "heading" || globaltype == "bold+heading") {
    render(globaltxt);
    let strongs = [];
    if (globaltype == "bold" || globaltype == "bold+heading") strongs = [...strongs, ...main?.getElementsByTagName("strong")]; 
    if (globaltype == "heading" || globaltype == "bold+heading") strongs = [
      ...strongs,
      ...main?.getElementsByTagName("h1"),
      ...main?.getElementsByTagName("h2"),
      ...main?.getElementsByTagName("h3"),
      ...main?.getElementsByTagName("h4"),
      ...main?.getElementsByTagName("h5"),
      ...main?.getElementsByTagName("h6"),
    ]; 
    // parse
    let all_list = [];
    for (let i = 0; i < strongs.length; i++) {
      let e = strongs[i];
      e.id = i;
      all_list.push({id: i, word: e.innerText})
    }
    // render
    let list = randomRemove(all_list)
    for (let item of list) {
      let e = document.getElementById(item.id);
      let node = document.createElement("input");
      node.id = item.id;
      node.value = item.word;
      e.replaceWith(node)
    }
  }
  if (globaltype == "dates") {
    let {text,list} = selectDates(globaltxt)
    globallist=list;
    render(text);
    replaceReplacements(list);
  }
  is_started = true;
  if ([...main.children].map(e=>[...e.children]).flat().map(e => e.tagName).includes("A")) start();
}

function randomRemove(list) {
  let i = 0;
  let next = 0;
  if (list.length > replaceAmount) list.unshift("")
  while (list.length > replaceAmount) {
    if (next === 0) {
      list.splice(i,1)
      next = Math.floor(Math.random() * list.length)
      i--;
    }
    if (next < 0) next = 1 // console.log debugging didn't solve this issue. must learn real debugging tools (sad)
    if (i > list.length) i = 0;
    i++;
    next--;
  }
  return list
}

function end() {
  popup.style.visibility = "hidden";
  unhide();
  render(globaltxt);
  is_started = false;
  is_end = false;
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

import markdownIt from 'https://cdn.jsdelivr.net/npm/markdown-it@14.1.1/+esm'
const md = markdownIt() // rendering markdown
function render(text) {
  const result = md.render(text)
  main.innerHTML = result;
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

// text
textinput?.addEventListener('change', () => {
  globaltxt = textinput.value;
  render(globaltxt)
})

// amount
amount?.addEventListener('change', () => {
  replaceAmount = amount.value;
})

// #### handling 'quiz'
function test(c) {
  return "0123456789öüóqwertzuiopőúűasdfghjkléáíyxcvbnmQWERTZUIOPŐÚŰÖÜÓASDFGHJKLÉÁÍYXCVBNM".includes(c)
}

function selectWords(text, amount) {
  let n = 0;
  let recursion = 0;
  let list = [];

  while (n < amount){
    recursion++;
    if (recursion > 1000) {
      alert(`note: we only found ${list.length} words to replace`)
      break;
    }
    let pos = Math.floor(Math.random() * text.length);
    let c = text[pos];
    if (!test(c)) continue;

    // go back to start of the word
    while (test(c)) {
      pos--;
      c = text[pos];
    }
    let startpos = pos+1;

    // go to the end of the word
    do {
      pos++;
      c = text[pos];
    } while (test(c));
    let endpos = pos;

    if (endpos-startpos <= 3) continue;
    let word = text.substring(startpos,endpos)
    if (list.some(item => item.word == word)) continue;

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
    let txt = "";
    // txt = e.word;
    let replacement = `<input type="text" value="${txt}" id="${i}">`
    // + `<button onclick="check(${i})" id="${i}b">pipa here</button>`;
    let n = text.indexOf(replaceText)

    let chars = [...text]
    chars.splice(n, replaceText.length, replacement)
    let bruh = chars.join('')

    text = bruh;
  })
  main.innerHTML = text; 
}

// autoload
window.addEventListener('pageshow', () => {
setTimeout(() => {
  if (textinput?.value) {
    globaltxt = textinput.value;
    render(globaltxt);
  }
  else if (fileinput.files?.[0]) {
    const file = fileinput.files?.[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function({ target }) {
      const txt = target.result;
      globaltxt = txt;
      render(globaltxt);
    }
  }

  if (amount.value) {
    replaceAmount = amount.value
  }
}, 50) // because why not pageshow doesnt work like that
});

globalThis["start"] = start
globalThis["end"] = end
globalThis["check"] = check

const allowed_words = ["január","február","március","április","május","június","augusztus","szeptember","október","november","december","jan","feb","márc","ápr","máj","jún","júl","aug","szept","okt","nov","dev"]

function selectDates() {
  let bank = globaltxt.split(' ')
  bank = bank.map(w => w.split('').filter(c => c !== "\r").join(''));
  bank = bank.map(word => {
    let queue = [word]
    let list = []
    while (queue.length !== 0) {
      let w = queue.pop()
      if (w.includes('\n') && w !== "\n") {
        let words = w.match(/[^\n]+|\n/g)
        queue.unshift(...words.reverse())
        continue;
      }
      if (w.includes('\t') && w !== "\t") {
        let words = w.match(/[^\t]+|\t/g)
        queue.unshift(...words.reverse())
        continue;
      }
      list.push(w)
    }
    return list
  }).flat();

  let list = [];
  let curr_list = [];
  for (let i = 0; i < bank.length; i++) {
    const word = bank[i];
    let date_potential = false;
    for (let w of allowed_words) {
      if (word.includes(w)) {
        curr_list.push({i,word,type: "month"})
        date_potential = true
      }
    }
    if (!date_potential && word.split('').every(c => "0123456789.-,:;/".includes(c))) {
      if (word.split('').some(c => "0123456789".includes(c))) {
        curr_list.push({i,word,type: "number"})
        date_potential = true
      }
    }
    if (!date_potential && word.includes("-")) {
      let split = word.split("-");
      if (split[0].split('').some(c => "0123456789".includes(c))) {
        curr_list.push({i,word: split[0],type: "number",additions: `-${split[1]}`})
      }
      date_potential = true
    }

    if ((!date_potential && curr_list.length !== 0) || (date_potential && i == bank.length-1)) {
      if (!curr_list.map(e => e.type).some(t => t === "number")) {
        curr_list = []
        continue
      }
      if (curr_list.length === 1) {
        let d = curr_list[0].word
        if (d.length < 4 || (d.length > 4 && d.substring(0,4).split('').some(c => !"0123456789".includes(c)) && d[4] !== "-" && d[4] !== "/" )) {
          curr_list = []
          continue
        }
      } else {
        if (!curr_list.map(e => e.type).some(t => t === "month")) {
          curr_list = []
          continue
        }
      }
      let date = "";
      let indexes = [];

      for (let e of curr_list) {
        date+=e.word+" ";
        indexes.push(e.i)
      }
      date = date.substring(0,date.length-1)

      let last = curr_list[curr_list.length-1];
      let trailing_char = last.word.split('').pop()
      if ("0123456789.".includes(trailing_char)) trailing_char = null;
      if (last.type == "month") trailing_char = null;
      if (trailing_char) date = date.substring(0,date.length-1)
      if (last.additions) trailing_char = last.additions
      list.push({date,indexes,includes_year: curr_list[0].type === "number",trailing_char})
      curr_list = []
    }
  }

  list = randomRemove(list);

  let removed = 0
  let list_i = 0;
  let list_item = list[list_i]
  if (!list_item) {
    alert("no date detected")
    return {text: globaltxt,list:[]}
  }
  for (let i = 0; i < bank.length; i++) {
    if (i == list_item.indexes[0] - removed) {
      bank.splice(i,1)
      removed++;
      list_item.indexes.splice(0,1)
      if (list_item.indexes.length === 0) {
        removed--;
        bank.splice(i,0,replaceText + (list_item.trailing_char ? list_item.trailing_char : ""))
        list_i++;
        list_item = list[list_i]
        if (!list_item) break
      }
      i--
    }
  }


  let text = bank.reduce((str, a)=> {
    if (a === "\n" || a === "\t") return str+a;
    let last = str[str.length-1];
    if (last === "\n" || last === "\t") return str+a;
    return str+" "+a;
  });

  list = list.map((e,index) => {return {...e,index,word:e.date};})

  return {text, list}
}

let cur_id = 0;

addEventListener("focusout", e => {
  if (!is_started) return;
  let target = e.target;

  if (e.target.nodeName !== "INPUT") return;
  if (e.target.value === "") return;
  cur_id = target.id;
  if (!globallist[cur_id].checked) {
    let bool = e.relatedTarget === document.getElementById(`${cur_id}b`);
    check(cur_id);
    if (bool) document.getElementById(parseInt(cur_id)+1).focus();
  }
})

function check(id) {
  let input = document.getElementById(id);
  let cur = input.value;
  let ans = globallist[id].word;
  if (ans === cur) {
    input.classList.add("green")
    globallist[id].correct = true;
    apply_prev(true)
  }
  else {
    if (strict || cur === "") {
      input.classList.add("red")
      globallist[id].correct = false;
      add_correct(id);
      apply_prev(false)
    } else checkMode(id)
  }
  // document.getElementById(`${id}b`).remove()
  input.readonly = true;
  input.readOnly = true;

  globallist[id].checked = true;
  input.classList.add("checked")
  if (!is_check_mode && globallist.every(e => e.checked)) {
    end_popup();
  }
}

const popup = document.getElementById("popup");
popup.style.visibility = "hidden";
const popupTitle = document.getElementById("pop-title");
const popupAns = document.getElementById("pop-answer");
const popupCor = document.getElementById("pop-correct");
const popupLegend = document.getElementById("pop-legend");
const legend_text_check = "[T] mark correct ; [F] mark wrong";
function checkMode(id) {
  is_check_mode = true;
  popup.style.visibility = "visible";
  let input = document.getElementById(id);
  let cur = input.value;
  popupAns.innerText = cur;
  let ans = globallist[id].word;
  popupCor.innerText = ans;
  popupLegend.innerText = legend_text_check;
  popupTitle.innerText = "Check word";
}

const legend_text_end = "[T] new quiz ; [F] stay";
let is_end = false;
function end_popup() {
  is_end = true;
  popup.style.visibility = "visible";
  let n = globallist.map(e => e.correct).filter(e => e).length;
  popupAns.innerText = `${n} jó / ${globallist.length}`
  popupCor.innerText = `${n/globallist.length * 100}%`;
  popupLegend.innerText = legend_text_end;
  popupTitle.innerText = "End of quiz";
}

function add_correct(id) {
  let anchor = document.getElementById(id);
  let node = document.createElement("random_element_here");
  node.innerText = globallist[id].word;
  node.classList.add("green")
  anchor.insertAdjacentElement("afterend",node);
}

window.addEventListener("keypress", e => {
  if (!is_started) return;
  let id = cur_id
  let input = document.getElementById(id)
  if (is_check_mode) {
    e.preventDefault();
    if (e.key === "t" || e.key === "T") {
      input.classList.add("green")
      globallist[id].correct = true;
      is_check_mode = false;
      popup.style.visibility = "hidden";
      apply_prev(true)
    }
    if (e.key === "f" || e.key === "F") {
      input.classList.add("red")
      globallist[id].correct = false;
      is_check_mode = false;
      popup.style.visibility = "hidden";
      add_correct(id);
      apply_prev(false)
    }
    if (globallist.every(e => e.checked)) {
      end_popup();
    }
    return;
  }
  if (is_end) {
    if (e.key === "Enter") {
      end();
    }
    if (e.key === "f" || e.key === "F") {
      popup.style.visibility = "hidden";
    }
    if (e.key === "t" || e.key === "T") {
      end();
    }
    return;
  }
  if (e.key === "Escape") {
    end()
    return;
  }
  let target = e.target;
  if (e.target.nodeName !== "INPUT") return;
  if (e.key === "Enter") {
    cur_id = parseInt(target.id)
    if (!globallist[cur_id].checked) check(cur_id);
    if (!e.shiftKey) document.getElementById(cur_id+1).focus();
  }
})

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    end()
  }
})

function apply_prev(correct) {
  // currently shows the input id you checked
  //? maybe it should show the current input always
  document.getElementById("prev").innerText = `${correct ? "Correct" : "Incorrect"} : ${cur_id+1}/${globallist.length}`;
}
