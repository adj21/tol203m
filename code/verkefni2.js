var canvas;
var gl;

var NumVertices  = 24;

var points = [];
var colors = [];

var vBuffer;
var vPosition;

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -3.0;
var eyesep = 0.2;

var proLoc;
var mvLoc;

var hlidraX = 0;
var hlidraY = 0;
var hlidraZ = 0;

var kvordunX = 0.1;
var kvordunY = 0.1;
var kvordunZ = 0.1;

var hlidraX2 = 0.15;
var hlidraY2 = 0.15;
var hlidraZ2 = 0.15;

var kvordunX2 = 0.1;
var kvordunY2 = 0.1;
var kvordunZ2 = 0.1;

// the 8 vertices of the cube
var v = [
    vec3( -0.5, -0.5,  0.5 ),
    vec3( -0.5,  0.5,  0.5 ),
    vec3(  0.5,  0.5,  0.5 ),
    vec3(  0.5, -0.5,  0.5 ),
    vec3( -0.5, -0.5, -0.5 ),
    vec3( -0.5,  0.5, -0.5 ),
    vec3(  0.5,  0.5, -0.5 ),
    vec3(  0.5, -0.5, -0.5 )
];

var lines = [ v[0], v[1], v[1], v[2], v[2], v[3], v[3], v[0],
              v[4], v[5], v[5], v[6], v[6], v[7], v[7], v[4],
              v[0], v[4], v[1], v[5], v[2], v[6], v[3], v[7]
            ];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(lines), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    colorLoc = gl.getUniformLocation( program, "wireColor" );
    
    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 30.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    
    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 38:	// upp ??r
                zDist += 0.1;
                break;
            case 40:	// ni??ur ??r
                zDist -= 0.1;
                break;
         }
     }  );  

    // Event listener for mousewheel
     window.addEventListener("mousewheel", function(e){
         if( e.wheelDelta > 0.0 ) {
             zDist += 0.1;
         } else {
             zDist -= 0.1;
         }
     }  );  

    render();
}

function addKind(mv) {

    mv = mult( mv, translate(hlidraX, hlidraY, hlidraZ ));
    mv = mult( mv, scalem(kvordunX, kvordunY, kvordunZ ));
    gl.uniform4fv( colorLoc, vec4(0.0, 0.0, 1, 1 ));
    gl.uniformMatrix4fv( mvLoc, false, flatten(mv) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, NumVertices );
}

function addUlfur(mv) {

    mv = mult( mv, translate(hlidraX2, hlidraY2, hlidraZ2 ));
    mv = mult( mv, scalem(kvordunX2, kvordunY2, kvordunZ2 ));
    gl.uniform4fv( colorLoc, vec4(0.0, 0.5, 0.5, 1.0 ));
    gl.uniformMatrix4fv( mvLoc, false, flatten(mv) );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, NumVertices );
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt( vec3(0.0-eyesep/2.0, 0.0, zDist),
                     vec3(0.0, 0.0, zDist+2.0),
                     vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, mult( rotateX(spinX), rotateY(spinY) ) );

    // Sv??rt grind
    gl.uniform4fv( colorLoc, vec4(0.0, 0.0, 0.0, 1.0) );
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays( gl.LINES, 0, NumVertices );
    
    
    addKind(mv);
    addUlfur(mv);

    requestAnimFrame( render );
}
