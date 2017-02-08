
module.exports = function( THREE ){

function InstancedDistributedGeometry (
	regularGeometry , 							//regular buffer geometry, the geometry to be instanced
	numCopies , 								//maximum number of copies to be generated
	distributeFunction,					 		//distribution function
	disposeRegular								//destroy the geometry that was converted to this
) {

	THREE.InstancedBufferGeometry.call( this );

	this.fromGeometry( regularGeometry , numCopies , distributeFunction );

	if( disposeRegular ) regularGeometry.dispose();

}

InstancedDistributedGeometry.prototype = Object.create( InstancedBufferGeometry.prototype );

InstancedDistributedGeometry.constructor = THREE.InstancedDistributedGeometry;

InstancedDistributedGeometry.prototype.fromGeometry = function( regularGeometry , numCopies , distributeFunction ){

	//a helper node used to compute positions for each instance
	var helperObject = new THREE.Object3D(); 	
	var normalMatrix = new THREE.Matrix3();
	var rotationMatrix = new THREE.Matrix4();


	//copy attributes from the provided geometry
	for ( var att in regularGeometry.attributes ){								
		if(regularGeometry.attributes.hasOwnProperty( att ) ){
			this.addAttribute( att , regularGeometry.attributes[att] );	
		}
	}

	if(regularGeometry.index!==null)
			this.setIndex( regularGeometry.index );

		var orientationMatrices = [
			new THREE.InstancedBufferAttribute( new Float32Array( numCopies * 4 ), 4, 1 ),
			new THREE.InstancedBufferAttribute( new Float32Array( numCopies * 4 ), 4, 1 ),
			new THREE.InstancedBufferAttribute( new Float32Array( numCopies * 4 ), 4, 1 ),
			new THREE.InstancedBufferAttribute( new Float32Array( numCopies * 4 ), 4, 1 )
		];

		for ( var clone = 0 ; clone < numCopies ; clone ++ ){

			helperObject.matrixWorld.identity();

			helperObject.position.set(0,0,0);
			
			helperObject.rotation.set(0,0,0);
			
			helperObject.scale.set(1,1,1);

			distributeFunction( helperObject , clone , numCopies );

			helperObject.updateMatrixWorld();

			_copyMat4IntoAttributes( clone , helperObject.matrixWorld , orientationMatrices );

		}

		for ( var i = 0 ; i < 4 ; i ++ ){

			this.addAttribute( 'aTRS' + i , orientationMatrices[i] );

		}

}

/**
 * copies mat4 values into an attribute buffer at an offset
 **/
function _copyMat4IntoAttributes( index , mat4 , attributeArray ){

	index = index << 2;

	for ( var r = 0 ; r < 4 ; r ++ ){

		var row = r << 2;

		for ( var c = 0 ; c < 4 ; c ++ ){
			
			attributeArray[r].array[ index + c ] = mat4.elements[ row + c ];

		}

	}

}

return InstancedDistributedGeometry;

}

