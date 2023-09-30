import { dragZone } from "../../drag.js";
import COMModule from "./Module.js";
import Base from "./_Base.js";

export default class COMChain extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
    <style>
        #input {
            flex-grow: 0;
            justify-content: space-between;
        }

        #modules {
            padding: 4px;
            gap: 4px;
            border: 1px currentColor dashed;
            border-radius: 2px;
        }
    </style>
    
    <x-flex id="input" row>
        <com-periphial id="cv">cv</com-periphial>
        <com-periphial id="gt">gt</com-periphial>
    </x-flex>

    <x-flex id="modules">
        <slot></slot>
    </x-flex>
    `;

        dragZone(this, COMModule);

        this.shadowRoot.addEventListener("com:bus:periphial", (e) => {
            this.emmitLifeCycle({ type: "change" });
        });
    }

    get cv() {
        return this.shadowRoot.getElementById("cv");
    }

    get gt() {
        return this.shadowRoot.getElementById("gt");
    }

    addModule(type = "pth") {
        /**@type {COMModule} */
        const newModule = document.createElement("com-module");
        newModule.setAttribute("type", type);
        this.appendChild(newModule);
    }
}
