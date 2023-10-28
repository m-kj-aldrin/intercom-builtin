import COMModule from "./Module.js";
import Base from "./_Base.js";

export default class COMParameter extends Base {
    constructor() {
        super();

        // this.shadowRoot.innerHTML = ""

        this.shadowRoot.innerHTML += `
        <style>
            :host {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;

                font-size: 0.65rem;
                gap: 2px;
                border-style: solid;
                /*border-color: hsl(var(--col-gray));*/
                border-color: var(--border-color);
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
        // this.draggable = true;
        // this.ondragstart = (e) => {
        //     e.preventDefault();
        //     e.stopImmediatePropagation();
        // };
    }

    /**@param {string} value */
    type(value, list) {
        let input;

        switch (value) {
            case "range":
                input = document.createElement("input-range");
                input.width = 64;
                break;
            case "select":
                input = document.createElement("input-select");
                input.list = list;
                break;
            case "boolean":
                input = document.createElement("input-switch");
                break;
            case "momentary":
                input = document.createElement("input-button");
                break;
            case "picker":
                input = document.createElement("input-picker");
                input.setPickerType({
                    type: COMModule,
                    fn: (target, picker) => {
                        const parentChain = target.closest("com-chain");
                        const val = `${parentChain.index}:${target.index}`;
                        picker.shadowRoot.getElementById("detail").textContent =
                            val;
                        return val;
                    },
                });
                input.rejectList = [() => this.parentNode.parentNode.host];
                break;
        }

        if (input) {
            input.id = "input";
            const container = this.shadowRoot.getElementById("input-container");
            container.innerHTML = "";
            container.appendChild(input);

            input.draggable = true;
            input.ondragstart = (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();
            };
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

    set value(v) {
        const input = this.shadowRoot.getElementById("input");
        if (input) {
            input.value = v;
        }
    }

    get value() {
        const input = this.shadowRoot.getElementById("input");
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
            input.normValue = v;
        }
    }

    set name(n) {
        this.shadowRoot.getElementById("label").textContent = n;
    }
}
