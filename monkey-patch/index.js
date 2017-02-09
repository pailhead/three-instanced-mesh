/**************************
 * Dusan Bosnjak @pailhead
 **************************/

module.exports = function( THREE ){

	//patches these methods and shader chunks with the required logic 
	THREE.ShaderChunk[ 'begin_vertex' ] = 				require('./begin_vertex.glsl.js'); 
	THREE.ShaderChunk[ 'defaultnormal_vertex' ] = 		require('./defaultnormal_vertex.glsl.js');

	//piggy back on uv_pars_vertex
	require('./vertex_include.glsl.js')(THREE); 
	
}