import "./menu.js";
import { dragZone, draggable } from "./drag.js";

class Base extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML += `
    <style>

        * {
            box-sizing: border-box;
        }

        :host {
            display: flex;
            gap: 4px;
            flex-direction: column;

            padding: 2px;
            border-radius: 2px;

            border: 1px currentColor solid;
        }

    </style>
    `;

        this.addEventListener("com:bus", (e) => {
            e.detail[this.constructor.name] = this;
        });

        this._init = false;
        this._openConnection = true;
    }

    connectedCallback() {
        if (this._openConnection) {
            this.emmitLifeCycle({ type: "connected" });
        }
    }

    remove() {
        if (!this.parentElement) return tihs;
        this.emmitLifeCycle({ type: "disconnected" });
        const el = this.parentElement.removeChild(this);
        return el;
    }

    emmitLifeCycle({ type, emitter = this, composed = false }) {
        this.dispatchEvent(
            new CustomEvent("com:bus", {
                bubbles: true,
                composed,
                detail: {
                    type,
                    emitter,
                },
            })
        );
    }

    get index() {
        if (!this.parentElement) return -1;
        const children = this.parentElement.children;

        let i = 0;

        for (const child of children) {
            if (child == this) return i;
            i++;
        }

        return -1;
    }
}

export class COMNetwork extends Base {
    constructor() {
        super();

        this.addEventListener("com:bus", (e) => {
            const {
                type,
                emitter,
                COMChain,
                COMModule,
                COMOut,
                COMParameter,
                _COMPeriphial,
            } = e.detail;

            let s = `${emitter.constructor.name} ${type}\n`;

            if (COMChain) {
                s += `chain: ${COMChain.index}\n`;
                if (type == "change") {
                    const cv = COMChain.cv;
                    const gt = COMChain.gt;
                    //   console.log(cv.pid.value, cv.ch.value, gt.pid.value, gt.ch.value);

                    s += `cv - pid: ${cv.pid.value} ch: ${cv.ch.value}\ngt - pid: ${gt.pid.value} ch: ${gt.ch.value}\n`;
                }
            }

            if (COMModule) {
                s += `module: ${COMModule.index}\n`;
            }

            if (COMOut) {
                s += `out: ${COMOut.index}\n`;

                if (type == "connected") {
                    const cv = emitter.cv;
                    const gt = emitter.gt;

                    s += `cv - pid: ${cv.pid.value} ch: ${cv.ch.value}\ngt - pid: ${gt.pid.value} ch: ${gt.ch.value}`;
                }
            }

            if (COMParameter) {
                s += `parameter: ${COMParameter.index}`;
                if (type == "change") {
                    s += ` v: ${COMParameter.value}`;
                }
                s += "\n";
            }

            console.log(s);
        });

        this.shadowRoot.innerHTML += `
        <x-flex row>
            <slot></slot>
        </x-flex>
        `;
    }
}

export class COMChain extends Base {
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
}

const MODULE_TYPES = {
    PTH: [],
    LFO: [
        { name: "AMP", value: 0.5 },
        { name: "FREQ", value: 0.125 },
    ],
    PROB: [{ name: "CHNS", value: 0.5 }],
};

/**@typedef {keyof typeof MODULE_TYPES} ModuleTypes */

