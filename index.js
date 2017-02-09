/**
 * Dusan Bosnjak @pailhead
 */

module.exports = function( THREE ){

//monkeypatch shaders

require('./monkey-patch.js')(THREE);

var InstancedDistributedGeometry = require('./InstancedDistributedGeometry')(THREE);

function InstancedMesh ( geometry , material , distributeFunction , numCopies , uniformScale , disposeRegular ) {

	THREE.Mesh.call( this , new InstancedDistributedGeometry( geometry , numCopies , distributeFunction , disposeRegular ) , material.clone() );

	this.material.defines = {

		INSTANCE_TRANSFORM: ""

	};
 	
 	if( undefined !== uniformScale && uniformScale )
		this.material.defines.INSTANCE_UNIFORM = true;

	this.frustumCulled = false; //you can uncheck this if you generate your own bounding info

}

InstancedMesh.prototype = Object.create( THREE.Mesh.prototype );

InstancedMesh.constructor = InstancedMesh;

THREE.InstancedMesh = InstancedMesh;

return InstancedMesh;

}