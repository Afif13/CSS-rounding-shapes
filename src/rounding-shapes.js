registerPaint('rounding-shapes', class  {

  static get inputProperties() {
    return [
      '--path',
      '--radius',
      '--border',
      '--t',
      '--dash'
    ]
  }
  
  paint(ctx, size, properties) {

    const points = properties.get('--path').toString().split(',');
    var Ppoints = [];
    var Cpoints = [];
    var Radius = [];
    const r = parseFloat(properties.get('--radius').value);
    const b = parseFloat(properties.get('--border').value);
    const d = properties.get('--dash').toString().split(',');
    const t = parseInt(properties.get('--t'));
    const w = size.width;
    const h = size.height;
    
    const cc = function(x,y) {
      var fx=0,fy=0;
      if (x.indexOf('calc') > -1) {
        var tmp = x.replace('calc(','').replace(')','');
        if (tmp.indexOf('+') > -1) {
          tmp = tmp.split('+');
          fx = (parseFloat(tmp[0])/100)*w + parseFloat(tmp[1]);
        } else {
          tmp = tmp.split('-');
          fx = (parseFloat(tmp[0])/100)*w - parseFloat(tmp[1]);
        }
      } else if (x.indexOf('%') > -1) {
        fx = (parseFloat(x)/100)*w;
      } else if(x.indexOf('px') > -1) {
        fx = parseFloat(x);
      }
      
      if (y.indexOf('calc') > -1) {
        var tmp = y.replace('calc(','').replace(')','');
        if (tmp.indexOf('+') > -1) {
          tmp = tmp.split('+');
          fy = (parseFloat(tmp[0])/100)*h + parseFloat(tmp[1]);
        } else {
          tmp = tmp.split('-');
          fy = (parseFloat(tmp[0])/100)*h - parseFloat(tmp[1]);
        }
      } else if (y.indexOf('%') > -1) {
        fy = (parseFloat(y)/100)*h;
      } else if(y.indexOf('px') > -1) {
        fy = parseFloat(y);
      }
      return [fx,fy];
    }
   
    var N = points.length;
    for (var i = 0; i < N; i++) {
      var j = i-1;
      if(j<0) j=N-1;
      
      var p = points[i].trim().split(/(?!\(.*)\s(?![^(]*?\))/g);
      if(p[2])
        Radius.push(parseInt(p[2]));
      else
        Radius.push(r);
      p = cc(p[0],p[1]);
      Ppoints.push([p[0],p[1]]);
      var pj = points[j].trim().split(/(?!\(.*)\s(?![^(]*?\))/g);
      pj = cc(pj[0],pj[1]);
      Cpoints.push([p[0]-((p[0]-pj[0])/2),p[1]-((p[1]-pj[1])/2)]);
    }
    ctx.beginPath();
    ctx.moveTo(Cpoints[0][0],Cpoints[0][1]);
    var i;
    var rr;
    for (i = 0; i < (Cpoints.length - 1); i++) {
      var angle = Math.atan2(Cpoints[i+1][1] - Ppoints[i][1], 
                             Cpoints[i+1][0] - Ppoints[i][0]) -
                  Math.atan2(Cpoints[i][1] - Ppoints[i][1], 
                             Cpoints[i][0] - Ppoints[i][0]);
      if (angle < 0) {
        angle += (2*Math.PI)
      }
      if (angle > Math.PI) {
        angle = 2*Math.PI - angle
      }
      var distance = Math.min(Math.sqrt((Cpoints[i+1][1] - Ppoints[i][1]) ** 2 + 
                                        (Cpoints[i+1][0] - Ppoints[i][0]) ** 2),
                              Math.sqrt((Cpoints[i][1] - Ppoints[i][1]) ** 2 + 
                                        (Cpoints[i][0] - Ppoints[i][0]) ** 2));
      rr = Math.min(distance * Math.tan(angle/2),Radius[i]);
      ctx.arcTo(Ppoints[i][0], Ppoints[i][1], Cpoints[i+1][0],Cpoints[i+1][1], rr);
    }
  var angle = Math.atan2(Cpoints[0][1] - Ppoints[i][1], 
                             Cpoints[0][0] - Ppoints[i][0]) -
                  Math.atan2(Cpoints[i][1] - Ppoints[i][1], 
                             Cpoints[i][0] - Ppoints[i][0]);
   if (angle < 0) {
      angle += (2*Math.PI)
   }
   if (angle > Math.PI) {
      angle = 2*Math.PI - angle
   }
   var distance = Math.min(Math.sqrt((Cpoints[0][1] - Ppoints[i][1]) ** 2 + 
                                        (Cpoints[0][0] - Ppoints[i][0]) ** 2),
                              Math.sqrt((Cpoints[i][1] - Ppoints[i][1]) ** 2 + 
                                        (Cpoints[i][0] - Ppoints[i][0]) ** 2));
    rr = Math.min(distance * Math.tan(angle/2),Radius[i]);
    ctx.arcTo(Ppoints[i][0], Ppoints[i][1], Cpoints[0][0],Cpoints[0][1], rr);
    ctx.closePath();
    
    
    if(t==0) {
      ctx.fillStyle = '#000';
      ctx.fill();
    } else {
      ctx.setLineDash(d);
      ctx.lineWidth = 2*b;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    }
  }

})
