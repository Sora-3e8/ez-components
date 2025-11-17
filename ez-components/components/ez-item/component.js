//* Component ez-item *//
class ez_item extends HTMLElement 
{
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });
		
		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${window.components_root}/ez-item`;

		shadowRoot.innerHTML = `
    <link rel="stylesheet" href="${this.component_root}/component.css">
    <slot></slot>
    `;
		this.addEventListener("click", (event) => { if(event.target != this){event.stopPropagation();this.click(); }});

	}
}
customElements.define("ez-item", ez_item);
console.log("Component ez-item loaded");
