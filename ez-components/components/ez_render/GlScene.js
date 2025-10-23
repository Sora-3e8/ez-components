class GlScene
{
  object_list = [];
  cam_manager = null;
  
  constructor()
  {
    this.cam_manager = new GlCamManager();
  }

  add_object(object)
  {
    this.object_list.push(object);
  }

  remove_object(index)
  {
    this.object_list.splice(index,1);
  }

  update(gl,surface,shader)
  {
    this.cam_manager.update(gl,surface,shader);
    for(let i=0; i<this.object_list.length; i++){ this.object_list[i].update(gl,surface,shader); }
	}
}

class GlObject
{
  render_method = "wireframe";
  
  local_pos = {x: 0, y: 0, z: 0};
  position = {x: 0, y: 0, z: 0};
  
  local_rot = {pitch: 0, yaw: 0, roll: 0};
  rotation = {pitch: 0, yaw: 0, roll: 0};

  color = null;
  texture = null;

  constructor(geometry,position={x:0,y:0,z:0},rotation={pitch:0,yaw:0,roll:0},color=[1,1,1,1])
  {
    if(geometry.length/3){ throw new Error("GlObject constructor - Bad vertices",{cause: "Vertex buffer corrupted (gemetry.vertices.len/3) not an integer."});}
    this.geometry = geometry;
    this.position = position;
    this.rotation = rotation;
    this.color = color;
  }

  /* Draws object into scene */
  update(gl,surface,shader)
  {
    // Loads in color buffer if given otherwise loads texture buffer if it is given//
    let tint = [1.0,1.0,1.0,1.];
    if( this.color ){tint = this.color;}
    gl.uniform4fv(shader.colorBuffer, new Float32Array(tint));
    if ( this.texture) { /*Handle texture}*/ }
    // Loads in color buffer if given otherwise loads texture buffer if it is given//   
    

    //Sets object position transform//
    let mat_rot = Mutils.Rotate(this.rotation.pitch,this.rotation.yaw,this.rotation.roll);
    let mat_transl = Mutils.Translate(this.position.x,this.position.y,this.position.z);
    let mat_trans = mat_transl.multiply(mat_rot,true);

    //let mat_trans = mat_transl.multiply(mat_pitch,true).multiply(mat_yaw,true).multiply(mat_roll,true);
    gl.uniformMatrix4fv(shader.objectTransform, true, new Float32Array(mat_trans.cells));
    // Loads in vertex buffer //


    let vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices),gl.STATIC_DRAW);

		//gl.drawArrays(gl.LINE_LOOP,0,this.geometry.vertices.length/3);

    // Loads in vertex buffer //
  
    // Loads in vertex indices buffer //
    let indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    let indices = this.geometry.indices;
    //if(this.render_method == "wireframe"){ indices = []; for(let i=0; i<this.geometry.vertices.length/3;i++){ indices.push(i); } }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices),gl.STATIC_DRAW);

    // Loads in vertex indices buffer //

    // Final draw call //

    if(this.geometry.length/3){throw new Error("GlObject draw-call - Corrupted geometry",{cause: "Vertex buffer corrupted (gemetry.vertices.len/3) not an integer"});}
    gl.vertexAttribPointer(shader.geometryBuffer, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shader.geometryBuffer);
    if(this.render_method == "wireframe")
    {
      gl.drawElements(gl.LINE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
    }

    if(this.render_method=="shaded")
    {
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
    // Final draw call //
  }
  /* Draws object into scene */

}
