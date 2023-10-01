import COMGlobal from "./Global.js";

import COMNetwork from "./Network.js";
import COMChain from "./Chain.js";
import COMModule from "./Module.js";
import COMParameter from "./Parameter.js";
import COMOut from "./Out.js";
import COMPeriphial from "./Periphial.js";

import XFlex from "../layout/x-flex.js";

customElements.define("com-global", COMGlobal);

customElements.define("com-network", COMNetwork);
customElements.define("com-chain", COMChain);
customElements.define("com-module", COMModule);
customElements.define("com-out", COMOut);
customElements.define("com-parameter", COMParameter);
customElements.define("com-periphial", COMPeriphial);

customElements.define("x-flex", XFlex);
