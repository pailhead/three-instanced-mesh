module.exports = function( THREE ){


	// require('./WebGLShadowMap.js')(THREE); //cant be done in recent versions


	//patches these methods and shader chunks with the required logic 
	THREE.ShaderChunk[ 'begin_vertex' ] = 				require('./begin_vertex.glsl.js'); 
	THREE.ShaderChunk[ 'defaultnormal_vertex' ] = 		require('./defaultnormal_vertex.glsl.js');

	//piggy back on this one as it seems its included in all the materials except depth
	THREE.ShaderChunk[ 'color_pars_vertex' ] = require('./vertex_include.glsl.js'); 
	
}