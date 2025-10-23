//* Component ez-toggle *//
class ez_toggle extends HTMLElement {
	constructor() 
	{
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${path_array.join("/")}`;


		if(!this.toggled){ this.toggled=false; }

		this.addEventListener("click",(e)=>
		{
			let el = e.currentTarget;
		  let state_map1=new Map( [ ['true','false'],['false','true'] ] );
		  let state_map2=new Map( [ [true,false],[false,true] ] );

		  el.toggled= state_map2.get(el.toggled);
		  el.setAttribute("toggled",state_map1.get(el.getAttribute("toggled") )); 
		});

		shadowRoot.innerHTML = `<link rel="stylesheet" href="${this.component_root}/component.css"><slot></slot>`;
    let icons = this.querySelectorAll("icon");

    // Icon can be set through variable only if set in separate style child for every element <icon>
    for(let i=0; i<icons.length;i++)
  	{
  		let ico_pass = document.createElement("style");
  		ico_pass.innerHTML=
  			`
			icon {	
  			mask: var(--ico-src);
  			mask-mode: alpha;
  			mask-position: center;
  			mask-size: contain;
			}
			`;
			icons[i].appendChild(ico_pass);
  	}
	}
}

customElements.define("ez-toggle", ez_toggle);
console.log("Component ez-btn loaded.");
