import COMChain from "./elements/internal/Chain.js";
import COMModule, { MODULE_TYPES } from "./elements/internal/Module.js";
import COMNetwork from "./elements/internal/Network.js";
import COMOut from "./elements/internal/Out.js";

import "./elements/menu/index.js";

/**@param {import("./drag.js").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
    e.preventDefault();

    document.querySelector("menu-context")?.remove();

    if (e.target instanceof COMNetwork) {
        networkMenu(e);
    }

    if (e.target instanceof COMChain) {
        chainMenu(e);
    }

    if (e.target instanceof COMModule) {
        moduleMenu(e);
    }

    if (e.target instanceof COMOut) {
        outMenu(e);
    }
}

/**@param {MouseEvent & {target:COMNetwork}} e */
function networkMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu-context");
    menu.setAttribute("type", "chain");

    menu.configureActions({
        "+": {
            type: "button",
            value: "add chain",
            action: (value) => {
                e.target.addChain();
            },
        },
    });

    menu.contextTarget = e.target;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.body.appendChild(menu);
}

/**@param {MouseEvent & {target:COMChain}} e */
function chainMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu-context");
    menu.setAttribute("type", "chain");

    menu.configureActions({
        "add module": {
            type: "select",
            value: ["+", ...Object.keys(MODULE_TYPES)],
            action: (value) => {
                e.target.addModule(value);
            },
        },
        "-": {
            type: "button",
            value: "remove chain",
            action: (value) => {
                e.target.remove();
            },
        },
    });

    menu.contextTarget = e.target;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.body.appendChild(menu);
}

/**@param {MouseEvent & {target:COMModule}} e */
function moduleMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu-context");
    menu.setAttribute("type", "module");

    menu.configureActions({
        "+": {
            type: "button",
            value: "add out",
            action: (value) => {
                e.target.addOut();
            },
        },
        "-": {
            type: "button",
            value: "remove module",
            action: (value) => {
                e.target.remove();
            },
        },
    });
    menu.contextTarget = e.target;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.body.appendChild(menu);
}

/**@param {MouseEvent & {target:COMOut}} e */
function outMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu-context");
    menu.setAttribute("type", "module");

    menu.configureActions({
        "-": {
            type: "button",
            value: "remove out",
            action: (value) => {
                e.target.remove();
            },
        },
    });

    menu.contextTarget = e.target;

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    document.body.appendChild(menu);
}

document.body.addEventListener("contextmenu", contextHandler);
