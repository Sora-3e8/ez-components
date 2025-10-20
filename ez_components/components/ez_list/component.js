//* Component ez-list *//
class ez_list extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${path_array.join("/")}`;

		shadowRoot.innerHTML = `
    <link rel="stylesheet" href="${component_root}/component.css">
    <slot></slot>
    `;
	}
}
customElements.define("ez-list", ez_list);
console.log("Component ez-list loaded");
