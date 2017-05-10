/**************************
 * Dusan Bosnjak @pailhead
 **************************/

module.exports = function( THREE ){

	//patches these methods and shader chunks with the required logic 
	THREE.ShaderChunk[ 'begin_vertex' ] = 				require('./begin_vertex.glsl.js'); 
	THREE.ShaderChunk[ 'color_fragment' ] = 			require('./color_fragment.glsl.js');
	THREE.ShaderChunk[ 'color_pars_fragment.glsl' ] = 	require('./color_pars_fragment.glsl.js');
	THREE.ShaderChunk[ 'color_vertex.glsl' ] = 			require('./color_vertex.glsl.js');
	THREE.ShaderChunk[ 'defaultnormal_vertex' ] = 		require('./defaultnormal_vertex.glsl.js');
	THREE.ShaderChunk[ 'vertex_include' ] = 			require('./vertex_include.glsl.js');
	
}