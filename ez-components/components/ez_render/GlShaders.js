class GlShaderBuilder
{
  constructor()
  {

  }

  static _buildPart_(gl,type, source) 
  {
    const new_shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(new_shader, source);

    // Compile the shader program
    gl.compileShader(new_shader);

    let res = {shader: new_shader ,errors: `${gl.getShaderInfoLog(new_shader)}`};
    if (!gl.getShaderParameter(new_shader, gl.COMPILE_STATUS)){gl.deleteShader(new_shader);}
    return res;
  }

  static _linkParts_(gl,vertexShader,fragmentShader)
  {
	  const new_shader = gl.createProgram();
    gl.attachShader(new_shader, vertexShader);
    gl.attachShader(new_shader, fragmentShader);
    gl.linkProgram(new_shader);
    let res = {shader: new_shader, errors: `${gl.getProgramInfoLog(new_shader)}`};
    return res;
  }
}

class GlShaderFactory
{ 
  static shaders = { wireframe: {
    vertex:`#version 300 es
	  precision mediump float;
	  in vec3 geometryBuffer;
	  uniform vec4 vecColor;
	  out vec4 f_Color;
    uniform mat4 objectTransform;
    uniform mat4 camTransform;
    uniform mat4 projectionMatrix;

	  void main() 
    {
		  gl_Position = projectionMatrix * camTransform * objectTransform * vec4(geometryBuffer,1.0);
		  f_Color = vecColor;
    }`,
    fragment: `#version 300 es
	  precision mediump float;
	  in vec4 f_Color;
	  out vec4 fragColor;
    void main()
	  {
      fragColor = f_Color;
    }`},
  };

  constructor() 
  {
  }

  // shader_src is shader_src object: {vertex: vertex_src<string>, fragment: fragment_src<string>}
  static build(gl,shader_src)
  {
    let vertex_build = GlShaderBuilder._buildPart_(gl,gl.VERTEX_SHADER,shader_src.vertex);
    if(vertex_build.errors){ console.log("Vertex build errors:\n\t"+vertex_build.errors); }
    
    let fragment_build = GlShaderBuilder._buildPart_(gl,gl.FRAGMENT_SHADER,shader_src.fragment);
    if(fragment_build.errors){ console.log("Fragment build errors:\n\t"+fragment_build.errors); }
    
    if(vertex_build.errors || fragment_build.errors){return null;}

    let shader_linked = GlShaderBuilder._linkParts_(gl,vertex_build.shader, fragment_build.shader);
    
    // Logs linker errors
    if(shader_linked.errors)
    {
      console.log("Linker errors:\n\t"+shader_linked.errors); 
      return null;
    }
    console.log("Shader build success!");
    let shader = 
		{
			program: shader_linked.shader,
			geometryBuffer: gl.getAttribLocation(shader_linked.shader,"geometryBuffer"),
			colorBuffer: gl.getUniformLocation(shader_linked.shader,"vecColor"),
			camTransform: gl.getUniformLocation(shader_linked.shader,"camTransform"),
			objectTransform: gl.getUniformLocation(shader_linked.shader,"objectTransform"),
			projectionMatrix: gl.getUniformLocation(shader_linked.shader,"projectionMatrix"),
		};

    return shader;
  }
}

