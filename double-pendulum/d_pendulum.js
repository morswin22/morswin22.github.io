Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

var canvas = $('#display');
var ctx = canvas[0].getContext('2d');

var hCanvas = $('<canvas/>');
var hctx = hCanvas[0].getContext('2d');

var size, helperY;
var resizer = function() {
    size = {
        width: canvas.width(),
        height: canvas.height()
    }
    canvas[0].width = size.width;
    canvas[0].height = size.height;

    hCanvas[0].width = size.width;
    hCanvas[0].height = size.height;

    helperY = size.height*100/345;
    ctx.translate(size.width/2,helperY);

    hctx.translate(size.width/2,helperY);
    hctx.clearRect(-size.width/2,-helperY,size.width,size.height);
}

resizer();
window.onresize = resizer;

var l1, l2, m1, m2, a1, a2, a1_v, a2_v, a1_a, a2_a, g;
var pause = true;

var frames = 0;

var lx,ly;

$('#startBtn').on('click', function() {
    l1 = Number($('#l1').val());
    l2 = Number($('#l2').val());
    m1 = Number($('#m1').val());
    m2 = Number($('#m2').val());
    a1 = Math.radians(Number($('#a1').val()));
    a2 = Math.radians(Number($('#a2').val()));
    g = Number($('#g').val());
    a1_v = 0;
    a2_v = 0;
    a1_a = 0;
    a2_a = 0;

    lx = -1;
    ly = -1;

    pause = false;

});

$('#resetBtn').on('click', function() {
    pause = true;
    ctx.clearRect(-size.width/2,-helperY,size.width,size.height);
    hctx.clearRect(-size.width/2,-helperY,size.width,size.height);
    frames = 0;
});

$('input[type=number]').on('change', function(e) {
    e = $(e.target);
    if (e.attr('id') != "a1" && e.attr('id') != "a2") {
        window[e.attr('id')] = e.val();
    }
});

function draw() {
    if (!pause) {
        ctx.clearRect(-size.width/2,-helperY,size.width,size.height);
        // draw func
        
        // draw hidden canvas
        ctx.drawImage(hCanvas[0],-size.width/2,-helperY,size.width,size.height);

        var num1 = -g * (2 * m1 + m2) * Math.sin(a1);
        var num2 = -m2 * g * Math.sin(a1-2*a2);
        var num3 = -2*Math.sin(a1-a2)*m2;
        var num4 = a2_v*a2_v*l2+a1_v*a1_v*l1*Math.cos(a1-a2);
        var den = l1 * (2 * m1 + m2 - m2 * Math.cos(2*a1-2*a2));
        a1_a = (num1+num2+num3*num4) / den; 

        num1 = 2 * Math.sin(a1-a2);
        num2 = a1_v*a1_v * l1 * (m1+m2);
        num3 = g * (m1 + m2) * Math.cos(a1);
        num4 = a2_v*a2_v * l2 * m2 * Math.cos(a1-a2);
        den = l2 * (2 * m1 + m2 - m2* Math.cos(2*a1-2*a2))
        a2_a = (num1*(num2+num3+num4)) / den;

        var x1 = l1 * Math.sin(a1);
        var y1 = l1 * Math.cos(a1);

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(x1,y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x1,y1,m1,0,2*Math.PI);
        ctx.stroke();

        var x2 = x1 + l2 * Math.sin(a2);
        var y2 = y1 + l2 * Math.cos(a2);

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x2,y2,m2,0,2*Math.PI);
        ctx.stroke();

        a1_v += a1_a;
        a2_v += a2_a;
        a1 += a1_v;
        a2 += a2_v;

        // save dot
        if (frames > 0) {
            hctx.strokeStyle = '#007bff';
            hctx.beginPath();
            hctx.moveTo(lx,ly);
            hctx.lineTo(x2,y2);
            hctx.stroke();
        }

        lx = x2;
        ly = y2;

        //console.log(frames);
        frames++;
    }
    window.requestAnimationFrame(draw);
}

draw();