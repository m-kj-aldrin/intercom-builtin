import { COMChain } from "./app.js";

/**@param {import("./drag").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
    e.preventDefault();
    // document.body
    //   .querySelectorAll("[open]")
    //   .forEach((el) => el.removeAttribute("open"));

    // e.target.toggleAttribute("open");

    // window.onclick = (ev) => {
    //   if (e.target != ev.target) {
    //     e.target.removeAttribute("open");
    //     window.onclick = null;
    //   }
    // };

    if (e.target instanceof COMChain) {
        chainMenu(e);
    }
}

/**@param {MouseEvent & {target:COMChain}} e */
function chainMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu");
    menu.setAttribute("type", "chain");

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.onclick = (ev) => {
        e.target.addModule("LFO");
        menu.remove();
    };

    menu.innerHTML = `
    <button>add m</button>
    `;

    document.body.appendChild(menu);
}

document.body.addEventListener("contextmenu", contextHandler);
