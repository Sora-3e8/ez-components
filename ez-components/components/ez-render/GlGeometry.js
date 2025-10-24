class GlGeometry
{
  vertices = [];
  indices = [];

  constructor(vertices,indices)
  {
    this.vertices = vertices;
    this.indices = indices;
  }

  static rectangle(w,h)
  {
    let inds = [0,1,2,2,3,0];

    let l1 = w/2;
    let l2 = h/2;

    let a = { x: -l1, y: -l2 };
    let b = { x:  l1, y: -l2 };
    let c = { x:  l1, y:  l2 };
    let d = { x: -l1, y:  l2 };

    let verts =[
      a.x,a.y,0,
      b.x,b.y,0,
      c.x,c.y,0,
      d.x,d.y,0,
    ];

    return new GlGeometry(verts,inds);
  }

  static line2d(points)
  {
    let verts = points.flat();
    let inds = [];
    for(let i=0;i<verts.length/3; i++)
    {

      inds.push(i);
    }

    verts = verts.flat();

    return new GlGeometry(verts,inds);
  }

  static triangle(w,h)
  {
    
  }

  static circle(rad, res)
  {
    let verts = [];
    let inds = [];
    for(let i=0;i<(360*res);i++)
    {
      inds.push(i);
      let a = (math.pi/(180*res)) * i ;
      let x = math.cos(a) * rad * 0.5;
      let y = math.sin(a) * rad * 0.5;
      let z = 0;
      verts.push(x)
      verts.push(y);
      verts.push(z);
    }
    return new GlGeometry(verts,inds);
  }

  static cube(a)
  {
    let b = a/2;
    let inds = 
      [
        // Front face
        0,1,2,2,3,0,

        // Right face
        1,5,6,6,2,1,

        // Back face
        5,4,7,7,6,5,

        // Left face
        4,0,3,3,7,4,

        // Top face
        7,3,2,2,6,7,

        // Bottom face
        4,5,1,1,0,4,
      ];
    let verts = 
      [
         // Front side
        -b, -b, b,
         b, -b, b,
         b,  b, b,
        -b,  b, b,

         // Back side
        -b, -b, -b,
         b, -b, -b,
         b,  b, -b,
        -b,  b, -b,
      ];

    return new GlGeometry(verts,inds);
  }
}


