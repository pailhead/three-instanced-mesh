module.exports = function( THREE , monkeyPatch ){

	if( monkeyPatch ) return;

	require('./WebGLProgram.js')(THREE);
	require('./WebGLPrograms.js')(THREE);
	require('./Material.js')(THREE);
	require('./WebGLShadowMap.js')(THREE);

	THREE.ShaderChunk[ 'beginnormal_vertex' ] = 		require('./beginnormal_vertex.glsl.js'); 
	THREE.ShaderChunk[ 'common' ] = 					require('./common.glsl.js'); 
	THREE.ShaderChunk[ 'defaultnormal_vertex' ] = 		require('./defaultnormal_vertex.glsl.js');

	return THREE;

}