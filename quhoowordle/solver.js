// assigning basic variables
var words_split0 = "ablak, agyag, agyar, ajánl, akció, aktív, alany, album, amőba, angol, anyag, anyós, apród, apály, arany, arasz, aroma, arzén, arány, aréna, audio, álarc, állat, árkád, ártér, árvíz, árbóc, bacon, balta, balti, banda, banán, barna, barát, beteg, beton, bodza, bogyó, bogár, bohóc, bolha, bomba, bronz, bálna, búvár, cetli, chili, chips, cukor, cékla, doboz, dzsem, dátum, dízel, dobat, ecset, email, ember, emelő, emlék, emlős, extra, ezüst, fahéj, fazék, fenyő, fertő, festő, firka, fogas, folyó, fonal, fotel, fáraó, férfi, fórum, főnix, fülke, fürdő, füzet, gatya, gazda, golyó, gomba, grill, gödör, gyors, gyufa, gyula, gyári, gyárt, gyász, gyáva, halál, hamis, hinta, hintó, homok, homár, hétfő, hévíz, hónap, index, indok, iroda, isler, jacht, joker, juhar, járda, jármű, kabin, kabát, kacsa, kajak, kakas, kakaó, kalap, kalóz, kanna, kanál, kanóc, kapor, keksz, kerék, kifli, kosár, kukac, kulcs, kupon, kutya, kvarc, kígyó, kórus, körte, körző, körít, kötél, labda, lábos, labor, lakat, lakás, lapát, lecke, lepke, leves, liget, lámpa, magma, magnó, majom, malac, malom, mangó, maszk, medve, medál, meggy, metró, mikró, mobil, málna, műsor, napló, nyelv, oltár, oltás, opera, orvos, oázis, óceán, ördög, ötlet, pacal, padló, pajta, pajzs, pamut, peron, plüss, pokol, polip, ponty, puska, pálca, párna, póker, radar, rádió, radír, repce, robot, sapka, sarló, sarok, seprű, sereg, sisak, sport, spóra, sugár, sáska, sátor, szaft, szoba, széna, szóda, szőlő, szörp, tabló, tajga, tamás, tanya, tanár, tarja, tarka, taréj, tasak, tehén, teknő, tepsi, toboz, tojás, torma, tálca, tárca, tócsa, tölgy, töltő, tömeg, tömlő, törpe, törzs, túzok, udvar, unoka, úszás, vacok, vagon, vasút, veréb, videó, vidra, vihar, villa, világ, viola, virág, vitéz, vodka, volán, vádli, vírus, vödör, völgy, vörös, zabla, zokni, zuzmó, zálog, zacsi, zsalu, zsaru, zselé, zsepi, zsűri"
var possible = [];
var possible_split = [];


function start() {
    // this runs at the start, and at every restart
    // resets inputs, divs, and "won"

    document.getElementById("words").innerHTML = "";
    document.getElementById("guess").value = "";
    document.getElementById("feedback").innerHTML = "";
    feedback = ["w", "w", "w", "w", "w"]
    won = false;

    // resets possible words too
    possible = [];
    var words_split1;
    words_split1 = words_split0.split(", ");
    words_split1.forEach(element => {
        possible.push(element);
    });
}


var won;
function guessWord() {
    // only runs if the lettercount is 5

    if (document.getElementById("guess").value.length == 5) {
    
    console.log(possible, 1);
    wordEliminator();
    // this is an async function because these need to be run after wordEliminator();
    // ? why does this work when the function isnt async?
    if (!possible.length == 0) {
        if (!won){
            possible.forEach(element => {
                addPossibleWord(element);
            });
        }
    } else {
        // if no words, tells no words
        addPossibleWord("Nincs több helyes szó!", false)
    }
    console.log(possible, 2);
    
    }
}

