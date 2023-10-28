import { InputSelect } from "../flexy-input/inputs/select.js";
import Base from "./_Base.js";

const PERIPHIAL_MAP = [
    {
        name: "dac",
        color: "red",
        nChannels: 8,
    },
    {
        name: "adc",
        color: "red",
        nChannels: 8,
    },
    {
        name: "dout",
        color: "green",
        nChannels: 8,
    },
    {
        name: "din",
        color: "green",
        nChannels: 8,
    },
    {
        name: "midi_s_1",
        color: "orange",
        nChannels: 16,
    },
    {
        name: "midi_s_2",
        color: "orange",
        nChannels: 16,
    },
    {
        name: "midi_s_3",
        color: "orange",
        nChannels: 16,
    },
    {
        name: "midi_device",
        color: "orange",
        nChannels: 16,
    },
    {
        name: "midi_host",
        color: "orange",
        nChannels: 16,
    },
    {
        name: "i2c_1",
        color: "hotpink",
        nChannels: 4,
    },
    {
        name: "i2c_2",
        color: "hotpink",
        nChannels: 4,
    },
    {
        name: "osc",
        color: "blue",
        nChannels: null,
    },
];

export default class COMPeriphial extends Base {
    constructor() {
        super();

        this.shadowRoot.addEventListener("change", (e) => {
            if (e.target == this.pid && typeof +this.pid.value == "number") {
                const periphialOpt = PERIPHIAL_MAP[this.pid.normValue];
                this.style.setProperty("--color", periphialOpt.color);

                const nCh = periphialOpt.nChannels;
                this.ch.list = [...Array(nCh)].map((_, i) => i.toString());
            }

            if (e.target == this.ch) {
                this.dispatchEvent(
                    new CustomEvent("change", {
                        bubbles: true,
                    })
                );
            }
        });

        this.shadowRoot.innerHTML = `
    <style>

        :host{
            /*--color: ${PERIPHIAL_MAP[0].color};*/

            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        input-select{
            /*color: var(--color);*/

        }

        span {
            align-self: center;
            /*font-size: 0.75em;*/
        }

        x-flex {
            align-items: stretch;
        }

    </style>

    <x-flex row>
        <span><slot></slot></span>
    </x-flex>
    `;
        const pidSelect = document.createElement("input-select");
        pidSelect.id = "pid";
        pidSelect.list = PERIPHIAL_MAP.map((p) => p.name);
        pidSelect.draggable = true;
        pidSelect.ondragstart = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };

        const chSelect = document.createElement("input-select");
        chSelect.id = "ch";
        chSelect.draggable = true;
        chSelect.ondragstart = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
        };

        const x = this.shadowRoot.querySelector("x-flex");

        x.append(pidSelect, chSelect);
    }

    /**@type {InputSelect} */
    get pid() {
        return this.shadowRoot.getElementById("pid");
    }

    /**@param {number} v */
    set pid(v) {
        this.shadowRoot.getElementById("pid").normValue = v;

        const periphialOpt = PERIPHIAL_MAP[this.pid.normValue];
        this.style.setProperty("--color", periphialOpt.color);

        const nCh = periphialOpt.nChannels;
        this.ch.list = [...Array(nCh)].map((_, i) => i.toString());
    }

    /**@type {InputSelect} */
    get ch() {
        return this.shadowRoot.getElementById("ch");
    }

    /**@param {number} v */
    set ch(v) {
        this.shadowRoot.getElementById("ch").normValue = v;
    }
}
