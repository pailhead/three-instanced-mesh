module.exports = function( THREE ){

	//patches these methods and shader chunks with the required logic 

	require('./Material.js')(THREE);

	THREE.WebGLProgram = 	require('./WebGLProgram.js')(THREE);  //adds correct define
	THREE.WebGLPrograms =	require('./WebGLPrograms.js')(THREE);

	require('./WebGLShadowMap.js')(THREE);

	THREE.ShaderChunk[ 'begin_vertex' ] = 				require('./begin_vertex.glsl.js'); 
	THREE.ShaderChunk[ 'defaultnormal_vertex' ] = 		require('./defaultnormal_vertex.glsl.js');

	//this one is appended
	THREE.ShaderChunk[ 'common' ] += 					require('./common.glsl.js'); 
	
}