export class COMModule extends Base {
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
        }


    </style>

    <span id="type">PTH</span>

    <x-flex id="parameters"></x-flex>

    <x-flex id="outs" >
        <slot></slot>
    </x-flex>
    `;

        draggable(this);
        dragZone(this, COMOut, true);
    }

    connectedCallback() {
        super.connectedCallback();

        if (!this._init) {
            /**@type {ModuleTypes} */
            const type = this.getAttribute("type") ?? "PTH";
            if (type == "PTH") return;
            const parameters = MODULE_TYPES[type];

            const ps = parameters.map((p, i) => {
                /**@type {COMParameter} */
                const pEl = document.createElement("com-parameter");

                pEl.value = p.value;
                pEl.name = p.name;

                return pEl;
            });

            this.shadowRoot.getElementById("parameters").append(...ps);
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

export class COMParameter extends Base {
    constructor() {
        super();

        this.shadowRoot.innerHTML += `
        <style>
            :host {
                flex-direction: row;
                align-items: center;

                font-size: 0.75rem;
                gap: 4px;
            }

            #name {
                text-transform: lowercase;
            }

            input {
                font-size: inherit;
                color: inherit;
                font-family: inherit;
                border: none;
            }

            input[type="text"] {
                width: 7ch;
                text-align: center;
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

        <span id="name"></span>
        <input type="range" value="0.5000" min=0 max=1 step="0.0001" oninput="this.nextElementSibling.value = (+event.target.value).toFixed(4)"  />
        <input type="text" value="0.5000" min=0 max=1 id="output" oninput="this.previousElementSibling.value = (+event.target.value).toFixed(4)"/>
        `;

        this.ondragstart = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };

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
        super.connectedCallback();
        this.draggable = true;
    }

    set value(v) {
        this.shadowRoot.querySelector("input").value = v;
    }

    get value() {
        return this.shadowRoot.querySelector("input").value;
    }

    set name(n) {
        this.shadowRoot.getElementById("name").textContent = n;
    }
}

let N_OUTS = 0;

const randInt = (a, b) => Math.floor(Math.random() * (b - a) + a);
const hueStep = 50;
let huePos = randInt(0, 360 / 50) * 50;
const randomColor = () =>
    `hsl(${(huePos += hueStep)} ${randInt(85, 100)}% ${randInt(45, 55)}%)`;

export class COMOut extends Base {
    constructor() {
        super();

        this._outIndex = -1;

        this.shadowRoot.innerHTML += `
        <style>
            :host {

                background-color: white;
                position: relative;
                flex-direction: row;
                align-items: center;
            }

            x-flex {

            }

            :host(:not([open])) x-flex{
            }

            x-flex {
                justify-content: space-between;
            }
        </style>

        <x-flex id="" row>
            <com-periphial id="cv">cv</com-periphial>
            <com-periphial id="gt">gt</com-periphial>
        </x-flex>
        `;

        draggable(this);

        this.shadowRoot.addEventListener("com:bus:periphial", (e) => {
            this.emmitLifeCycle({ type: "disconnect" });

            document.querySelectorAll("com-out").forEach((out) => {
                if (out.index >= this.index) {
                    out.index = out.index - 1;
                }
            });

            this.index = N_OUTS - 1;

            this.emmitLifeCycle({ type: "connected" });
        });
    }

    get index() {
        return this._outIndex;
    }

    set index(v) {
        this._outIndex = v;
    }

    /**@returns {COMPeriphial} */
    get cv() {
        return this.shadowRoot.getElementById("cv");
    }

    /**@returns {COMPeriphial} */
    get gt() {
        return this.shadowRoot.getElementById("gt");
    }

    connectedCallback() {
        this.index = N_OUTS;

        N_OUTS++;

        this._init = true;

        document.querySelectorAll("com-out").forEach((out) => {
            if (out.index > this.index) {
                out.index = out.index + 1;
            }
        });

        super.connectedCallback();
        //TODO - This is needed if the outs doesnt need to be reattached everytime a module is moved
        // this._openConnection = false;
    }

    disconnectedCallback() {
        N_OUTS--;
        document.querySelectorAll("com-out").forEach((out) => {
            if (out.index >= this.index) {
                out.index = out.index - 1;
            }
        });
    }
}

const PERIPHIAL_MAP = [
    {
        name: "midi_1",
        color: "red",
    },
    {
        name: "midi_2",
        color: "red",
    },
    {
        name: "usb_midi",
        color: "orange",
    },
    {
        name: "osc",
        color: "blue",
    },
];

export class COMPeriphial extends Base {
    constructor() {
        super();

        this.style.setProperty("--color", PERIPHIAL_MAP[0].color);

        this.shadowRoot.addEventListener("change", (e) => {
            this.style.setProperty(
                "--color",
                PERIPHIAL_MAP[+this.pid.value].color
            );

            this.dispatchEvent(
                new CustomEvent("com:bus:periphial", {
                    bubbles: true,
                    detail: {
                        type: "change",
                        emitter: this,
                    },
                })
            );
        });

        this.shadowRoot.innerHTML = `
    <style>

        :host{
        }

        x-flex {
            gap: 2px;
        }

        select:active{
            outline: none;
        }
        select:focus{
            outline: none;
        }

        select {
            cursor: pointer;
            -webkit-appearance: none;
            border-radius: 2px;
            padding-inline: 0.5ch;
            padding-block: 0.125ch;
            background-color: var(--color);
            font-family: inherit;
            color: inherit;
            color: #fff;
        }

    </style>

    <x-flex row>
        <span><slot></slot></span>
        <select id="pid">
            ${PERIPHIAL_MAP.map((t, i) => {
                return `<option value="${i}">${t.name}</option>`;
            }).join("\n")}
        <select>
        <select id="ch">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        <select>
    </x-flex>
    `;
    }

    /**@type {HTMLSelectElement} */
    get pid() {
        return this.shadowRoot.getElementById("pid");
    }

    /**@type {HTMLSelectElement} */
    get ch() {
        return this.shadowRoot.getElementById("ch");
    }
}

export class XFlex extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML += `
    <style>
        :host{
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex-grow: 1;
        }

        :host([row]){
            flex-direction:row;
        }
    </style>
    <slot></slot>
    `;
    }
}

customElements.define("x-flex", XFlex);

customElements.define("com-network", COMNetwork);
customElements.define("com-chain", COMChain);
customElements.define("com-module", COMModule);
customElements.define("com-parameter", COMParameter);
customElements.define("com-out", COMOut);
customElements.define("com-periphial", COMPeriphial);

document.body.innerHTML += `
<com-network>
    <com-chain>
        <com-module type="LFO"></com-module>
        <com-module type="PROB"></com-module>
        <com-module>
            <com-out></com-out>
            <com-out></com-out>
        </com-module>
    </com-chain>
    <com-chain>
        <com-module></com-module>
        <com-module>
            <com-out></com-out>
        </com-module>
    </com-chain>
</com-network>
`;
