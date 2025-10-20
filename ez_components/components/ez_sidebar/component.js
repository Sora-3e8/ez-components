class ez_sidebar extends HTMLElement {
	constructor() 
    {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${path_array.join("/")}`;

        shadowRoot.innerHTML = `<link rel="stylesheet" href="${component_root}/component.css"><slot></slot>`;
        this.style.display="none";
        window.addEventListener("hashchange",()=>{this.check_state()});
        this.check_state();
	}

  check_state()
  {
    let inner_target=this.querySelector(":target");
    if(inner_target!=null){ this.style.display="block"; } else{ this.style.display="none"; }
  }
	
}
customElements.define("ez-sidebar", ez_sidebar);
console.log("Component ez-sidebar loaded");
