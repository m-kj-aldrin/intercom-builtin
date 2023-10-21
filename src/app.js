import "./menu.js";
// import "./elements/inputs/index.js";
import "./elements/flexy-input/inputs/index.js";
import "./elements/internal/index.js";

document.body.innerHTML += `
<com-network silent>
    <com-chain silent>
        <com-module type="LFO" silent></com-module>
        <com-module type="PRO" silent></com-module>
        <com-module silent>
            <com-out></com-out>
            <com-out></com-out>
        </com-module>
    </com-chain>
    <com-chain silent>
        <com-module type="BCH" silent></com-module>
        <com-module silent>
            <com-out silent></com-out>
        </com-module>
    </com-chain>
</com-network>
`;
