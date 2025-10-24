//* Mutils - The Matrix Utils *//

mAxis = { X: 0, Y: 1,Z: 2};

function vec_len(vec)
{
	return math.sqrt(math.pow(vec.x,2)+math.pow(vec.y,2)+math.pow(vec.z,2));
}

// Allows quick generation of matrices satisfying common transformations used in 2d/3d rendering
class Mutils
{

	constructor(){}

	// Common Identity matrix //
	static Identity()
	{
		let matrix = [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1,
		];
		return Mat.uniform(matrix);
	}
	// Common Identity matrix //


	//* Projection methods *//
	static Ortho(l,r,t,b,zNear,zFar)
	{
  	let matrix = 
  		[ 
  			2/(r-l),        0,            0,                      -( (r+l)/(r-l) ),
  		  0,           2/(t-b),        0,                       -( (t+b)/(t-b) ),
  		  0,              0,      -2/(zFar-zNear),              -( (zFar+zNear)/(zFar-zNear) ),
  		  0,              0,           0,                       1,
  		];
  	return Mat.uniform(matrix);
  }

	//* Projection methods *//
	
	// aspect - aspect ratio
	// vec - unit vector matching angle of the camera
	// dist - zoom/scale of the 2D image 
	// Camea's 3D relative distance does not work for this projection
	static Parallel_proj(aspect,vec,dist)
  {
		let ws = dist;
    // Squish to plane of arbitrary alignment unit vector vec
		let sq = {x: 1, y: 1, z: 1-vec.z};
	 
		let matrix = 
		[
			sq.x/aspect,   0,    0,     0,
			    0,        sq.y,  0,     0,
			    0,         0,   sq.z,   0,
			    0,         0,    0,    dist
		];
		return Mat.uniform(matrix);
	}

	// aspect - aspect ratio
	// fov - field of view [rad]
	// zNear - clipping near
	// zFar - clipping far
	static Perspective(aspect, fov,zNear, zFar)
	{
		let f = math.cot(fov/2);
		let matrix = 
			[
				(f/aspect),  0,               0,                            0,
				   	0,       f,               0,                            0,
					 	0,       0,   (zFar+zNear)/(zNear-zFar),  (2*zFar*zNear)/(zNear-zFar),
					 	0,       0,              -1,                            0,                 
			];
		return Mat.uniform(matrix);
	}
	//* Projection methods *//

	//* Common transformations *//

  static Translate(x,y,z)
	{
		let mat = 
			[
				1,0,0,x,
				0,1,0,y,
				0,0,1,z,
				0,0,0,1,
			];

		let matrix = Mat.uniform(mat);
		return matrix;
	}

	// pitch - angle [rad]
	// yaw - angle [rad]
	// roll - angle [rad]
	static Rotate(pitch,yaw,roll)
	{

    let mat_pitch = Mat.uniform
    (
      [
        1,          0,              0,          0,
        0,  math.cos(pitch),-math.sin(pitch),   0,
        0,  math.sin(pitch), math.cos(pitch),   0,
        0,          0,              0,          1,
      ]
    );

    let mat_yaw = Mat.uniform
    (
      [
         math.cos(yaw),  0,  math.sin(yaw),  0,
               0,        1,        0,        0,
        -math.sin(yaw),  0,  math.cos(yaw),  0,
               0,        0,        0,        1,
      ]
    );

    let mat_roll = Mat.uniform
    (
      [
        math.cos(roll),  -math.sin(roll),  0,  0,
        math.sin(roll),   math.cos(roll),  0,  0,
             0,                 0,         1,  0,
             0,                 0,         0,  1,
      ]
    );

		let matrix = mat_pitch.transpose().multiply(mat_yaw,true).multiply(mat_roll,true);
		return matrix;
	}

	static Scale(sx,sy,sz)
	{
		let mat = 
		[
			sx,  0,  0, 0,
			 0, sy,  0, 0,
			 0,  0, sz, 0,
			 0,  0,  0, 1,
		];
		let matrix = Mat.uniform(mat);
		return matrix;
	}
	
	// Combined transform matrix

	// x - pos along x axis, y - pos along y axis, z - pos along z axis
	// pitch - angle [rad], yaw - angle [rad], roll - angle [rad]

	// sx - arbitrary number scales x axis, sy - arbitrary number scales y axis, sz - arbitrary number scales z axis
	static Transform(x,y,z,pitch,yaw,roll,sx,sy,sz)
	{
		let matrix = Mutils.Translate(x,y,z).transpose().multiply(Mutils.Rotate(pitch,yaw,roll),true).multiply(Mutils.Scale(sx,sy,sz),true);

		return matrix;
	}
	//* Common transformations *//


}
//* Mutils - The Matrix Utils *//

// Made by: Sora3e8
