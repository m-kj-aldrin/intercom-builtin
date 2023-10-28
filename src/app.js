import "./menu.js";
// import "./elements/inputs/index.js";
import "./elements/flexy-input/inputs/index.js";
import "./elements/internal/index.js";
import parser from "./intercom-parser/src/parser/index.js";

const networkEl = document.createElement("com-network");
document.body.appendChild(networkEl);

let chainsString0 = "cv_,gt_>PTH,BCH250:[0:1];cv0:5,gt8:12>LFO;cv_,gt_>PRO33";
let outsString0 = "out:8:0:0:2:0:2;out:2:4:1:0:2:0";

// let chainsString0 = "cv_,gt_>PTH";
// let outsString0 = "out:8:2:0:0:1:0";

let configString0 = `${chainsString0};${outsString0}`;

let state = parser.config(configString0);

state.chains.forEach((chain, c_idx) => {
    const chainEl = networkEl.addChain();
    chain.modules.forEach((module, m_idx) => {
        const moduleEl = chainEl.addModule(module.name);
        if (module.parameters.length) {
            moduleEl.parameters.forEach((parameterEl, i) => {
                parameterEl.value = module.parameters[i].value;
            });
        }

        state.outs.find((out) => {
            const cv_c = out.source.cv.chain == c_idx;
            const cv_m = out.source.cv.module == m_idx;
            const gt_c = out.source.gate.chain == c_idx;
            const gt_m = out.source.gate.module == m_idx;

            if (cv_c && cv_m) {
                const outEl = moduleEl.addOut();
                outEl.cv.pid = out.destination.pid;
                outEl.cv.ch = out.destination.channel;
            }

            if (gt_c && gt_m) {
                // const outEl = moduleEl.addOut();
                // outEl.cv.pid = out.destination.pid;
                // outEl.cv.ch = out.destination.channel;
            }
        });
    });
});

// document.body.innerHTML += `
// <com-network silent>
//     <com-chain silent>
//         <com-module type="LFO" silent></com-module>
//         <com-module type="PRO" silent></com-module>
//         <com-module silent>
//             <com-out silent></com-out>
//             <com-out silent></com-out>
//             <com-out silent></com-out>
//         </com-module>
//     </com-chain>
//     <com-chain silent>
//         <com-module type="BCH" silent></com-module>
//         <com-module silent>
//             <com-out silent></com-out>
//         </com-module>
//     </com-chain>
// </com-network>
// `;

// document
//     .querySelector("com-module")
//     .dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
