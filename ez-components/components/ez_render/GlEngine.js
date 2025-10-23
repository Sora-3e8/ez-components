class GlEngine
{  
  gl = null;
  surface = null;
  Scene = null;
  selected_scene = null;
  scene_list = [];
  shader_builder = null;
  shader = null;

  // surface is rendering area of type [Canvas]
  // shader_src is object consisting of shader source code { vertex: vertex_src<string>, fragment: frag_src<string>}
  constructor(surface, shader_src = GlShaderFactory.shaders.wireframe, debug = false)
  {
    this.surface = surface;
    this.gl = surface.getContext("webgl2", {antialias: true});
    this.shader_builder = GlShaderFactory(this.gl);
    this.set_shader(shader_src);        
    this.add_scene(new GlScene(this.surface));
    this.use_scene(0);

    if(debug){ this.gl.clearColor(0.0, 0.0, 0.0, 1.0); } //Debug blackening of canvas
  }

  add_scene(scene)
  {
    this.scene_list.push(scene);
  }

  set_shader(shader_src)
  {
    this.shader = this.shader_builder.build(shader_src);
    this.gl.useProgram(shader.program);
  }

  bind_surface(surface)
  {
   this.bound_surface = surface;
   this.virtual_surface.width = this.bound_surface.offsetWidth;
   this.virtual_surface.height = this.bound_surface.offsetHeight;
   this.update();
  }

  get_scenes()
  {
    return this.scene_list;
  }

  init_context()
  {
    const gl = this.gl;
    if(bg_color){ gl.clearColor(0.0, 0.0, 0.0, 1.0); } //Debug blackening of canvas
		gl.viewport(0,0,this.virtual_surface.width,this.virtual_surface.height);
		gl.enable(gl.DEPTH_TEST);	
		gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	}

  remove_scene(index)
  {
    this.scene_list.splice(index,1);
  }

  use_scene(index)
  {
    this.Scene = scene_list[index];
  }

  update()
  {
    this.Scene.update();
  }
}


