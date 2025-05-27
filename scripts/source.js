// just plug this file anywhere you want a source button to appear

let body = document.getElementsByTagName("body")[0];
let node = document.createElement("p");

node.innerHTML = "Source on <a href='https://github.com/penzboti/html'>GitHub</a>";
node.id = "source";

node.style.position = "fixed";
node.style.top = "100dvh"
node.style.left = "0px";
node.style.transform = "translate(5%, -200%)";
node.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
// https://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
node.style.color = window.getComputedStyle(body).getPropertyValue("background-color") == "rgba(0, 0, 0, 0)" ? "black" : "white";
node.style.left = "0";

body.appendChild(node);