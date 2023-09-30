import { dragZone, draggable } from "../../drag.js";
import COMOut from "./Out.js";
import Base from "./_Base.js";

const MODULE_TYPES = {
    PTH: [],
    LFO: [
        { name: "AMP", value: 0.5 },
        { name: "FREQ", value: 0.125 },
    ],
    PROB: [{ name: "CHNS", value: 0.5 }],
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

        #outs {
            padding: 4px;
            border: 1px currentColor solid;
            border-radius: 2px;
            border-style: dashed;
        }


    </style>

    <span id="type">PTH</span>

    <x-flex id="parameters"></x-flex>

    <x-flex id="outs" >
        <slot></slot>
    </x-flex>
    `;
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this._init) {
            draggable(this);
            dragZone(this, COMOut, true);

            /**@type {ModuleTypes} */
            const type = this.getAttribute("type") ?? "PTH";
            if (type == "PTH") return;
            const parameters = MODULE_TYPES[type];

            const ps = parameters.map((p, i) => {
                const pEl = document.createElement("com-parameter");

                pEl.value = p.value.toString();
                pEl.name = p.name;

                return pEl;
            });

            this.shadowRoot.getElementById("parameters").append(...ps);
            this.shadowRoot.getElementById("type").textContent = type;
        }

        this._init = true;
    }

    remove() {
        //TODO - Is this need ?? How does OUTS refere to the modules they are attached to?
        this.querySelectorAll("com-out").forEach((o) => {
            o.emmitLifeCycle({ type: "disconnected" });
        });
        return super.remove();
    }
}
