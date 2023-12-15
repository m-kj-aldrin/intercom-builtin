let template = `
<style>
    #parameters{
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .row{
        display: flex;
        gap: 4px;
    }

    label{
        display: flex;
        flex-direction: column;
        gap: 1px;
    }
    input{
        max-width: 6ch;
    }
</style>
<div id="parameters">
  <div class="row">
      <label >freq<input data-index="0" type="number" /></label>
      <label >span<input data-index="1" type="number" /></label>
      <label >offset<input data-index="2" type="number" /></label>
      <label >band<input data-index="3" type="number" /></label>
  </div>
</div>
`;
export class OP_LFO extends HTMLElement {
  #init = false;
  constructor() {
    super();

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = template;

    this.shadowRoot.addEventListener("change", (e) => {
      this.dispatchEvent(
        new CustomEvent("com:parameter", {
          bubbles: true,
          detail: {
            data: {
              value: e.target.value,
              index: +e.target.dataset.index,
            },
          },
        })
      );
    });
  }

  connectedCallback() {
    if (!this.#init) {
      this.#init = true;
    }
  }
}

customElements.define("op-lfo", OP_LFO);
