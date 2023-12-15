let template = `
<div id="parameters">
parameters
</div>
`;
export class OP_PTH extends HTMLElement {
  #init = false;
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = template;
  }

  connectedCallback() {
    if (!this.#init) {
      this.#init = true;
    }
  }
}

customElements.define("op-pth", OP_PTH);
