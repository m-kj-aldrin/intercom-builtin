import { draggable } from "../../drag.js";
import Base from "./_Base.js";

let N_OUTS = 0;

export default class COMOut extends Base {
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

                font-size: 0.65rem;

                border-color: var(--border-color);
                background-color: #fdfdfd;
            }

            x-flex {

            }

            :host(:not([open])) x-flex{
            }

            x-flex {
                justify-content: space-between;
                align-items: center;
            }
        </style>

        <x-flex id="" row>
            <com-periphial id="cv"></com-periphial>
        </x-flex>
        `;

        // this.shadowRoot.addEventListener("com:bus:periphial", (e) => {
        //     this.emmitLifeCycle({ type: "disconnect" });

        //     document.querySelectorAll("com-out").forEach((out) => {
        //         if (out.index >= this.index) {
        //             out.index = out.index - 1;
        //         }
        //     });

        //     this.index = N_OUTS - 1;

        //     this.emmitLifeCycle({ type: "connected" });
        // });
        this.shadowRoot.addEventListener("change", (e) => {
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

    /**@returns {import("./Periphial.js").default} */
    get cv() {
        return this.shadowRoot.getElementById("cv");
    }

    /**@returns {import("./Periphial.js").default} */
    get gt() {
        return this.shadowRoot.getElementById("gt");
    }

    connectedCallback() {
        if (!this._init) {
            draggable(this);
        }

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
