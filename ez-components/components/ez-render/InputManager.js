class InputManager
{
  mouse_btnmap = new Map([[0,"lmb"],[1,"mmb"],[2,"rmb"],[3,"tmb"],[4,"fmb"]]);
	mouse_pos = {x:null,y:null};
  // m_dx - Mouse x delta any number
  // m_dy - Mouse y delta any number
  // m_dw - Mouse wheel range (-1,0,+1)

  input_states = { m_dx: 0, m_dy: 0, m_dw: 0, always: 1, never: 0, unbound: 0 };
	input_update = function(){}
	last_wheel = null;
  constructor(surface)
  {		
		window.addEventListener("keydown",(event)=>
		{
			this.input_states[event.key.replace(" ","Space")]=1;
		});
		
		window.addEventListener("keyup",(event)=>
		{
			this.input_states[event.key.replace(" ","Space")]=0;
		});
		
		surface.addEventListener("mousedown", (event)=>
		{
			this.input_states[this.mouse_btnmap.get(event.button)]=1;
		});

		surface.addEventListener("mouseup", (event)=>
		{
			this.input_states[this.mouse_btnmap.get(event.button)]=0;
		});

		surface.addEventListener("wheel", (event)=>
		{
			let delta_t = 1;
			if(this.last_wheel != null){delta_t = Date.now() - this.last_wheel;}
			if(delta_t>1){delta_t=1;}
			this.input_states["m_dw"] +=  (-event.deltaY/math.abs(event.deltaY))*delta_t; 
			event.preventDefault();
			this.last_wheel = Date.now();
		});
	
		surface.addEventListener("mousemove", (event)=>
		{
			this.input_states.m_dx = -event.movementX;
			this.input_states.m_dy = -event.movementY;
		}, false);
    
    surface.addEventListener("mousenter", (event)=>{ surface.focus(); });

		// Resets inputs on mouse leave
		surface.addEventListener("mouseleave", (event)=> { this.input_states = { m_dw: 0,m_dx: 0, m_dy: 0, always: 1, never: 0, unbound: 0 }; });

  }
}
