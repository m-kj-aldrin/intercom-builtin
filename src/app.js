import "./menu.js";
import "./elements/internal/index.js";

document.body.innerHTML += `
<com-network>
    <com-chain>
        <com-module type="LFO"></com-module>
        <com-module type="PRO"></com-module>
        <com-module>
            <com-out></com-out>
            <com-out></com-out>
        </com-module>
    </com-chain>
    <com-chain>
        <com-module type="BCH"></com-module>
        <com-module>
            <com-out></com-out>
        </com-module>
    </com-chain>
</com-network>
`;
