//* GlCam - OpenGL Camera * //

/* 
Dependencies: Mutils.js

Description:
  Simple camera object, handles common projection methods and tranformations
  Cam types: First person, Orbit camera
  Transformations: Translation,Rotation,Translation+Rotation, Scaling, Transl+Rot+Scaling

Features:
	Camera
	CamManager
	Transformations: Position,rotation, scaling
	Camera types: firstperson, orbit
	Projection methods: Perspective,Orthographic, Orthogonal

Dependencies:
	Mat
	Mutils

Prerequisites: 
	gl_context
	surface[canvas object]
	shader = {program: compiledShader,camTransform: camTransform<uniform mat4>,projectionMatrix: projectionMatrix<uniform mat4>}

Explanation:  
	One matrix always contains Identity matrix the 2 matrices left store Translation and Rotation or Rotation+Tranlation, order depends on CamType 

*/ 
const GlCamType = {firstperson: 0, orbit: 1};
const GlCamProjType = {perspective: 0, orthographic: 1, orthogonal: 2};


class GlCamManager
{
	Camera = null;
	cam_list = [];
	aligned_vector = [];
	selected_cam = null;

	constructor(){}

	add_cam(cam_obj)
	{
		this.cam_list.push(cam_obj);
	}

	use_cam(index)
	{
		this.selected_cam = index;
		this.Camera = this.cam_list[index];
	}

	remove_cam(index)
	{
		this.cam_list.splice(index,1);
	}

	get_cam(index)
	{
		return this.cam_list[index];
	
	}

	get_cams()
	{
		return this.cam_list;
	}

	rotate(pitch,yaw)
	{

		this.Camera.pitch += this.Camera.ryspeed*pitch;
		this.Camera.yaw += this.Camera.rxspeed*yaw;
	}

	move_forward(k)
	{
		this.Camera.x += (this.uvec_forward().x * k * this.Camera.mspeed);
		this.Camera.y += (this.uvec_forward().y * k * this.Camera.mspeed);
		this.Camera.z += (this.uvec_forward().z * k * this.Camera.mspeed);
	}

	move_right(k)
	{
		this.Camera.x += (this.uvec_right().x * k * this.Camera.mspeed);
		this.Camera.y += (this.uvec_right().y * k * this.Camera.mspeed);
		this.Camera.z += (this.uvec_right().z * k * this.Camera.mspeed);		
	}
	
	move_back(k)
	{
		this.Camera.x += (this.uvec_back().x * k * this.Camera.mspeed);
		this.Camera.y += (this.uvec_back().y * k * this.Camera.mspeed);
		this.Camera.z += (this.uvec_back().z * k * this.Camera.mspeed);
	}

	move_left(k)
	{
		this.Camera.x += (this.uvec_left().x * k * this.Camera.mspeed);
		this.Camera.y += (this.uvec_left().y * k * this.Camera.mspeed);
		this.Camera.z += (this.uvec_left().z * k * this.Camera.mspeed);
	}

	zoom_incr(k)
	{
		if(this.Camera.projection_type == GlCamProjType.orthogonal || this.Camera.cam_type == GlCamType.orbit)
		{
			if(this.Camera.cam_type == GlCamType.orbit)
			{
				let sign = k/math.abs(k);
				let z = math.pow(10,-k*this.Camera.zoom_speed); 
				this.Camera.wz = this.Camera.wz * math.max(z,0);
			}
			else
			{
				let z = math.pow(10,k*this.Camera.zoom_speed); 
				this.Camera.wz = this.Camera.wz * z;
			}
		}	
	}

	update(gl,surface,shader)
	{
		this.Camera.set(gl,surface,shader);
		if(this.Camera.cam_type == GlCamType.orbit && this.Camera.show_orbitpivot)
		{
			new GlObject(GlGeometry.cube(0.08),{x:-this.Camera.x,y:-this.Camera.y,z:-this.Camera.z}).update(gl,surface,shader);
		}


	}

	// unit vector cam forward
	uvec_forward()
	{
		let cams = this.cam_list;
		let cid = this.selected_cam;
		let xz_len = math.cos(cams[cid].pitch);
		let uvec = { x: xz_len * math.sin(cams[cid].yaw), y: math.sin(-cams[cid].pitch), z: xz_len * math.cos(cams[cid].yaw), };
		
		return uvec;
	}
	
	// unit vector cam back
	uvec_back()
	{
		let cams = this.cam_list;
		let cid = this.selected_cam;
		let xz_len = math.cos(cams[cid].pitch);
		let uvec = { x: -xz_len * math.sin(cams[cid].yaw), y: -math.sin(-cams[cid].pitch), z: -xz_len * math.cos(cams[cid].yaw), };

		return uvec;
	}
	