var guess;
var guess_split;
var feedback;
function wordEliminator() {
    // eliminates words by the wordle rules

    // resets the input for next guess
    document.getElementById("guess").value = "";
    // also resets possible words
    document.getElementById("words").innerHTML = "";

    // splits every word in the possible array to charachters
    possible_split = [];
    possible.forEach(element => {
        words_split2 = element.split("");
        possible_split.push(words_split2);
    });

    // eliminates the words.
    for(w=possible.length-1; 0<=w; w--) {
        for(i=0; i<5; i++) {
            // explaining everything here is hard, so ill just skip it
            if(feedback[i] == "w" && possible[w].includes(guess_split[i])) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
            else if(feedback[i] == "g" && guess_split[i] !== possible_split[w][i]) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
            else if(feedback[i] == "y" && !possible[w].includes(guess_split[i])) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }

            else if(feedback[i] == "y" && guess_split[i] == possible_split[w][i]) {
                possible.splice(possible.indexOf(possible[w]), 1);
                break;
            }
        }
    } 

    // if feedback is all green, it tells you, you won
    if (feedback.every((val, i, arr) => val === "g")) {
        addPossibleWord("Eltaláltad!", false);
        won = true;
    }

    // also resets feedback
    feedback = ["w", "w", "w", "w", "w"]
    document.getElementById("feedback").innerHTML = "";
}

function addPossibleWord(word, clickable) {
    // adds possible words to the div

    const node = document.createElement("p");
    node.innerText = word;
    node.classList.add("word");
    
    // some messages dont need to be easily chosen, only runs if undefined
    if (typeof(clickable) == "undefined") {
        node.setAttribute("onclick",'easyChoose("'+word+'")');
    }
    document.getElementById("words").appendChild(node);
}

function easyChoose(word) {
    // lets you click on a word, and select it easily
    
    document.getElementById("guess").value = word;
    updateFeedback();
}


document.addEventListener("keyup", (event) => {
    // run at every key stopped being held

    var length = document.getElementById("guess").value.length;
    if (length != 0) {
        // this tells you if you have more or less letters than you should do
        document.getElementById("words").innerHTML = "";
        if (length < 5){
            addPossibleWord("Túl kevés betű!", false);
        } else if (length > 5) {
            addPossibleWord("Túl sok betű!", false);
        }
    }

    // if you press enter, the guessing will start
    if (event.key == "Enter"){
        guessWord();
    }

    // and updates feedback
    updateFeedback();
});

function updateFeedback() {
    // resets, then updates the feedback

    document.getElementById("feedback").innerHTML = "";
    guess = document.getElementById("guess").value.toLowerCase();
    guess_split = guess.split("");

    // adds every letter to feedback div. Never adds more then 5
    // ? this isnt really nescecary because it doesnt allow you to send it unless its five letters, but ok
    length = guess.length-1; if (length > 4) { length = 4; };
    for(i=0; i<=length; i++) {
        addFeedbackLetter(guess_split[i], i);
    }
}

function addFeedbackLetter(letter, position) {
    // adds the letters to the div
    // also adds the text, class, and onclick func

    const node = document.createElement("p");
    node.innerText = letter;
    node.classList.add("letter", "letter-white")
    node.setAttribute("onclick",'feedbackToggler('+position+')');
    node.id = position;

    document.getElementById("feedback").appendChild(node);
}

var classWh;
var classYl;
var classGr;
function feedbackToggler(id) {
    // Toggles letter colors
    // also changes the colors in the feedback array

    e = document.getElementById(id).classList;
    classWh = e.contains("letter-white");
    classYl = e.contains("letter-yellow");
    classGr = e.contains("letter-green");

    if (classWh == true) {
        e.replace("letter-white", "letter-yellow");
        feedback[id] = "y";
    }
    else if (classYl == true) {
        e.replace("letter-yellow", "letter-green");
        feedback[id] = "g";
    }
    else if (classGr == true) {
        e.replace("letter-green", "letter-white");
        feedback[id] = "w";
    }
}


// starts the entire thing
start();

// ! styling --> 2.0
// ! languages --> 3.0