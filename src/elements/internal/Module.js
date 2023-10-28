import { dragZone, draggable } from "../../drag.js";
import COMOut from "./Out.js";
import Base from "./_Base.js";

export const MODULE_TYPES = {
    PTH: [],
    LFO: [
        { name: "frequency", value: 20, type: "range", min: 1, max: 60 },
        { name: "span", value: 0.5, type: "range" },
        { name: "phase", value: 0.5, type: "range", min: 0, max: 1024 },
        { name: "offset", value: 0.5, type: "range" },
        {
            name: "wave select",
            value: "sine",
            type: "select",
            list: ["ramp up", "ramp down", "triangle", "sine", "square"],
            min: null,
            max: null,
        },
        { name: "reset", value: "reset", type: "momentary" },
        {
            name: "mode",
            value: 0,
            type: "select",
            list: ["freerunning", "beat-sync"],
            min: null,
            max: null,
        },
        { name: "hold", value: 0, type: "boolean" },
    ],
    PRO: [{ name: "CHNS", value: 0.5, type: "range" }],
    BCH: [
        { name: "CV", value: 0, type: "picker" },
        { name: "GT", value: 0, type: "picker" },
    ],
};

/**@typedef {keyof typeof MODULE_TYPES} ModuleTypes */

export default class COMModule extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
    <style>
        :host {
            background-color: white;
            box-shadow: 0 0 4px #0002;
            border-color: #0002;
            border: none;
            padding: 4px;
        }

        #type {
        }

        #parameters:not(:has(*)){
            display:none;
        }


        #outs {
            padding: 2px;
            flex-wrap: wrap;
        }

        #outs > ::slotted(com-out) {
            flex-grow: 0;
        }

        :host(:empty) #outs{
            padding: 0;
        }

    </style>

    <span id="type">PTH</span>

    <x-flex id="parameters"></x-flex>

    <x-flex id="outs" part="outs">
        <slot></slot>
    </x-flex>

    `;

        // Waiting for a selector to solve this https://github.com/w3c/csswg-drafts/issues/6867
        // this.shadowRoot.addEventListener("slotchange", (e) => {
        //     if (!this.children.length) {
        //         this.shadowRoot
        //             .getElementById("outs")
        //             .toggleAttribute("empty", true);
        //     } else {
        //         this.shadowRoot.getElementById("outs").removeAttribute("empty");
        //     }
        // });

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
            pEl.type(p.type, p.list);
            pEl.minmax = { min: p.min || 0, max: p.max || 128 };
            pEl.name = p.name;
            if (p.value) {
                pEl.normValue = p.value;
            }

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
        // newOut.toggleAttribute("silent", true);
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
