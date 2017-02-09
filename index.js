/**************************
 * Dusan Bosnjak @pailhead
 **************************/
 
module.exports = function( THREE ){

//monkeypatch shaders
require('./monkey-patch.js')(THREE);

//geometry helper class
var InstancedDistributedGeometry = require('./InstancedDistributedGeometry')(THREE);

//depth mat
var depthMaterialTemplate = new THREE.MeshDepthMaterial();

depthMaterialTemplate.depthPacking = THREE.RGBADepthPacking;

depthMaterialTemplate.clipping = true;

depthMaterialTemplate.defines = {

	INSTANCE_TRANSFORM: ''

};

//distance mat
var 
	
	distanceShader = THREE.ShaderLib[ "distanceRGBA" ],
	distanceUniforms = THREE.UniformsUtils.clone( distanceShader.uniforms ),
	distanceMaterial = new THREE.ShaderMaterial( {
		defines: {
			'USE_SHADOWMAP': '',
			'INSTANCE_TRANSFORM': ''
		},
		uniforms: distanceUniforms,
		vertexShader: distanceShader.vertexShader,
		fragmentShader: distanceShader.fragmentShader,
		clipping: true
	})
;


//export
function InstancedMesh ( geometry , material , distributeFunction , numCopies , uniformScale , disposeRegular ) {

	THREE.Mesh.call( this , new InstancedDistributedGeometry( geometry , numCopies , distributeFunction , disposeRegular ) , material.clone() );

	//trigger this material to be instanced
	this.material.defines = {

		INSTANCE_TRANSFORM: ''

	};
 	
 	if( undefined !== uniformScale && uniformScale )
		this.material.defines.INSTANCE_UNIFORM = true;

	this.frustumCulled = false; //you can uncheck this if you generate your own bounding info

	//work with depth effects
	this.customDepthMaterial = depthMaterialTemplate; 

	this.customDistanceMaterial = distanceMaterial;

}

InstancedMesh.prototype = Object.create( THREE.Mesh.prototype );

InstancedMesh.constructor = InstancedMesh;

THREE.InstancedMesh = InstancedMesh;

return InstancedMesh;

}