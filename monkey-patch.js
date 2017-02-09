module.exports = function ( THREE ){

	if( /InstancedMesh/.test( THREE.REVISION ) ) alert('patched');

	require('./monkey-patch/index.js')( THREE );

	THREE.REVISION = "78_InstancedMesh";

	console.log( THREE );

	return THREE;

}