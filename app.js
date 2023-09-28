import "./menu.js";
import { dragZone, draggable } from "./drag.js";

class Base extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML += `
    <style>

        *{
            box-sizing: border-box;
        }

        :host {
            display: flex;
            gap: 4px;
            flex-direction: column;

            padding: 4px;

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
      this.emmitLifeCycle("connected");
    }
  }

  remove() {
    if (!this.parentElement) return tihs;
    this.emmitLifeCycle("disconnected");
    const el = this.parentElement.removeChild(this);
    return el;
  }

  emmitLifeCycle(type, emitter = this, composed = false) {
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
      //   console.log(e.detail);
      if (e.detail.emitter instanceof COMOut) {
        console.log(e.detail.type, e.detail.emitter.index);
      }
      // if (e.detail.emitter instanceof COMParameter) {
      //     const parameter = e.detail.emitter;
      //     console.log(parameter);
      // }
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
    <x-flex>
        <slot></slot>
    </x-flex>
    `;

    dragZone(this, COMModule);
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

        input{
            border: none;
            max-width: 6ch;
        }

        #parameters {
        }

        #parameters:not(:has(*)){
            display:none;
        }

        #outs {
            padding: 4px;
            background-color: red;
        }


    </style>

    <span id="type">PTH</span>

    <x-flex id="parameters"></x-flex>

    <x-flex id="outs" row>
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
}

export class COMParameter extends Base {
  constructor() {
    super();

    this.shadowRoot.innerHTML += `
        <style>
            :host {
                flex-direction: row;
                align-items: center;
            }

            input {
                font-size: inherit;
                color: inherit;
                font-family: inherit;
                border: none;
                width: 6ch;
            }
        </style>

        <span id="name"></span>
        <input type="test" value="0.5" />
        `;

    this.shadowRoot.addEventListener("change", (e) => {
      this.emmitLifeCycle("change", this, true);
    });
  }

  set value(v) {
    this.shadowRoot.querySelector("input").value = v;
  }

  set name(n) {
    this.shadowRoot.getElementById("name").textContent = n;
  }
}

let N_OUTS = 0;

export class COMOut extends Base {
  constructor() {
    super();

    this._outIndex = -1;

    this.shadowRoot.innerHTML += `
        <style>
            :host {
                background-color: yellow;
            }

            :host(:not([open])) x-flex{
                display: none;
            }
        </style>
        <span>out</span>
        <x-flex>
            <com-periphial></com-periphial>
            <com-periphial></com-periphial>
        </x-flex>
        `;

    draggable(this);
  }

  get index() {
    return this._outIndex;
  }

  set index(v) {
    this._outIndex = v;
  }

  connectedCallback() {
    this.index = N_OUTS;

    if (!this._init) {
      //   N_OUTS++;
    }
    N_OUTS++;

    this._init = true;

    super.connectedCallback();
    this._openConnection = false;
  }

  disconnectedCallback() {
    N_OUTS--;
    document.querySelectorAll("com-out").forEach((out) => {
      if (out.index > this.index) {
        out.index = out.index - 1;
      }
    });
  }
}

export class COMPeriphial extends Base {
  constructor() {
    super();

    this.shadowRoot.innerHTML = `
    <style>

        :host{

        }
       
    </style>

    <x-flex row>
        <select>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        <select>
        <select>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        <select>
    </x-flex>
    `;
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
