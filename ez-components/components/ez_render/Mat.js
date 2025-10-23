class Mat
{
  // Creates matrix from array //
  // array - any arbitrary array following condition must apply => array.length%cols = 0
  // cols - specifies number count per row
  cells = [];
  rows = [];
  cols = [];

  static uniform(array)
  {
   if(Number.isInteger(math.sqrt(array.length))==false){throw new Error("Uniform Matrix creation exception:\n\tarray.length has not integer square.")}
   return new Mat(array,math.sqrt(array.length));
  }

  constructor(array,cols)
  {
    this.cells = array;
    if(array.length%cols)
    { 
      throw new Error
      (
        "Matrix constructor - Syntax error",
        { cause: "Incompatible shape - (mat.cells / cols is not an integer)" },
      );
    }
    let rowc = array.length/cols;
    
    for(let c=0; c<rowc; c++)
    {
      this.rows.push(array.slice(c*cols,(c*cols)+cols));
    }

    for(let col=0; col<cols; col++)
    {
      let columns = [];
      for(let row = 0; row<rowc; row++)
      {
        columns.push(array[(row*cols)+col]);
      }
      this.cols.push(columns);
    }
  }

  toString()
  {

    let nrows = [];
    for(let i = 0; i<this.rows.length;i++) {nrows.push("{"+this.rows[i].join(",")+"}");}
    return "{"+nrows.join(",")+"}";
  }

  rowc()
  {
    return this.rows.length;
  }

  colc()
  {
    return this.cols.length;
  }
  cellc()
  {
    return this.cells.length;
  }

  shape()
  {
    return [this.rowc(),this.colc()];
  }

  flat()
  {
    return this.cells.flat();
  }
  
  add(mat)
  {
    let rows = mat.rowc();
    let cols = mat.colc();
    let nmat = [];

    if(this.shape().toString()!=mat.shape().toString())
    {
      throw new Error
      (
        "Matrix adddition - Bad Operand",
        { 
          cause: "Shape mismatch [" + this.shape() + "],[" + mat.shape() + "]",
        }
      );
    }

    for(let i=0; i<this.cells.length; i++) { nmat.push(this.cells[i] + mat.cells[i]); }

    return new Mat(nmat,cols);
  }

  multiply(mat,transpose=false)
  {
    let nmat = [];
    let mat1 = this;
    let mat2 = mat;
    if(this.colc() != (transpose ? mat.transpose() : mat).rowc() )
    {
      throw new Error
      (
        "Matrix multiplication - Bad operand",
        {
          cause: `Shape error [${mat1.shape()}] × [${mat2.shape()}] (mat1.cols≠mat2.rows)`,
        }
      );
    }
    
    mat2 = transpose==true ? mat.transpose() : mat;
    let ncol_size = mat2.shape()[1];


    for(let r_id = 0; r_id < mat1.rowc(); r_id++)
    {
      let row = new Array(ncol_size).fill(0);
      for (let c_id = 0; c_id<mat2.colc(); c_id++)
      {
        for(let m_id=0; m_id<mat1.colc(); m_id++)
        {
          row[c_id]=row[c_id]+( (mat1.rows[r_id][m_id]) * (mat2.cols[c_id][m_id]) );
        }
      }
      nmat.push(row);
    }
    return new Mat(nmat.flat(),ncol_size);
  }

  transpose()
  {
    return new Mat(this.cols.flat(),this.rowc());
  }

}
