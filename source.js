let body = document.getElementsByTagName("body")[0];
let node = document.createElement("p");
node.innerHTML = "Source on <a href='https://github.com/penzboti/html'>GitHub</a>";
node.style.position = "fixed";
node.style.top = "100svh"
node.style.transform = "translate(5%, -200%)";
// https://stackoverflow.com/questions/6338217/get-a-css-value-with-javascript
node.style.color = window.getComputedStyle(body).getPropertyValue("background-color") == "rgba(0, 0, 0, 0)" ? "black" : "white";
node.style.left = "0";
node.id = "source";
body.appendChild(node);