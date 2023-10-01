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
                const periphialOpt = PERIPHIAL_MAP[+this.pid.value];
                this.style.setProperty("--color", periphialOpt.color);

                const nCh = PERIPHIAL_MAP[+this.pid.value].nChannels;

                let chHTML = "<option selected disabled>_</option>";
                for (let i = 0; i < nCh; i++) {
                    chHTML += `<option value="${i}">${i}</option>`;
                }
                this.ch.innerHTML = chHTML;
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
            --color: ${PERIPHIAL_MAP[0].color};
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
            border: none;
        }

    </style>

    <x-flex row>
        <span><slot></slot></span>
        <select id="pid" >
            <option selected>_</option>
            ${PERIPHIAL_MAP.map((t, i) => {
                return `<option value="${i}">${t.name}</option>`;
            }).join("\n")}
        <select>
        <select id="ch" value="3">
            <option selected>_</option>
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
