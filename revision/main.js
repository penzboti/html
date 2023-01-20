var alertCont = document.getElementById("alertCont");
var alerttext = document.getElementById("alertText");
function myAlert(message, time) {
    // custom alert!

    if (alertCont.style.visibility == "hidden") {
    alerttext.innerHTML = message;
    alertCont.style.opacity = 1;
    alertCont.style.visibility='visible';
    setTimeout(() => {hideAlert()}, time*1000);
    }
}

function hideAlert() {
    alertCont.style.opacity = 0;
    setTimeout(function(){alertCont.style.visibility='hidden';}, 300);
}


var input = document.getElementById("input");
var save;
var saveQuestion;
var saveAnswer;
var upload = "";
function saveFile() {
    // saving data

    save = input.value;
    if (save != "") {
        if (upload != "") {
            upload += " | " + save;
        } else {
            upload += save;
        }
    }
    input.value = "";
    // add helping guidelines
    // like: "input the answer"
}


var loadPath = "text.txt";
var result;
var displaytext;
var mainTXT = document.getElementById("main");
function loadFile(silent ,callback) {
    // loading data

    var count4display = 0;
    $.when(
        $.get(
            loadPath, function(data) {
                result = data.split(" | ");
            }
            )).done(function(){
        result.forEach(element => {
            count4display++;
            if (count4display != 1){
                displaytext = displaytext + element + "<br>";
            } else {
                displaytext = element + "<br>";
            }
        });
        if (typeof silent == "undefined") {
            mainTXT.innerHTML = displaytext;
            myAlert("File loaded!", 3);
        }
        if (typeof callback != "undefined") {
            callback();
        }
        displaytext = "";
    });
    return true;
}



var quiz = [];
var count = 0;
var correct = [];
function kviz() {
    // the quiz

    q = [];
    count = 0;
    correct = [];
    result.forEach(element => {
        q.push(element.split(": "));
    });
    count = q.length;
    var n = Math.floor(Math.random() * (q.length));
    if (count != 0) {
        mainTXT.innerHTML = q[n][0];
        input.addEventListener("keydown", function(key) {
            if (key.code == "Enter") {
                if (input.value == q[n][1]) {
                    // ignore error on the line above.
                    correct.push([n, "correct"]);
                } else {
                    correct.push([n, "incorrect"]);
                }
                input.value = "";
                mainTXT.innerHTML = "";
                q.splice(n, 1);
            count--;
            kviz();
        }
    });
    } else {
        var count4display = 0;
        myAlert("Quiz ended!", 5);
        correct.forEach(element => {
            count4display++;
            if (count4display != 1){
                displaytext = displaytext + result[element[0]] + " -> " + element[1] + "<br>";
            } else {
                displaytext = result[element[0]] + " -> " + element[1] + "<br>"
            }
        });
        mainTXT.innerHTML = displaytext;
    }
    displaytext = "";
    return;
}

// ? change myalert to customalert

// idea from https://github.com/conaticus/spaced-repetition
// note, he used electron  - https://www.electronjs.org/