	// unit vector cam left
	uvec_left()
	{
		let cams = this.cam_list;
		let cid = this.selected_cam;
		let xz_len = 1;
		let uvec = { x: xz_len * math.sin(cams[cid].yaw+(math.pi/2)), y: 0, z: xz_len * math.cos(cams[cid].yaw+(math.pi/2)), };
		
		return uvec
	}

	// unit vector cam right
	uvec_right()
	{
		let cams = this.cam_list;
		let cid = this.selected_cam;
		let xz_len = -1;
		let uvec = { x: xz_len * math.sin(cams[cid].yaw+(math.pi/2)), y: 0, z: xz_len * math.cos(cams[cid].yaw+(math.pi/2)), };

		return uvec
	}

}

class GlCam
{
	//* Projection parameters *//
	
	projection_type = GlCamProjType.perspective;
	cam_type = GlCamType.firstperson;
	show_orbitpivot = false;
	mspeed = 0.1;
	rxspeed = 0.001;
	ryspeed = 0.005;
	zoom_speed = 0.05;

	// Required for perspective [Default: 45 deg converted to Radians]
	fov = (2*math.PI/360)*45;

	// Required for aspect_ratio and Orthographic projection
	
	zNear = 0.1;
	zFar = 1000;

	//* Projection parameters *//

  // Cam pos //
	x = 0;
	y = 0;
	z = 0;
	// Cam pos //

	// Relative pos offset (for orbit camera) //
	wx = 0;
	wy = 0;
	wz = 0.25;
	// Relative pos offset (for orbit camera) //

  // Cam alignment //
	pitch = 0;
	yaw =   0;
	roll =  0;
	// Cam alignment //

	constructor(projection_type=GlCamProjType.perspective,cam_type=GlCamType.firstperson)
	{
		this.projection_type = projection_type;
		this.cam_type = cam_type;
	}

	set(gl,surface,shader)
	{
		if(this.projection_type==GlCamProjType.orthogonal)
		{
			if(gl.isEnabled(gl.DEPTH_TEST))
			{
				gl.disable(gl.DEPTH_TEST);
			}
		}
		else{if(gl.isEnabled(gl.DEPTH_TEST)==false){gl.enable(gl.DEPTH_TEST);}}
		this._set_projection_(gl,surface,shader);
		this._set_transform_(gl,shader);
	}

	_set_projection_(gl,surface,shader)
  {
		let aspect = surface.width / surface.height;

  	if (this.projection_type == GlCamProjType.perspective)
		{

			let m_proj = Mutils.Perspective(aspect,this.fov,this.zNear,this.zFar).cells;
			gl.uniformMatrix4fv(shader.projectionMatrix, true, new Float32Array(m_proj));
		}

		if (this.projection_type == GlCamProjType.orthographic)
		{
			let m_proj = Mutils.Ortho(-aspect,aspect,1,-1,this.zNear,this.zFar).cells;
			gl.uniformMatrix4fv(shader.projectionMatrix, false, new Float32Array(m_proj));
		}

		if (this.projection_type == GlCamProjType.orthogonal)
		{
			let m_vec = new Mat([0,0,1,0],4).multiply(Mutils.Rotate(this.pitch,this.yaw,this.roll).transpose()).cells;
			let lookVec = {x:m_vec[0], y:m_vec[1], z:m_vec[2]};
			//let lookVec = {x:0,y:0,z:1};
			let m_proj = Mutils.Parallel_proj(aspect,lookVec,this.wz).cells;
			gl.uniformMatrix4fv(shader.projectionMatrix, true, new Float32Array(m_proj));
		}

  }

  _set_transform_(gl,shader)
	{
		if(this.cam_type == GlCamType.firstperson)
		{
	
			let m_rot = Mutils.Rotate(this.pitch,this.yaw,this.roll).transpose();
			let m_pos = Mutils.Translate(this.x,this.y,this.z).transpose();
			let m_identity = Mutils.Identity();
			let cam_matrix = m_pos.multiply(m_rot).multiply(m_identity);

			gl.uniformMatrix4fv(shader.camTransform,false,new Float32Array(cam_matrix.cells));
		}

		if(this.cam_type == GlCamType.orbit)
		{
			let m_rot = Mutils.Rotate(this.pitch,this.yaw,this.roll).transpose();
			let m_rot_inv = Mutils.Rotate(-this.pitch,-this.yaw,-this.roll).transpose();

			let m_pos = Mutils.Translate(this.x,this.y,this.z).transpose();
			let m_offset = Mutils.Translate(this.wx,this.wy,this.wz).transpose();

			let cam_matrix = Mutils.Translate(0,0,this.wz).multiply(Mutils.Transform(this.x,this.y,this.z,this.pitch,this.yaw,this.roll,1,1,1),true);

			gl.uniformMatrix4fv(shader.camTransform, true, new Float32Array(cam_matrix.cells));
		}
	}

}

