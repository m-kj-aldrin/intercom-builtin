import { dragZone } from "../../drag.js";
import COMModule, { MODULE_TYPES } from "./Module.js";
import Base from "./_Base.js";

export default class COMChain extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
    <style>
        :host {
            background-color: white;
            border: 1px var(--border-color) solid;
        }

        #input {
            flex-grow: 0;
            justify-content: space-between;
        }

        #modules {
            padding: 2px;
            gap: 4px;
            border-radius: 2px;
            border:none;
            background-color: #f9f9f9;
        }
    </style>
    
    <!--
    <x-flex id="input" row>
        <com-periphial id="cv">cv</com-periphial>
        <com-periphial id="gt">gt</com-periphial>
    </x-flex>
    -->

    <x-flex id="modules" part="modules">
        <slot></slot>
    </x-flex>
    `;

        dragZone(this, COMModule);

        // this.shadowRoot.addEventListener("com:bus:periphial", (e) => {
        //     this.emmitLifeCycle({ type: "change" });
        // });

        this.shadowRoot.addEventListener("change", (e) => {
            this.emmitLifeCycle({ type: "change" });
        });
    }

    /**@type {import("./Periphial.js").default} */
    get cv() {
        return this.shadowRoot.getElementById("cv");
    }

    /**@type {import("./Periphial.js").default} */
    get gt() {
        return this.shadowRoot.getElementById("gt");
    }

    get modules() {
        return this.querySelectorAll("com-module");
    }

    addModule(type = "pth") {
        /**@type {COMModule} */
        if (!(type in MODULE_TYPES)) return;
        const newModule = document.createElement("com-module");
        newModule.setAttribute("type", type);
        this.appendChild(newModule);
        return newModule;
    }
}
