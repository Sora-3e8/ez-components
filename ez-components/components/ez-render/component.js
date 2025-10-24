//* Component ez-render *//

class ez_render extends HTMLElement {

	enable_dcamcontroller = true;
	camcontrols = {forward: "w",left: "a", back: "s",right: "d", pitch: "m_dy", yaw: "m_dx", rotate: "always", zoom: "m_dw"}

	constructor() 
	{
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		let path_array = document.currentScript.getAttribute("src").split("/");
		path_array.pop();
		this.component_root = `${path_array.join("/")}`;

		this.scene_list = [];
		this.Scene = null;
		this.selected_scene=null;
		this.render_interval = null;
		this.input_interval = null;
		
		//* Dependent scrips which had to be separated *//
		const deps = 
		[	
			"math.min.js",
			"Mat.js",
			"Mutils.js",
			"Colors.js",
			"InputManager.js",
			"GlCam.js",
			"GlScene.js",
			"GlShaders.js",
			"GlGeometry.js",
		];
		//* Dependent scrips which had to be separated *//
	
		this.loadDeps(deps);
		shadowRoot.innerHTML =
		`
		<link rel="stylesheet" href="${this.component_root}/component.css">
		<canvas></canvas>
		`;
		window.addEventListener("load",()=>{this.init();});
	}

	loadDeps(deps)
	{
		for(let i=0; i<deps.length; i++)
		{
			let dep = document.createElement("script"); 
			dep.src = `${this.component_root}/${deps[i]}`;
			this.shadowRoot.appendChild(dep);
		}
	}

	init()
	{
		this.init_element();
		this.init_rendering();
		this.init_inputs();
	}

	init_element()
	{
		this.surface = this.shadowRoot.querySelector("canvas");
		this.surface.width = this.surface.offsetWidth;
		this.surface.height = this.surface.offsetHeight;

		window.addEventListener("resize",(event)=>
		{ 
				this.surface.width=this.surface.offsetWidth;
				this.surface.height=this.surface.offsetHeight; 
				this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
		});

		//this.surface.addEventListener("click", async () => { await this.surface.requestPointerLock({unadjustedMovement: false});});
	}

	init_rendering()
	{
		this.gl = this.surface.getContext("webgl2", {antialias: true});
		const gl = this.gl;

		window.addEventListener("resize",(event)=>{ gl.viewport(0,0,this.surface.width,this.surface.height); });
		this.set_shader(GlShaderFactory.shaders.wireframe);
    gl.viewport(0,0,this.surface.width,this.surface.height);
    if(this.debug){gl.clearColor(0.0, 0.0, 0.0, 1.0);} //Debug blackening of canvas
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}

	set_shader(shader_src)
	{
		const gl = this.gl;
		this.shader = GlShaderFactory.build(gl,shader_src);
    gl.useProgram(this.shader.program);
	}
	
	init_inputs()
	{
		this.input_manager = new InputManager(this.surface);
		setInterval(()=> {if(this.enable_dcamcontroller == true){this.camcontrol_handle();}},10);

	}

	add_scene(scene)
	{
		this.scene_list.push(scene);
	}
	
	remove_scene(index)
	{
		this.scene_list.splice(index);
	}

	use_scene(index)
	{
		this.selected_scene = index;
		this.Scene = this.scene_list[index];
	}

	set_fps(fps)
	{
		if( this.render_interval != null ){ this.render_interval.clearInterval(); }
		this.render_interval = setInterval(()=> { requestAnimationFrame( ()=> { this.update(); }); },(1/fps)*1000);
	}
	camcontrol_handle()
	{	
		const camcontrols = this.camcontrols;

		if(this.Scene)
		{
			const input_states = this.input_manager.input_states;
			const CamManager = this.Scene.cam_manager;
			if(input_states[camcontrols["forward"]]){CamManager.move_forward(input_states[camcontrols["forward"]])};
			if(input_states[camcontrols["right"]]){CamManager.move_right(input_states[camcontrols["right"]])};
			if(input_states[camcontrols["back"]]){CamManager.move_back(input_states[camcontrols["back"]])};
			if(input_states[camcontrols["left"]]){CamManager.move_left(input_states[camcontrols["left"]])};
			if(input_states[camcontrols["pan_move"]])
			{
				CamManager.Camera.x-=(input_states["m_dx"]*CamManager.Camera.mspeed*CamManager.Camera.wz);
				CamManager.Camera.y+=(input_states["m_dy"]*CamManager.Camera.mspeed*CamManager.Camera.wz);
				input_states["m_dx"]=0;
				input_states["m_dy"]=0;
			}
			if(camcontrols["rotate"]!="never"){
				CamManager.Camera.show_orbitpivot = math.max(input_states[camcontrols["rotate"]],math.abs(input_states[camcontrols["zoom"]]));
			}
			if(input_states[camcontrols["zoom"]]){CamManager.zoom_incr(input_states[camcontrols["zoom"]]); input_states[camcontrols["zoom"]]=0;};
			if(input_states[camcontrols["rotate"]])
			{
				CamManager.rotate(input_states[camcontrols["pitch"]],input_states[camcontrols["yaw"]]);
				input_states[camcontrols["yaw"]]=0;
				input_states[camcontrols["pitch"]]=0;
			}


		}

	}

	update()
	{
		const gl = this.gl;

		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
		if(this.Scene){this.Scene.update(gl,this.surface,this.shader)};
	}
	
}
customElements.define("ez-render", ez_render);
console.log("Component ez-render loaded");
