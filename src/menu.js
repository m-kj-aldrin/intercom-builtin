import COMChain from "./elements/internal/Chain.js";

/**@param {import("./drag.js").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
    e.preventDefault();

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
