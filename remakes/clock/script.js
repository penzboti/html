// idea from https://qlocktwo.com 
// they redesigned their webpage once, but internet archive saved me here
// helped me write the activating cells code
// https://web.archive.org/web/20230323083431/https://qlocktwo.com/us/timecheck?___from_store=de&color=Metamorphite&controls=false&language=EN&size=600

// this is the english version.
// next step is a hungarian one.
const EnClockface = [
    "itlisasampm",
    "acquarterdc",
    "twentyfivex",
    "halfstenfto",
    "pasterunine",
    "onesixthree",
    "fourfivetwo",
    "eighteleven",
    "seventwelve",
    "tenseoclock"
];

// populating the cells and starting the timer work after loading the page
function loadPage() {
    // clearing the content
    content.innerHTML = "";
    let face = EnClockface;
    // this is where we will check for the hungarian one (later)

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
}

// this map makes it readable in code when we reference these things
const EnMap = {
    "it is": ["0-0", "0-1", "0-3", "0-4"],
    "01h": ["5-0", "5-1", "5-2"],
    "02h": ["6-8", "6-9", "6-10"],
    "03h": ["5-6", "5-7", "5-8", "5-9", "5-10"],
    "04h": ["6-0", "6-1", "6-2", "6-3"],
    "05h": ["6-4", "6-5", "6-6", "6-7"],
    "06h": ["5-3", "5-4", "5-5"],
    "07h": ["8-0", "8-1", "8-2", "8-3", "8-4"],
    "08h": ["7-0", "7-1", "7-2", "7-3", "7-4"],
    "09h": ["4-7", "4-8", "4-9", "4-10"],
    "10h": ["9-0", "9-1", "9-2"],
    "11h": ["7-5", "7-6", "7-7", "7-8", "7-9", "7-10"],
    "00h": ["8-5", "8-6", "8-7", "8-8", "8-9", "8-10"],
    "00m": ["9-5", "9-6", "9-7", "9-8", "9-9", "9-10"], // o'clock
    "05m": ["2-6", "2-7", "2-8", "2-9"], // these numbers will be both 'from' & 'to'
    "10m": ["3-5", "3-6", "3-7"],
    "15m": ["1-0", "1-2", "1-3", "1-4", "1-5", "1-6", "1-7", "1-8"],
    "20m": ["2-0", "2-1", "2-2", "2-3", "2-4", "2-5"],
    "25m": ["2-0", "2-1", "2-2", "2-3", "2-4", "2-5", "2-6", "2-7", "2-8", "2-9"],
    "30m": ["3-0", "3-1", "3-2", "3-3"], // half
    "past": ["4-0", "4-1", "4-2", "4-3"],
    "to": ["3-9", "3-10"],
}

function loadTime(hour, minute) {
    const map = EnMap;
    // future language check

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
    if (minute <= 31 && relativeMin != 0) toggleList.push(...map["past"]);
    else if (minute > 31 && relativeMin != 0) toggleList.push(...map["to"]);

    //* hour
    let relativeHour = hour;
    // we need to add one when it switches from "past" to "to"
    if (minute > 31) relativeHour++;
    // we only go up to 12, but basically we use american time. 0 = 12.
    relativeHour = relativeHour%12;
    // we get a string from it ...
    let hourString = parseInt(relativeHour) + "h";
    if (relativeHour < 10) hourString = `0${hourString}`;
    toggleList.push(...map[hourString]);
    // console.log(hour, relativeHour, hourString);

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
// the page initially triggers focues event! so now this
//* starts the site
window.addEventListener("focus", e => {
    // to not run timeout multiple times
    clearTimeout(timeout);
    handleTimeCall();
})

// starting the page
loadPage();

//* you are able to test it :) if you uncomment this
// let h = 0; let m = 0;
// function test() {
//     loadTime(h, m);
//     m++;
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