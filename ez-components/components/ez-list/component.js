//* Component ez-list *//
class ez_list extends HTMLElement
{
  constructor()
  {
	  super();
    const shadowRoot = this.attachShadow({ mode: "open" });
		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${path_array.join("/")}`;
		shadowRoot.innerHTML = `<link rel="stylesheet" href="${this.component_root}/component.css"><slot></slot>`;
		this.onclick = (event)=>
		{
			if(this.selectable == true || this.getAttribute("selectable")=="true")
			{
				this.on_selected(event);
			}
		};
		
	}

	on_selected(event)
	{

		if(event.target.tagName == "EZ-ITEM")
		{
			this.selected_item = Array.prototype.indexOf.call(this.children,event.target);

			for(let i=0; i<this.children.length; i++)
			{
				if(this.selected_item == i){ this.children[i].setAttribute("selected","true"); } else{ this.children[i].setAttribute("selected",""); }
			}
		}
	}

	selected_up()
	{
		this.move_up(this.selected_item);
		this.selected_item -=1;
	}

	selected_down()
	{
		this.move_down(this.selected_item);
		this.selected_item +=1;
	}
	
	move_up(index)
	{
		if(index>0){ this.insertBefore(this.children[index], this.children[index-1]); }
	}

	move_down(index)
	{
		this.insertBefore(this.children[index+1], this.children[index]);
	}

	select_item(index)
	{

	}

}
customElements.define("ez-list", ez_list);
console.log("Component ez-dlist loaded");
