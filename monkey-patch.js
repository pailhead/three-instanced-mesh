module.exports = function ( THREE ){

	require('./monkey-patch/index.js')( THREE );

	THREE.REVISION = "78_InstancedMesh";

	console.log( THREE );

	return THREE;

}