//* Component list add all your custom components here*//
// Consider moving to standalone file check if it won't hurt performance
let component_list = 
	[
		"ez-schemesw",
		"ez-header",
		"ez-button",
		"ez-sidebar",
		"ez-toggle",
		"ez-list",
		"ez-item",
		"ez-render"
	];
let path_array = document.currentScript.getAttribute("src").split("/");
path_array.pop();
let components_root =  `${path_array.join("/")}/components/`;

//* Loads components from list *//
for (let i = 0; i < component_list.length; i++)
{
	let component = document.createElement("script");
	component.setAttribute("src", components_root + component_list[i]+"/component.js");
	document.head.appendChild(component);
}
