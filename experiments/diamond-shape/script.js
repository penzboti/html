var e = document.getElementById('main');

width = e.clientWidth;
if (width % 2 == 1) {
    width = (width-1)/ 4 -1;
} else {
    width = width / 4 -1;
}
var spaces = (width - 1) / 2;
var between = -1;
var backwards = false;

function vmi() {
    
    var text = "";
    
    // spaces before
    for(i=0; i<spaces; i++) {
        text+="&nbsp;";
    }
    // x
    text+="x";
    // spaces between (if not first)
    if(between != -1) {
        for(i=0; i<between; i++) {
            text+="&nbsp;";
        }
    // x (if not first)
        text+="x";
    }
    // last spaces just for funsies
    for(i=0; i<spaces; i++) {
        text+="&nbsp;";
    }


    // changing variables
    if (backwards)
    {
        spaces++;
        between -= 2;
    }
    else {
        spaces--;
        between += 2;
    }

    
    // checking if backwards or not
    if (spaces > (width - 1) / 2)
    {
        spaces = (width - 1) / 2 -2;
        backwards = false;
        between += 4;
    }
    if (spaces <= -1)
    {
        spaces += 2;
        backwards = true;
        between = width;
        between -= 4;
    }

    // write
    const newNode = document.createElement("p");
    newNode.insertAdjacentHTML("beforeend", `${text}`);
    e.appendChild(newNode);

    if(e.childElementCount > screen.height/ 4 -1) {
        e.removeChild(e.children[0]);
    }

    window.scrollTo(0, document.body.scrollHeight);

    setTimeout(() => { vmi(); }, 10);

    // Józsuf birthday jan15
}

vmi();