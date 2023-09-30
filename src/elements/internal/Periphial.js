import Base from "./_Base.js";

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

export default class COMPeriphial extends Base {
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
