let carbons = [[1, 1]];
let isInside = false;
cont.addEventListener("mouseenter", () => { isInside = true; });
cont.addEventListener("mouseleave", () => { isInside = false; });
window.addEventListener("click", () => {
    let e = cont.querySelector(":hover");
    if (e !== null) {
        console.log(e);
    }
});