import COMChain from "./Chain.js";
import COMModule from "./Module.js";
import COMParameter from "./Parameter.js";
import Base from "./_Base.js";

export default class COMNetwork extends Base {
    constructor() {
        super();

        this.addEventListener("com:bus", (e) => {
            const { type, emitter, chain, module, out } = e.detail;

            const comname = emitter.constructor.name
                .replace("COM", "")
                .toLocaleLowerCase();

            let s = `${comname} ${type}\n`;

            // - - CHAIN - -

            if (chain) {
                s += `chain idx: ${chain.index}\n`;
            }

            if (emitter instanceof COMChain && type == "change") {
                const cv = emitter.cv;
                const gt = emitter.gt;

                s += `cv - pid: ${cv.pid.value} ch: ${cv.ch.normValue}\ngt - pid: ${gt.pid.normValue} ch: ${gt.ch.normValue}\n`;

                let modulesString = "";
                const modules = emitter.modules;

                for (const module of modules) {
                    modulesString += module.type;

                    let parametersString = "";

                    const parameters = module.parameters;

                    for (const parameter of parameters) {
                        parametersString += `${parameter.normValue}:`;
                    }

                    parametersString = parametersString.slice(0, -1) + "";

                    modulesString += `${parametersString},`;
                }

                modulesString = modulesString.slice(0, -1);

                s += modulesString;
            }

            // - - MODULE - -

            if (module) {
                s += `module idx: ${module.index}\n`;
            }

            if (emitter instanceof COMModule && type == "connected") {
                s += `module type: ${emitter.type.toLocaleLowerCase()} `;

                if (emitter.type != "PTH") {
                    const parameters = emitter.parameters;

                    let parametersString = "";
                    for (const parameter of parameters) {
                        parametersString += `${parameter.normValue} : `;
                    }

                    parametersString = parametersString.slice(0, -2) + "";

                    s += parametersString;
                }
            }

            // - - PARAMETER - -

            if (emitter instanceof COMParameter && type == "change") {
                if (emitter) {
                    s += `parameter idx: ${emitter.index}`;
                    if (type == "change") {
                        s += ` - value: ${emitter.normValue}`;
                    }
                    s += "\n";
                }
            }

            // - - OUT - -

            if (out) {
                s += `out idx: ${out.index}\n`;

                if (type == "connected") {
                    const cv = out.cv;
                    const gt = out.gt;

                    s += `cv - pid: ${cv.pid.normValue} ch: ${cv.ch.normValue}\ngt - pid: ${gt.pid.normValue} ch: ${gt.ch.normValue}`;
                }
            }

            console.log(s);
        });

        this.shadowRoot.innerHTML += `
    <!--
    <com-global></com-global>
    -->
    <x-flex row>
        <slot></slot>
    </x-flex>
        `;
    }

    addChain() {
        const newChain = document.createElement("com-chain");
        this.appendChild(newChain);
    }
}
