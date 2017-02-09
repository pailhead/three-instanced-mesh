# three-instanced-mesh

Higher level abstraction of `THREE.InstancedBufferGeometry` for [three.js](https://github.com/mrdoob/three.js/). For a webgl level overview check out [TojiCode](http://blog.tojicode.com/2013/07/webgl-instancing-with.html).

# what it should do

Provide an abstraction for relatively low level `THREE.InstancedBufferGeometry`, allows for the instancing attributes to be setup by a "placement function" and converts a regular buffer geometry to instanced. This is a modified [webgl_performance_doublesided.html](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_performance_doublesided.html) example running 30k objects instead of 5. All of the objects should be drawn with one draw call, thus speeding things up. It does a simple transformation of normals to view space if the instances are known to be uniformly scaled. If not, it does a mat3 inversion on the gpu (yikes!) but it works. 

[Working with shadows.](http://dusanbosnjak.com/test/webGL/three-instanced-mesh/webgl_instanced_mesh.html)

So for example, if you have static world assets that need to be scattered, you can group them with this thus saving a bit of memory (over merging) and a bit of overhead ( less draw calls ). You should still probably take care of how the assets are grouped so they could be culled. The class computes no bounding information whatsoever, but it's easy to do within the placement function.

# how it works

Including the module once will allow the usage of `THREE.InstancedMesh` constructor, it should also patch three different shader chunks to attach the instancing logic. It's possible to trigger these defines from outside, ~~but the depth materials are still buried in `THREE.WebGLShadows`.~~ Absolute w00tness, three.js already has a mechanism in plase that allows for something like this to be done without hacking! :)

The module contains a monkey patch that modifies the following three.js classes:

 

- **color_pars_vertex.glsl**
  
  odd but this is the most convenient place to include stuff in the vertex shader outside of main()

- **defaultnormal_vertex.glsl** 

  normal transformation, this is where the optimization can occur if the scale is uniform

- **begin_vertex.glsl**

  vertex transformation
  
**TODO:** make a class that attaches the functionality to a provided material.

The class will run the "placement function" during construction transforming an internal `Object3D` node and writing the TRS matrix into an attribute buffer N times. It will convert the provided `THREE.BufferGeometry` into a `THREE.InstancedBufferGeometry` and attach the additional attribute. The result is an `InstancedMesh` class (extends `Mesh`) with an `InstancedDistributedGeometry` class (extends `InstancedBufferGeometry`). This can then be treated as one object as far as rendering is concerned. A different structure can describe colliders for example and could be constructed in the placement function.  

It will consume additional three 'v4' attributes. ( rotation is in xyz , translation in w ).

# NOTE 

Just include it and it should work :)
~~this works only on r78, see this [pull request](https://github.com/mrdoob/three.js/pull/10750) for discussion, and this [fork](https://github.com/pailhead/three.js/tree/InstancedMesh) if you want to build it for r84 **and have shadows enabled**. Otherwise, including this once will patch the provided instance of three and you'll have `THREE.InstancedMesh` available as a constructor. ~~

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

