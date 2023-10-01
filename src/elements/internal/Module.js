import { dragZone, draggable } from "../../drag.js";
import COMOut from "./Out.js";
import Base from "./_Base.js";

export const MODULE_TYPES = {
    PTH: [],
    LFO: [
        { name: "AMP", value: 0.5, type: "range", min: null, max: null },
        { name: "FREQ", value: 20, type: "range", min: 1, max: 60 },
    ],
    PRO: [{ name: "CHNS", value: 0.5, type: "range", min: null, max: null }],
    BCH: [
        { name: "CV", value: 0, type: "picker", min: null, max: null },
        { name: "GT", value: 0, type: "picker", min: null, max: null },
    ],
};

/**@typedef {keyof typeof MODULE_TYPES} ModuleTypes */

export default class COMModule extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
    <style>
        :host {
        }

        #parameters:not(:has(*)){
            display:none;
        }

        :host([type="BCH"]) #parameters {
            flex-direction: row;
        }

        :host([type="BCH"]) #parameters com-parameter {
            flex-basis: 50%;
        }

        #outs {
            padding: 2px;
        }

        #outs[empty] {
            display: none;
        }

    </style>

    <span id="type">PTH</span>

    <x-flex id="parameters"></x-flex>

    <x-flex id="outs" empty>
        <slot></slot>
    </x-flex>
    `;

        // Waiting for a selector to solve this https://github.com/w3c/csswg-drafts/issues/6867
        this.shadowRoot.addEventListener("slotchange", (e) => {
            if (!this.children.length) {
                this.shadowRoot
                    .getElementById("outs")
                    .toggleAttribute("empty", true);
            } else {
                this.shadowRoot.getElementById("outs").removeAttribute("empty");
            }
        });

        /**@type {ModuleTypes} */
        this._type = "PTH";
    }

    connectedCallback() {
        if (!this._init) {
            draggable(this);
            dragZone(this, COMOut, true);

            /**@type {ModuleTypes} */
            const type = this.getAttribute("type") ?? "PTH";
            // if (type == "PTH" || this._type != "PTH") return;

            this.type = type;
        }

        this._init = true;

        super.connectedCallback();
    }

    /**@param {ModuleTypes} type */
    set type(type) {
        this._type = type;
        this.setAttribute("type", type);
        if (type == "PTH") return;

        const parameters = MODULE_TYPES[type];

        const ps = parameters.map((p, i) => {
            const pEl = document.createElement("com-parameter");

            pEl.minmax = { min: p.min, max: p.max };
            pEl.value = p.value.toString();
            pEl.name = p.name;
            pEl.type = p.type;

            return pEl;
        });

        this.shadowRoot.getElementById("parameters").innerHTML = "";
        this.shadowRoot.getElementById("parameters").append(...ps);
        this.shadowRoot.getElementById("type").textContent = type;
    }

    get type() {
        return this._type;
    }

    get parameters() {
        return this.shadowRoot.querySelectorAll("com-parameter");
    }

    addOut() {
        const newOut = document.createElement("com-out");
        this.appendChild(newOut);
    }

    remove() {
        //TODO - Is this need ?? How does OUTS refer to the modules they are attached to?
        this.querySelectorAll("com-out").forEach((o) => {
            o.emmitLifeCycle({ type: "disconnected" });
        });
        return super.remove();
    }
}
