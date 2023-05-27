const hajoLista = [
    "bismarck", "G-101", "gneisenau" ,"könig", "nassau", "t-22", "v25", "V-170", "von der tawn"
]

let cont = document.getElementById("talalatok-cont");

document.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        kereses(searchbar.value);
    }
})

function kereses(keresett) {
    let i = 0;
    hajoLista.forEach(hajo => {
        if (hajo.toLowerCase() == keresett.toLowerCase()) {
            if (location.href.includes("index.html")) {
                location.href = location.href.substring(0, location.href.indexOf("/index.html")) + `/Hajók/${hajo}.html`;
            } else {
                location.href = location.href + `/Hajók/${hajo}.html`;
            }
        }
        else {
            i++;
        }
    });
    if (i == hajoLista.length) {
        alert("Nincs ilyen hajó!");
    }   
}

function talalatok() {
    cont.innerHTML = "";
    for(i = 0; i < hajoLista.length; i++){
        let hajo = hajoLista[i].toLowerCase();
        if (hajo.includes(searchbar.value.toLowerCase())) {
            talalatKeszito(hajoLista[i])
        }
    }
}

function talalatKeszito(talalat) {
    let node = document.createElement("div");
    node.innerText = talalat;
    node.classList.toggle("talalat");
    node.onclick = function() { kereses(talalat); };
    cont.appendChild(node);
}