// moving plane
let mouseDown = false;
let posx = window.innerWidth / 2;
let posy = window.innerHeight / 2;

cont.style.left = `${posx}px`;
cont.style.top = `${posy}px`;

window.addEventListener("mousedown", (e) => { mouseDown = true; });
window.addEventListener("mouseup", (e) => { mouseDown = false; });

window.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        if (posx + e.movementX >! window.innerWidth && posy + e.movementY >! window.innerHeight) {
            posx += e.movementX / cont.style.zoom;
            posy += e.movementY / cont.style.zoom;
        }

        cont.style.left = `${posx}px`;
        cont.style.top = `${posy}px`;
    }
});

// zooming
cont.style.zoom = 1;

function zoom(direction) {
    switch(direction) {
        case "+":
            cont.style.zoom = parseInt(cont.style.zoom) + 1;
            break;
        case "-":
            if (!(cont.style.zoom - 1 < 1)) {
                cont.style.zoom -= 1;
            } else {
                alert("too smol!");
            }
            break;
        default:
            console.error("welp there is no case for this >", direction)
            break;
    }
}