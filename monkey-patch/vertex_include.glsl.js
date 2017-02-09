
//define a mat3 inverse function if instance transform is used

var chunkSet = false;

module.exports = function(THREE){

if( chunkSet ) return THREE.ShaderChunk['uv_pars_vertex'];

var chunk = [

"#ifdef INSTANCE_TRANSFORM",

"mat3 inverse(mat3 m) {",

  "float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];",

  "float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];",

  "float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];",

  "float b01 = a22 * a11 - a12 * a21;",

  "float b11 = -a22 * a10 + a12 * a20;",

  "float b21 = a21 * a10 - a11 * a20;",

  "float det = a00 * b01 + a01 * b11 + a02 * b21;",

  "return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),",

              "b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),",

              "b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;",
"}",


'attribute vec4 aTRS0;',   //InstancedMesh extension 
'attribute vec4 aTRS1;',   //InstancedMesh extension 
'attribute vec4 aTRS2;',   //InstancedMesh extension 
// 'attribute vec4 aTRS3;',   //InstancedMesh extension 

"#endif"


].join("\n");

THREE.ShaderChunk['uv_pars_vertex'] += chunk;

console.log( THREE.ShaderChunk['uv_pars_vertex'] );

}
