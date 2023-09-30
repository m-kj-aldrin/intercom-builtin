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

            if (chain) {
                s += `chain idx: ${chain.index}\n`;
            }

            if (module) {
                s += `module idx: ${module.index}\n`;
            }

            if (emitter instanceof COMParameter && type == "change") {
                if (emitter) {
                    s += `parameter idx: ${emitter.index}`;
                    if (type == "change") {
                        s += ` - value: ${emitter.value}`;
                    }
                    s += "\n";
                }
            }

            if (out) {
                s += `out idx: ${out.index}\n`;

                if (type == "connected") {
                    const cv = out.cv;
                    const gt = out.gt;

                    s += `cv - pid: ${cv.pid.value} ch: ${cv.ch.value}\ngt - pid: ${gt.pid.value} ch: ${gt.ch.value}`;
                }
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
