import Base from "./_Base.js";

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
        // super.connectedCallback();
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
