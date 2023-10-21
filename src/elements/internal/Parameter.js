import COMModule from "./Module.js";
import Base from "./_Base.js";

export default class COMParameter extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
        <style>
            :host {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                font-size: 0.65rem;
                gap: 2px;
                border-style: dashed;
            }

            #label{
            }
        </style>
        <div id="label"></div>
        <div id="input-container"></div>
        `;

        this.shadowRoot.addEventListener("change", (e) => {
            e.preventDefault();
            this.emmitLifeCycle({
                type: "change",
                composed: true,
                emitter: this,
            });
        });
    }

    connectedCallback() {
        this.draggable = true;
        this.ondragstart = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };
    }

    /**@param {string} value */
    type(value, list) {
        let input;

        switch (value) {
            case "range":
                input = document.createElement("input-range");
                input.width = 32;
                break;
            case "select":
                input = document.createElement("input-select");
                input.list = list;
                break;
            case "boolean":
                input = document.createElement("input-switch");
                break;
        }

        if (input) {
            input.id = "input";
            const container = this.shadowRoot.getElementById("input-container");
            container.innerHTML = "";
            container.appendChild(input);
        }
    }

    /**@type {HTMLInputElement} */
    get parameter() {}

    /**@param {{min:number,max:number}} o */
    set minmax({ min, max }) {
        const input = this.shadowRoot.getElementById("input");
        if (input) {
            input.minmax = { min, max };
        }
    }

    set value(v) {}

    get value() {
        const input = this.shadowRoot.getElementById("input");
        console.log(input, input.value);
        if (input) {
            return input.value;
        }
    }

    get normValue() {
        const input = this.shadowRoot.getElementById("input");
        if (input) {
            return input.normValue;
        }
    }

    set normValue(v) {
        const input = this.shadowRoot.getElementById("input");
        if (input) {
            console.log(input);
            input.normValue = v;
        }
    }

    set name(n) {
        this.shadowRoot.getElementById("label").textContent = n;
    }
}
