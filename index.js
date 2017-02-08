/**
 * @pailhead
 */

module.exports = function( THREE ){

function InstancedMesh ( geometry , material , distributeFunction , numCopies , uniformScale , disposeRegular ) {

	THREE.Mesh.call( this , new InstancedDistributedGeometry( geometry , numCopies , distributeFunction , disposeRegular ) , material.clone() );

	this.material.instanceTransform = true;

	this.material.instanceUniform = undefined !== uniformScale ? uniformScale : false;

	this.frustumCulled = false;

}

InstancedMesh.prototype = Object.create( THREE.Mesh.prototype );

InstancedMesh.constructor = InstancedMesh;

THREE.InstancedMesh = InstancedMesh;

return InstancedMesh;

}