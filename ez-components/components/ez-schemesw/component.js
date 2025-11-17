// Component ez-schemesw
class ez_schemesw extends HTMLElement 
{
	constructor()
	{
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${window.components_root}/ez-schemesw`;

		shadowRoot.innerHTML = `<link rel="stylesheet" href="${this.component_root}/component.css"><state-icon/>`;
		this.feature_check();
    this.setAttribute("state","light dark");
	  
	  // Updates scheme - supposed to be bound to onclick
	  this.stateswitch = new Map([["light dark","dark"],["dark","light"],["light","light dark"]]);
		this.addEventListener("click", () => this.lightdark_toggle());	
	}

	feature_check()
	{
		// Querries page for <meta name="color-scheme" content="*">
  	let meta_colorcheme = document.querySelector('meta[name="color-scheme"]');

  	// If not found in document it will attempt to add it, it's required to control color-scheme
  	if(meta_colorcheme==null)
  	{
  		// Creates New meta for scheme switching
  		let new_meta_colorcheme = document.createElement("meta");
  		new_meta_colorcheme.setAttribute("name","color-scheme");
  		new_meta_colorcheme.setAttribute("content","light dark"); // Default follows system
  		document.head.appendChild(new_meta_colorcheme);
  		// Creates New meta for scheme switching
							  		
  		// Operation success verification
  		meta_colorcheme = document.querySelector('meta[name="color-scheme"]');
  		if(meta_colorcheme != null){ this.schemenode = meta_colorcheme; } 
  		else{console.log("Critical error: color scheme control acquisition failed!");}
  	}
  	else { this.schemenode = meta_colorcheme;} // Stores retrieved meta for scheme control
	}

	lightdark_toggle() 
	{
		// New value is set thanks to clever filtering through Map (Dictionary)
		this.schemenode.content = this.stateswitch.get(this.schemenode.content);
		this.setAttribute("state",this.schemenode.content);
	}
}
customElements.define("ez-schemesw", ez_schemesw);
console.log("Component ez-schemesw loaded.");
