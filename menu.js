/**@param {import("./drag").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
  e.preventDefault();
  document.body
    .querySelectorAll("[open]")
    .forEach((el) => el.removeAttribute("open"));

  e.target.toggleAttribute("open");

  window.onclick = (ev) => {
    if (e.target != ev.target) {
      e.target.removeAttribute("open");
      window.onclick = null;
    }
  };
}

document.body.addEventListener("contextmenu", contextHandler);
