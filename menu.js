/**@param {import("./drag").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
  e.preventDefault();
  console.log(e.target);
  e.target.toggleAttribute("open");
}

document.body.addEventListener("contextmenu", contextHandler);
