export default class XFlex extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML += `
    <style>
        :host{
            display: flex;
            flex-direction: column;
            gap: 4px;
            flex-grow: 1;
        }

        :host([row]){
            flex-direction:row;
        }
    </style>
    <slot></slot>
    `;
    }
}
