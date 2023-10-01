import COMModule from "./Module.js";
import Base from "./_Base.js";

let picking = false;
/**@type {COMModule} */
let currentPicker;
/**@type {COMParameter} */
let currentParamPicker;

/**
 * @param {PointerEvent & {target:COMModule}} ev
 */
function selectHandler(ev) {
    if (currentPicker == ev.target) return;
    if (!(ev.target instanceof COMModule)) return;

    const module = ev.target;
    const chain = ev.target.closest("com-chain");

    currentParamPicker.value = `[${chain.index}:${module.index}]`;

    currentParamPicker.removeAttribute("data-picking");
    document.documentElement.removeAttribute("data-picking");
    picking = false;
    window.removeEventListener("pointerdown", selectHandler);
}

/**
 *
 * @param {PointerEvent & {target:COMParameter}} e
 */
function pickerHandler(e) {
    if (picking) return;
    picking = true;
    document.documentElement.setAttribute("data-picking", "true");
    e.target.setAttribute("data-picking", "source");

    currentPicker = e.target.getRootNode().host;
    currentParamPicker = e.target;
    window.onkeydown = (ee) => {
        if (ee.key == "Escape") {
            currentParamPicker.removeAttribute("data-picking");
            document.documentElement.removeAttribute("data-picking");
            picking = false;
            window.removeEventListener("pointerdown", selectHandler);
        }
    };
    window.addEventListener("pointerdown", selectHandler);
}

// TODO - Parameter element needs to be extend to handle diverse types of parameter
// select / boolean / switch / range / picker / float / integer
export default class COMParameter extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
        <style>
            :host {
                flex-direction: row;
                align-items: center;

                font-size: 0.75rem;
                gap: 4px;
                border-style: dashed;
            }

            :host([data-picking="source"]){
                border-color: hsl(40 100% 50%);
                border-style: solid;
                background-color: hsl(40 100% 50% / 0.1);
            }

            :host(:not([type="range"])) #output{
                display: none;
            }

            label {
                cursor: pointer;
            }

            #name {
                text-transform: lowercase;
            }

            input:active{
                color: blue;
            }

            input {
                padding: 0.25ch 0.5ch;
                font-size: inherit;
                color: inherit;
                font-family: inherit;
                border: none;

                display: inline-block;
                line-height: 1;
            }

            input[type="text"] {
                width: 7ch;
                text-align: center;
            }

            input[type="button"]{
                cursor: pointer;
                flex-grow: 1;
                background-color: transparent;
                border-radius: 2px;
            }

            input[type="range"] {
                flex-grow: 1;
            }

            input[type="range"] {
                cursor: pointer;
                -webkit-appearance: none;
                background-color: transparent;
            }
            
            input[type="range"]:active {
                /* color: cornflowerblue; */
            }
            
            input[type="range"]:focus {
                outline: none;
            }
            input[type="range"]::-webkit-slider-runnable-track {
                width: 100%;
                height: 2px;
                background: currentColor;
                border-radius: 40px;
            }
            input[type="range"]::-webkit-slider-thumb {
                height: 8px;
                aspect-ratio: 1/1;
                border-radius: 50%;
                background: currentColor;
                -webkit-appearance: none;
                margin-top: -3px;
            }
            
            input[type="range"]:active::-webkit-slider-thumb {
            }
            
            input[type="range"]::-moz-range-track {
                width: 100%;
                height: 2px;
                background: currentColor;
                border-radius: 40px;
            }
            
            input[type="range"]::-moz-range-thumb {
                height: 8px;
                width: 8px;
                border-radius: 50%;
                background: currentColor;
                margin-top: -3px;
                border: none;
            }
        </style>

        <label id="name" for="parameter"></label>
        <input id="parameter" type="range" value="" min=0 max=1 step="0.0001" oninput="this.nextElementSibling.value = (+event.target.value)?.toFixed(4)"  />
        <input id="output" type="text" value="" min=0 max=1  oninput="this.previousElementSibling.value = (+event.target.value).toFixed(4)"/>
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

    /**
     * @param {string} value
     */
    type(value, list) {
        this.setAttribute("type", value);
        if (value == "picker") {
            this.parameter.type = "button";
            // [0:0] : [1:3]
            this.onpointerdown = pickerHandler;
            return;
        }

        if (value == "select") {
            this.parameter.type = "select";
            console.log(list);
            const s = document.createElement("select");
            list.forEach((o) => {
                const opt = document.createElement("option");
                opt.value = o;
                opt.text = o;
                s.appendChild(opt);
            });
            this.shadowRoot.appendChild(s);
        }

        this.onpointerdown = null;

        this.parameter.type = value;
    }

    /**@type {HTMLInputElement} */
    get parameter() {
        return this.shadowRoot.getElementById("parameter");
    }

    /**@param {{min:number,max:number}} o */
    set minmax({ min, max }) {
        min && (this.parameter.min = min.toString());
        max && (this.parameter.max = max.toString());
    }

    set value(v) {
        this.parameter.value = v;

        this.parameter.dispatchEvent(new Event("input", { bubbles: true }));
        this.parameter.dispatchEvent(new Event("change", { bubbles: true }));
    }

    get value() {
        return this.shadowRoot.querySelector("input").value;
    }

    set name(n) {
        this.shadowRoot.getElementById("name").textContent = n;
    }
}
