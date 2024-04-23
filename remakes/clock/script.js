// idea from https://qlocktwo.com 
// they redesigned their webpage once, but internet archive saved me here
// helped me write the activating cells code
// https://web.archive.org/web/20230323083431/https://qlocktwo.com/us/timecheck?___from_store=de&color=Metamorphite&controls=false&language=EN&size=600

// language and language switching
let lang = "";

document.getElementById("lang").addEventListener("change", e => {
    const prevlang = lang;
    lang = document.getElementById("lang").value;
    if (prevlang != lang) {
        loadPage();
    }
});

// populating the cells and starting the timer work after loading the page
function loadPage() {
    // clearing the content
    content.innerHTML = "";
    let face = [];
    switch (lang) {
        case "de":
            face = DeClockface;
            break;
        case "eng":
            face = EnClockface;
            break;
    }

    // basic createlement & appendchild & id work
    for(i = 0; i < face.length; i++){
        const e = face[i];
        const rownode = document.createElement("div");
        rownode.classList.add("row");
        rownode.id = e;
        content.appendChild(rownode);
        for(j = 0; j < e.length; j++){
            const c = e[j];
            const node = document.createElement("p");
            node.innerText = c.toUpperCase();
            node.id = `${i}-${j}`;
            document.getElementById(e).appendChild(node);
        }
    }

    handleTimeCall();
}

function loadTime(hour, minute) {
    let map = {};
    switch (lang) {
        case "de":
            map = DeMap;
            break;
        case "eng":
            map = EnMap;
            break;
    }

    // clear previous
    clearActiveCells();

    // we have a list that has all the active elements
    let toggleList = [];
    toggleList.push(...map["it is"]);

    //* minute
    // we have 5 minute intervals and after thats done it switches
    let relativeMin = minute - minute%5;
    // switches at relative 2:00 minutes instead of 2:30 to make it easier for me
    if (minute%5 > 1) relativeMin+=5; 
    // halftime is a special case
    if (relativeMin != 30) relativeMin = relativeMin%30;
    // after half time we invert the relative minutes ("past" -> "to")
    if (minute > 31) relativeMin = 30 - relativeMin;
    if (minute > 31 && relativeMin == 30) relativeMin = 0;
    // we get a string from it to get the correct one from the map
    let minuteString = parseInt(relativeMin) + "m";
    if (relativeMin < 10) minuteString = `0${minuteString}`;
    toggleList.push(...map[minuteString]);
    // console.log(minute, relativeMin, minuteString);

    // "past" or "to"
    switch (lang) {
        case "de":
            if (relativeMin > 21 && relativeMin < 27 && minute < 27) toggleList.push(...map["to"]); 
            else if ((minute <= 26 && relativeMin != 0) || (relativeMin > 21 && relativeMin < 27)) toggleList.push(...map["past"]);
            else if (minute > 31 && relativeMin != 0) toggleList.push(...map["to"]);
            break;
        case "eng":
            if (minute <= 31 && relativeMin != 0) toggleList.push(...map["past"]);
            else if (minute > 31 && relativeMin != 0) toggleList.push(...map["to"]);
            break;
    }

    //* hour
    let relativeHour = hour;
    // we need to add one when it switches from "past" to "to"
    if (minute > 26) relativeHour++;
    if (lang == "de" && relativeMin > 21 && relativeMin < 27) {
        if (minute < 32) relativeHour++;
        toggleList.push(...map["30m"]);
    }

    // we only go up to 12, but basically we use american time. 0 = 12.
    relativeHour = relativeHour%12;
    // we get a string from it ...
    let hourString = parseInt(relativeHour) + "h";
    if (relativeHour < 10) hourString = `0${hourString}`;
    toggleList.push(...map[hourString]);
    // console.log(hour, relativeHour, hourString);

    if (lang == "de" && relativeMin != 0 && relativeHour == 1) toggleList.push(...map["01h**m"]);

    // we activate the cells in the list
    toggleList.forEach(id => {
        document.getElementById(id).classList.add("active");
    })
}

// clearing any active cell
function clearActiveCells() {
    Array.from(content.children).forEach(e => {
        Array.from(e.children).forEach(f => {
            f.classList.remove("active");
        })
    })
}

let timeout;
function handleTimeCall() {
    // this calls the loadTime
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    loadTime(hour, minute);
    
    // we have to go minute by minute
    // but on pageload you might not be on a perfect minute switch
    // so we also calculate the difference if there is one
    let second = date.getSeconds();
    let relativeCallTime = (60-second)*1000;
    // stop infinite loops from happening
    // (altough it is prob an edge case if the millisecond is 000)
    if (relativeCallTime == 0) relativeCallTime = 60000;
    // console.log(second, relativeCallTime);
    timeout = window.setTimeout(() => {handleTimeCall()}, relativeCallTime);
}

// if javascript ever stops working in the background, it might not update.
// so we update when the window state changes to focused
// initially it might not trigger.
window.addEventListener("focus", e => {
    // to not run timeout multiple times
    clearTimeout(timeout);
    handleTimeCall();
})

// starting the page
document.getElementById("lang").value = "eng";
lang = "eng";
loadPage();

//* you are able to test it :) if you uncomment this
// let h = 0; let m = 0;
// function test() {
//     loadTime(h, m);
//     m+=5;
//     if (m == 60) {
//         h++;
//         m = 0;
//     }
//     if (h == 24) {
//         h = 0;
//     }
// }
// document.addEventListener("keypress", (e) => {
//     if (e.key == " ") {
//         test();
//     }
// })