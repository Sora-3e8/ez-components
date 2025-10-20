//* Component ez-renderer *//
class EssentialsRenderer extends HTMLElement
{
    ctx;
    cam_x = 0;
    cam_y = 0;
    event_move = false;
    current_scale = 0;
    mouse_x = 0;
    mouse_y = 0;
    touch_points = [];

	constructor() 
    {  
	    super();
	    const shadowRoot = this.attachShadow({ mode: "open" }); 
	   
	    shadowRoot.innerHTML = 
	    `<link rel="stylesheet" href="essentials_components/components/essential_renderer/component.css">
	    <canvas></canvas>`;
	     
        this.renderer = this.shadowRoot.querySelector("canvas"); 
        window.addEventListener("load",()=>{this.canvas_load();});

        this.addEventListener("touchstart",(event)=>{this.touch_start(event)});
        this.addEventListener("touchmove",(event)=>{this.touch_move(event)});
        this.addEventListener("mousedown", (event)=>{this.on_mousedown(event)});
        this.addEventListener("mouseup", (event)=>{this.on_mouseup(event)});
        this.addEventListener("mouseleave",(event)=>{this.on_mouseup(event)});
        this.addEventListener("mousemove", (event)=>{this.on_mousemove(event)});
        this.addEventListener("wheel", (event) => {this.on_desktop_zoom(event)});
        window.addEventListener("resize", (event)=>{this.on_resize(event)});

    

	}
	canvas_load()
    {
        this.renderer.width = this.renderer.offsetWidth;
        this.renderer.height = this.renderer.offsetHeight;
        this.ctx = this.renderer.getContext("2d");
        let dpr = window.devicePixelRatio;
        this.ctx.scale(dpr,dpr);


    }
    cam_move(val_x,val_y)
    {
        this.ctx.translate(val_x,val_y);
        this.cam_x = this.cam_x + val_x;
        this.cam_y = this.cam_y + val_y;
    }

    clear(){ this.ctx.clearRect(0, 0, this.renderer.width, this.renderer.height); }

    get_center() { return new vector2D( dec_div(this.renderer.width, 2), dec_div(this.renderer.height, 2)); }

    on_resize(event)
    {   
       this.renderer.width=this.offsetWidth;
       this.renderer.height=this.offsetHeight; 
    }

    on_mousedown(event){ console.log("Mouse down"); if(event.button == 0){ this.event_move = true; } }

    on_mousemove(event)
    {
        this.mouse_x = event.clientX;
        this.mouse_y = event.clientY;

        if(this.event_move == true)
        {
            let delta_x = event.movementX/(1+Math.abs(this.current_scale));
            let delta_y = event.movementY/(1+Math.abs(this.current_scale));
            this.cam_move(delta_x,delta_y);
        }
    }

  on_desktop_zoom(event){ this.zoom((-event.deltaY/Math.abs(-event.deltaY) )/10); }

    on_mouseup(event)
    {
        if(event.button == 0)
        {
        this.event_move = false;
        }
    }

    positionReset()
    {
        this.cam_x = 0;
        this.cam_y = 0;
        this.current_scale = 0;
        let scale = 1 + this.current_scale;
        this.ctx.setTransform(scale,0,0,scale,this.cam_x,this.cam_y);
    }

    touch_start(event)
    {
        this.touch_points = event.touches;
    }

    touch_move(event)
    {
        let ntouch_points = event.touches;
        
        if(this.touch_points.length> 1 && ntouch_points.length < 3)
        {
            let p1 = new vector2D(this.touch_points[0].clientX,this.touch_points[0].clientY);
            let p2 = new vector2D(this.touch_points[1].clientX,this.touch_points[1].clientY);
            let p3 = new vector2D(ntouch_points[0].clientX,ntouch_points[0].clientY);
            let p4 = new vector2D(ntouch_points[1].clientX,ntouch_points[1].clientY);

            let delta1 = p1.substract(p2).length();
            let delta2 = p3.substract(p4).length();
            let delta3 = (delta2-delta1)/2;
            
            this.zoom(delta3*0.01);
            this.touch_points = ntouch_points;
        }
        
        if(this.touch_points.length>0 && this.touch_points.length<3)
        {
            let pos0 = new vector2D(this.touch_points[0].clientX,this.touch_points[0].clientY);
            let posN = new vector2D(ntouch_points[0].clientX,ntouch_points[0].clientY);
            let delta=posN.substract(pos0); 
            this.cam_move(delta.x,delta.y);
            this.touch_points = ntouch_points;
        }
    }
    //* Do not sort order matters here *//
    zoom(zoom_val)
    {
        this.current_scale = this.current_scale + zoom_val;
        let scale = Math.pow(Math.E,this.current_scale);

        let pos_x = this.ctx.getTransform().e/scale;
        let pos_y = this.ctx.getTransform().f/scale;

        this.ctx.setTransform(1,0,0,1,this.cam_x*scale,this.cam_y*scale);

        let displace_x = (this.renderer.width*scale)-this.renderer.width;
        let displace_y = (this.renderer.height*scale)-this.renderer.height;

        this.ctx.translate(-displace_x/2,-displace_y/2);
        this.ctx.scale(scale,scale);
    }
    //* Do not sort order matters here *//

    //* Draws lines between points *//
	drawLines(points,color)
    {
        this.ctx.strokeStyle = color;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.lineWidth=2;

        for(let i=1; i<points.length;i++)
        {
            this.ctx.beginPath();
            let origin_point = this.get_center().add( points[i-1] );
            let end_point = this.get_center().add( points[i] );

            this.ctx.moveTo(origin_point.x,origin_point.y);
            this.ctx.lineTo(end_point.x,end_point.y);
            this.ctx.stroke(); 
        }
    }
    //* Draws lines between points *//

    //* Draws lines between points and closes path into loop *//
    drawClosedLoop(points,color)
    {
        this.ctx.strokeStyle = color;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.lineWidth=2;

        for(let i=1; i<points.length;i++)
        {
            this.ctx.beginPath();
            let origin_point = this.get_center().add( points[i-1] );
            let end_point = this.get_center().add( points[i] );
            this.ctx.moveTo(origin_point.x,origin_point.y);
            this.ctx.lineTo(end_point.x,end_point.y);
            this.ctx.stroke();
        }
    }
    //* Draws lines between points and closes path into loop *//

}
customElements.define("ez-renderer", EssentialsRenderer);
console.log("Component ez-renderer loaded.");
