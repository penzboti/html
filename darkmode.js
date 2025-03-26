// let storage = window.localStorage.getItem("dark");

if (
  // https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.getElementsByTagName("body")[0].style["color-scheme"] = "dark";
  dark.innerText = "ligth";
}

// Q: localstorage prev state?
// but then you would have to pass it on to code-translation redirect site
// if (storage === null) {
//   let target = dark.innerText !== "dark" ? "dark" : "light";
//   window.localStorage.setItem("dark", target);
//   storage = target;
// }

dark.addEventListener("click", (e) => {
  let cur = document.getElementsByTagName("body")[0].style["color-scheme"];
  let target = cur !== "dark" ? "dark" : "light";
  document.getElementsByTagName("body")[0].style["color-scheme"] = target;
  e.target.innerText = cur;
  // window.localStorage.setItem("dark", target);
});
