import "./operators/_index.js";

const network_template = `
<style>
  :root{
    display: block;
  }

  #chains {
    display: flex;
    gap: 2px;
  }
</style>
<div id="chains"><slot></slot></div>
`;

class COMNetwork extends HTMLElement {
  /**@type {Map<COMChain,{}>} */
  #chains = new Map();
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = network_template;
  }

  #index_chains() {
    let i = 0;
    for (const [chain, props] of this.#chains) {
      chain.index = i;
      i++;
    }
  }

  add_chain(chain) {
    /**@type {COMChain} */
    let new_chain = chain || document.createElement("com-chain");

    this.#chains.set(new_chain, {});

    this.#index_chains();

    this.appendChild(new_chain);

    return new_chain;
  }

  remove_chain(index) {
    let removed_chain;

    this.#chains.forEach((_, chain) => {
      if (chain.index == index || chain == index) {
        removed_chain = chain;
        chain.parentElement.removeChild(chain);

        this.#chains.delete(chain);
      }
    });

    this.#index_chains();

    return removed_chain;
  }
}

customElements.define("com-network", COMNetwork);

const chain_template = `
<style>
  :root,#modules {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
<div id="index"></div>
<div id="modules">
  <slot></slot>
</div>
`;

class COMChain extends HTMLElement {
  #init = false;
  #_index = -1;

  /**@type {COMNetwork} */
  #parent;

  /**@type {Map<COMModule,{}>} */
  #modules = new Map();

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = chain_template;
  }

  connectedCallback() {
    this.#parent = this.closest("com-network");
    if (!this.#parent) return;

    if (!this.#init) {
      this.#init = true;
    }
  }

  disconnectedCallback() {
    let c = this.index;

    let str_repr = `c -r ${c}`;

    console.log(str_repr);
  }

  set index(v) {
    this.#_index = v;
    this.shadowRoot.getElementById("index").textContent = v;
  }

  get index() {
    return this.#_index;
  }

  #index_modules() {
    let i = 0;
    [...this.children].forEach((child, i) => {
      if (child.index != i) child.index = i;
    });
  }

  remove() {
    this.#parent.remove_chain(this);
  }

  insert_module(type, index) {
    /**@type {COMModule} */
    let new_module;
    if (type instanceof COMModule) {
      new_module = type;
    } else {
      new_module = document.createElement("com-module");
      new_module.type = type;
    }

    this.#modules.set(new_module, {});

    let ref_element = this.children.item(index);

    new_module.index =
      index != undefined && ref_element ? index : this.children.length;

    this.insertBefore(new_module, ref_element);

    this.#index_modules();

    return new_module;
  }

  remove_module(index) {
    let removed_module;

    this.#modules.forEach((_, module) => {
      if (module.index == index || module == index) {
        removed_module = module;
        module.parentElement.removeChild(module);

        this.#modules.delete(module);
      }
    });

    this.#index_modules();

    return removed_module;
  }
}

customElements.define("com-chain", COMChain);

const module_template = () => {
  return `
  <style>
    :host{
      display: flex;
      flex-direction: column;
      width: 256px;
      border: 1px currentColor solid;
      padding: 2px;
    }

    header{
      display: flex;
      gap: 2px;
      padding: 2px;
      background-color: #ddd;
    }

    #operator{
      background-color: white;
      padding: 2px;
      display:grid;
      place-content:center;
    }
  </style>
  <header>
    type:
    <div id="type"></div>
    |idx:
    <div id="index"></div>
  </header>
  <div id="operator">
    <slot></slot>
  </div>
  `;
};

class COMModule extends HTMLElement {
  #init = false;
  #type = "PTH";
  #_index = -1;

  /**@type {COMChain} */
  #parent = undefined;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = module_template();

    this.shadowRoot.addEventListener("com:parameter", (e) => {
      let value = e.detail.data.value;
      let c = this.#parent.index;
      let m = this.index;
      let p = e.detail.data.index;

      let str_repr = `p -c ${c} -m ${m} ${p}:${value}`;

      console.log(str_repr);
    });
  }

  set index(v) {
    this.#_index = v;
    this.shadowRoot.getElementById("index").textContent = v;
  }

  get index() {
    return this.#_index;
  }

  get type() {
    return this.getAttribute("type") ?? this.#type;
  }

  set type(t) {
    this.#type = t;
  }

  remove() {
    if (!this.#parent) return;
    return this.#parent.remove_module(this);
  }

  connectedCallback() {
    this.#parent = this.closest("com-chain");
    if (!this.#parent) return;

    let c = this.#parent.index;
    let m = this.index;

    let str_repr = `c ${c} -i ${m} ${this.type}`;

    console.log(str_repr);

    if (!this.#init) {
      this.shadowRoot.getElementById("type").textContent = this.type;
      this.shadowRoot.getElementById(
        "operator"
      ).innerHTML = `<op-${this.#type.toLowerCase()}></type>`;

      this.#init = true;
    }
  }

  disconnectedCallback() {
    if (this.#parent.isConnected) {
      let c = this.#parent.index;
      let m = this.index;

      let str_repr = `m -c ${c} -r ${m}`;

      console.log(str_repr);
    }

    this.#parent = undefined;
  }
}

customElements.define("com-module", COMModule);

/**@type {COMNetwork} */
const network = document.createElement("com-network");
document.body.appendChild(network);

let c0 = network.add_chain();
let c0m0 = c0.insert_module("LFO");
c0.insert_module("PTH");

let c1 = network.add_chain();
c1.insert_module("PRO");
c1.insert_module("PTH");
c1.insert_module("BCH");

console.log("\n");
// c0m0.remove();

let c1m = c1.insert_module("LFO", 2);
// c1m.remove();
c0.insert_module(c1m, 0);
