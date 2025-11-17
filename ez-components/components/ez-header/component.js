//* Component ez-header *//
class ez_header extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });	
		let path_array = document.currentScript.getAttribute("src").split("/");
		this.component_root = `${window.components_root}/ez-header`;
		shadowRoot.innerHTML = `<link rel="stylesheet" href="${this.component_root}/component.css"><slot></slot>`;
	}
}
customElements.define("ez-header", ez_header);
console.log("Component ez-header loaded");
