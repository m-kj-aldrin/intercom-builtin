import { MODULE_TYPES } from "../internal/Module.js";

const contextMenuTemplate = `
<style>
    :host {
        background-color: white;
        padding: 4px;
        position: absolute;

        border-radius: 2px;
        border: 1px var(--border-color) solid;
        box-shadow: 0 0 8px 4px hsl(0 0% 0% / 0.025);
        z-index: 100;
    }

    :host([type="chain"]) { }

    div {
        display: flex;
        gap: 2px;
    }
</style>
<div><div>
`;

let boundOutsideClickHandler;

function outsideClickHandler(e) {
    if (e.target == this) return;
    this._target.removeAttribute("context-target");
    this.remove();
    window.removeEventListener("pointerdown", boundOutsideClickHandler);
}

export class MenuContext extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = contextMenuTemplate;

        window.addEventListener(
            "pointerdown",
            (boundOutsideClickHandler = outsideClickHandler.bind(this))
        );

        /**@private */
        this._target = null;
    }

    /**
     * @param {{[name in string]:{type:string,value:any,action:(value:any)=>void}}} o
     */
    configureActions(o) {
        let els = [];
        for (const name in o) {
            const actionOpt = o[name];
            let el = null;
            switch (actionOpt.type) {
                case "button":
                    el = document.createElement(`input-${actionOpt.type}`);
                    el.textContent = name;
                    el.value = actionOpt.value;
                    break;

                case "select":
                    el = document.createElement("input-select");
                    el.list = actionOpt.value;
            }
            el.setAttribute("data-action", name);
            els.push(el);
        }

        this.shadowRoot.addEventListener("change", (e) => {
            const action = o[e.target.getAttribute("data-action")].action;
            action(e.target.value);
            this._target.removeAttribute("context-target");
            this.remove();
        });

        this.shadowRoot.querySelector("div").innerHTML = "";
        this.shadowRoot.querySelector("div").append(...els);
    }

    /**@param {HTMLElement} t */
    set contextTarget(t) {
        this._target = t;
        t.toggleAttribute("context-target", true);
    }
}
