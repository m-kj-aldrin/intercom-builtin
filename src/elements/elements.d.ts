import ComBusEvent from "./com-bus";
import COMChain from "./internal/Chain";
import COMModule from "./internal/Module";
import COMNetwork from "./internal/Network";
import COMOut from "./internal/Out";
import COMParameter from "./internal/Parameter";
import COMPeriphial from "./internal/Periphial";

type ComUnion = COMChain | COMModule | COMOut;

declare global {
    interface HTMLElementTagNameMap {
        "com-network": COMNetwork;
        "com-chain": COMChain;
        "com-module": COMModule;
        "com-paramter": COMParameter;
        "com-out": COMOut;
        "com-parameter": COMParameter;
        "com-periphial": COMPeriphial;
    }
    interface HTMLElementEventMap {
        "com:bus": ComBusEvent;
    }
}
