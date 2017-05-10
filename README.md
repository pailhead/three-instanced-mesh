# three-instanced-mesh

Higher level abstraction of `THREE.InstancedBufferGeometry` for [three.js](https://github.com/mrdoob/three.js/). For a webgl level overview check out [TojiCode](http://blog.tojicode.com/2013/07/webgl-instancing-with.html).

# what it should do

Provide an abstraction for relatively low level `THREE.InstancedBufferGeometry`, allows for the instancing attributes to be setup by a "placement function" and converts a regular buffer geometry to instanced. This is a modified [example](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_performance_doublesided.html) running 30k objects instead of 5. All of the objects should be drawn with one draw call, thus speeding things up. It does a simple transformation of normals to view space if the instances are known to be uniformly scaled. If not, it does a mat3 inversion on the gpu (yikes!) but it works. 

[Working with shadows.](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_instanced_mesh.html)

So for example, if you have static world assets that need to be scattered, you can group them with this thus saving a bit of memory (over merging) and a bit of overhead ( less draw calls ). You should still probably take care of how the assets are grouped so they could be culled. The class computes no bounding information whatsoever, but it's easy to do within the placement function.

# how it works

Including the module once will allow the usage of `THREE.InstancedMesh` constructor, it should also patch three different shader chunks to attach the instancing logic.

# Usage

[![NPM](https://nodei.co/npm/three-instanced-mesh.png)](https://npmjs.org/package/three-instanced-mesh)

```javascript

//var InstancedMesh = require('three-instanced-mesh')( THREE ); //should replace shaders on first call

//or just patch three
require( 'three-instanced-mesh' )(THREE);

var boxGeometry = new THREE.BoxBufferGeometry(2,2,2,1,1,1);
var material = new THREE.MeshPhongMaterial();

var cluster = new THREE.InstancedMesh( boxGeometry , material , //this is the same
  function( object , objectIndex , objectCount ){               //positioning function 
    object.position.set(...);
    object.rotation.set(...);
    object.scale.set(...);
  },
  10000,                                                        //instance count
  true,                                                         //uniform scale, if you know that the placement function will not do a non-uniform scale, this will optimize the shader
  false                                                         //should the original geometry be disposed of
);

scene.add( cluster );
```
**NOTE:** it is possible to use the module without the monkey patch, if you are using your own shaders, consult the shader snippets on how to hadnle the includes.

## Constructor

**InstancedGeometry( *bufferGeometry* , *material* , *placementFunction* , *instanceCount* , *uniformScale* , *disposeGeometry* )**
  - **[THREE.BufferGeomety]:bufferGeometry** 

  instance of BufferGeometry, this will be converted to InstancedBufferGeometry

  - **[THREE.Material]:material** 
  
    instance of any material (other than `ShaderMaterial`, which needs to include the snippets manually
  
  - **[func]:placementFunction( object , objectIndex , objectCount )** 
  
    a function that transforms the instances, object is the object to be manipulated, objectIndex is index in the sequence, objectCount is the instance count set
  - **[Int]:instanceCount** 
  
    how many objects to be placed by the placement function
  
  - **[bool]:uniformScale** 
  
    an optimization flag if the scale is known to be uniform
  
  
  - **[bool]:disposeGeometry** 
  
    delete the original geometry provided

## Methods

Extends `THREE.Mesh`, no functionality added on top yet. 

