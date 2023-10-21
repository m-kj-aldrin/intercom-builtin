import ComBusEvent from "../com-bus.js";

export default class Base extends HTMLElement {
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

            border: 1px #0005 solid;
        }

    </style>
    `;

        this.addEventListener("com:bus", (e) => {
            const name = this.constructor.name;
            e.detail[name.replace("COM", "").toLowerCase()] = this;
        });

        this._init = false;
        this._openConnection = true;
    }

    connectedCallback() {
        if (this.hasAttribute("silent")) {
            this.removeAttribute("silent");
            return;
        }
        if (this._openConnection) {
            this.emmitLifeCycle({ type: "connected" });
        }
    }

    remove() {
        if (!this.parentElement) return this;
        this.emmitLifeCycle({ type: "disconnected" });
        const el = this.parentElement.removeChild(this);
        return el;
    }

    /**
     * @param {{type:import("../com-bus.js").BusEventType,
     * emitter?: import("../com-bus.js").ComUnion,
     * composed?:boolean}} o
     */
    emmitLifeCycle({ type, emitter = this, composed = false }) {
        this.dispatchEvent(new ComBusEvent(type, emitter, composed));
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
