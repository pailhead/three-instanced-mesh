# three-instanced-mesh

Higher level abstraction of `THREE.InstancedBufferGeometry` for [three.js](https://github.com/mrdoob/three.js/). For a webgl level overview check out [TojiCode](http://blog.tojicode.com/2013/07/webgl-instancing-with.html).

# what it should do

Provide an abstraction for relatively low level `THREE.InstancedBufferGeometry`, allows for the instancing attributes to be setup by a "placement function" and converts a regular buffer geometry to instanced. This is a modified [webgl_performance_doublesided.html](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_performance_doublesided.html) example running 30k objects instead of 5. All of the objects should be drawn with one draw call, thus speeding things up. It does a simple transformation of normals to view space if the instances are known to be uniformly scaled. If not, it does a mat3 inversion on the gpu (yikes!) but it works. 

[Working with shadows.](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_instanced_mesh.html)

So for example, if you have static world assets that need to be scattered, you can group them with this thus saving a bit of memory (over merging) and a bit of overhead ( less draw calls ). You should still probably take care of how the assets are grouped so they could be culled. The class computes no bounding information whatsoever, but it's easy to do within the placement function.

# how it works

In order for this class to work with the shaders from the default materials as well as shadows a few classes in the `THREE.WebGLRenderer` need to be modified. Some shader chunks need to be extended, but the logic is contained by the preprocessor, so unless a `#INSTANCE_TRANSFORM` define is made, the shaders will act as if this effect is not present. The only way to trigger this define in the shaders for the default materials is to modify a few internal functions to the renderer.

That being said... the module contains a monkey patch that modifies the following three.js classes:
- **THREE.Material**

  adds two flags `instanceTransform` and `instanceUniform` that control the two defines to be made for the shader
  
- **THREE.WebGLProgram**

  this is where the defines are actually defined along with the TRS attribute matrix
  
- **THREE.WebGLPrograms** 

  this plucks the parameters needed for the program

- **THREE.ShadowMap**
  
  additional material variants are created for the cache with the instance defined (not sure though if we want to instance skinned stuff)

- **common.glsl , defaultnormal_vertex.glsl , begin_vertex.glsl**

  are chunks that contain the instancing logic, and a mat3 inverse function that gets defined only in materials that have `instanceTransform` set to true

The class will run the "placement function" during construction transforming an internal `Object3D` node and writing the TRS matrix into an attribute buffer N times. It will convert the provided `THREE.BufferGeometry` into a `THREE.InstancedBufferGeometry` and attach the additional attribute. The result is an `InstancedMesh` class (extends `Mesh`) with an `InstancedDistributedGeometry` class (extends `InstancedBufferGeometry`). This can then be treated as one object as far as rendering is concerned. A different structure can describe colliders for example and could be constructed in the placement function.  

# NOTE 

this works only on r78, see this [pull request](https://github.com/mrdoob/three.js/pull/10750) for discussion, and this [fork](https://github.com/pailhead/three.js/tree/InstancedMesh) if you want to build it for r84.

# Usage


[![NPM](https://nodei.co/npm/three-instanced-mesh.png)](https://npmjs.org/package/three-instanced-mesh)

```javascript

require(../../node_modules/three-instanced-mesh/monkey-patch.js)(THREE); //you have to run this file if you want default materials to work, and your threejs version has to be 78

var InstancedMesh = require('three-instanced-mesh')( THREE ); 

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

