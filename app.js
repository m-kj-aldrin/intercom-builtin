class Base extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML += `
    <style>
        :host{
            display: flex;
            gap: 4px;
            flex-direction: column;

            padding: 4px;

            border: 1px currentColor solid;
        }
    </style>
    `;

    this.addEventListener("com:bus", (e) => {
      e.detail[this.constructor.name] = this;
    });
  }

  connectedCallback() {
    // this.emmitLifeCycle("connected");
  }

  emmitLifeCycle(type) {
    this.dispatchEvent(
      new CustomEvent("com:bus", {
        bubbles: true,
        detail: {
          emitter: this,
        },
      })
    );
  }
}

export class COMChain extends Base {
  constructor() {
    super();

    this.shadowRoot.innerHTML += `
    <x-flex>
        <slot></slot>
    </x-flex>
    `;
  }
}

export class COMModule extends Base {
  constructor() {
    super();

    this.shadowRoot.innerHTML += `
    <span>PTH</span>
    <div>
        <input type="text" value="0.5" is="com-parameter" />
    </div>
    `;
  }
}

export class COMParameter extends HTMLInputElement {
  constructor() {
    super();

    this.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("com:bus", {
          bubbles: true,
          composed: true,
          detail: {
            emitter: this,
          },
        })
      );
    });
  }
}

export class XFlex extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML += `
    <style>
        :host{
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
    </style>
    <slot></slot>
    `;
  }
}

customElements.define("x-flex", XFlex);

customElements.define("com-chain", COMChain);
customElements.define("com-module", COMModule);
customElements.define("com-parameter", COMParameter, { extends: "input" });

document.body.innerHTML += `
<com-chain>
    <com-module></com-module>
    <com-module></com-module>
    <com-module></com-module>
    <com-module></com-module>
</com-chain>
`;
