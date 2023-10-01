import COMChain from "./elements/internal/Chain.js";
import COMModule, { MODULE_TYPES } from "./elements/internal/Module.js";
import COMOut from "./elements/internal/Out.js";

/**@param {import("./drag.js").HTMLEvent<MouseEvent>} e */
function contextHandler(e) {
    e.preventDefault();

    document.querySelector("menu")?.remove();

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

const moduleTypeNames = Object.keys(MODULE_TYPES);

const chainTemplate = `
    <div>
        ${moduleTypeNames
            .map(
                (name, i) =>
                    `<input type="button" value="${name}" data-idx="${i}" />`
            )
            .join("\n")}
    </div>
    <input type="button" value="remove" />
`;

/**@param {MouseEvent & {target:COMChain}} e */
function chainMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu");
    menu.setAttribute("type", "chain");

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.onclick = (ev) => {
        const value = ev.target.value;
        if (!value) return;
        switch (value) {
            case "remove":
                e.target.remove();
                break;
            default:
                e.target.addModule(value);
        }
        menu.remove();
    };

    menu.innerHTML = chainTemplate;

    document.body.appendChild(menu);

    window.onpointerdown = (ee) => {
        if (ee.target.closest("menu") != menu) {
            menu.remove();
            window.onpointerdown = null;
        }
    };
}

const moduleTemplate = `
    <input type="button" value="add out" />
    <input type="button" value="remove" />
`;

/**@param {MouseEvent & {target:COMModule}} e */
function moduleMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu");
    menu.setAttribute("type", "module");

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.innerHTML = moduleTemplate;

    menu.onclick = (ev) => {
        const value = ev.target.value;
        if (!value) return;

        switch (value) {
            case "add out":
                e.target.addOut();
                break;
            case "remove":
                e.target.remove();
                break;
        }

        menu.remove();
    };

    document.body.appendChild(menu);

    window.onpointerdown = (ee) => {
        if (ee.target.closest("menu") != menu) {
            menu.remove();
            window.onpointerdown = null;
        }
    };
}

const outTemplate = `
    <input type="button" value="remove" />
`;

/**@param {MouseEvent & {target:COMOut}} e */
function outMenu(e) {
    const x = e.clientX;
    const y = e.clientY;
    const menu = document.createElement("menu");
    menu.setAttribute("type", "module");

    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    menu.innerHTML = outTemplate;

    menu.onclick = (ev) => {
        const value = ev.target.value;
        if (!value) return;

        switch (value) {
            case "remove":
                e.target.remove();
        }

        menu.remove();
    };

    document.body.appendChild(menu);

    window.onpointerdown = (ee) => {
        if (ee.target.closest("menu") != menu) {
            menu.remove();
            window.onpointerdown = null;
        }
    };
}

document.body.addEventListener("contextmenu", contextHandler);
