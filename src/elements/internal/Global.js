import COMPeriphial from "./Periphial.js";

// TODO - write midi source element instead of periphial, add clock pulse to quarter note relation
export default class COMGlobal extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                border: 1px currentColor solid;
                flex-basis: 0;
                flex-grow: 0;
            }

            x-flex{
                align-items: center;
            }
        </style>
        <x-flex row>
            <label for="tempo-source"> tempo source </label>
            <input type="checkbox" id="tempo-source" onchange="this.getRootNode().host.test(event)" />
            <label for="tempo">tempo</label>
            <input id="tempo" name="tempo" type="number" min="1" max="9999" value="120" />
        </x-flex>
        `;

        this.shadowRoot.addEventListener("change", (e) => {
            const id = e.target.name;
            switch (id) {
                case "tempo":
                    if (e.target instanceof COMPeriphial) {
                        const ppqn_a =
                            this.shadowRoot.getElementById("ppqn_divided");
                        const ppqn_b =
                            this.shadowRoot.getElementById("ppqn_divisor");
                        console.log(
                            `tempo -s ${e.target.pid.value}:${e.target.ch.value} -r ${ppqn_a.value}:${ppqn_b.value}`
                        );
                        break;
                    }
                    if (this.shadowRoot.getElementById("tempo")?.ch?.value) {
                        const ppqn_a =
                            this.shadowRoot.getElementById("ppqn_divided");
                        const ppqn_b =
                            this.shadowRoot.getElementById("ppqn_divisor");
                        const p = this.shadowRoot.getElementById("tempo");
                        console.log(
                            `tempo -s ${p.pid.value}:${p.ch.value} -r ${ppqn_a.value}:${ppqn_b.value}`
                        );
                        break;
                    }
                    console.log(`tempo -t ${e.target.value}`);
                    break;
            }
        });

        // // TODO - This is temporary until custom midi source picker
        // this.shadowRoot.addEventListener("com:bus:periphial", (e) => {
        //     if (e.target.id == "tempo") {
        //         const pid = e.target.pid.value;
        //         const ch = e.target.ch.value;

        //         console.log(`tempo -s ${pid}:${ch}`);
        //     }
        // });
    }

    // TODO - This is for prototyping purpose, unify the events for this element
    test(e) {
        const value = e.target.checked;
        const tempoEl = this.shadowRoot.getElementById("tempo");

        if (value) {
            const parent = this.shadowRoot.querySelector("x-flex");
            const tempoPeriphial = document.createElement("com-periphial");
            tempoPeriphial.id = "tempo";
            tempoPeriphial.name = "tempo";
            parent.insertBefore(tempoPeriphial, tempoEl);
            tempoEl.remove();

            const ppqn_divided = document.createElement("input");
            ppqn_divided.type = "number";
            ppqn_divided.id = "ppqn_divided";
            ppqn_divided.name = "tempo";
            ppqn_divided.value = "1";
            ppqn_divided.min = "1";
            ppqn_divided.max = "32";
            const ppqn_divisor = document.createElement("input");
            ppqn_divisor.type = "number";
            ppqn_divisor.id = "ppqn_divisor";
            ppqn_divisor.name = "tempo";
            ppqn_divisor.value = "24";
            ppqn_divisor.min = "1";
            ppqn_divisor.max = "1024";

            parent.append(ppqn_divided, ppqn_divisor);
        } else {
            const numberTempo = document.createElement("input");
            numberTempo.type = "number";
            numberTempo.id = "tempo";
            numberTempo.name = "tempo";
            numberTempo.min = "1";
            numberTempo.max = "9999";
            numberTempo.value = "120";

            const pidTempo = this.shadowRoot.getElementById("tempo");

            const parent = this.shadowRoot.querySelector("x-flex");
            parent.insertBefore(numberTempo, pidTempo);

            pidTempo.remove();

            this.shadowRoot.getElementById("ppqn_divided").remove();
            this.shadowRoot.getElementById("ppqn_divisor").remove();
        }
    }
}
