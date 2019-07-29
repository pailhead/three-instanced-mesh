/**************************
 * Dusan Bosnjak @pailhead
 **************************/

module.exports = [

"#ifdef FLIP_SIDED",

	"objectNormal = -objectNormal;",

"#endif",
	
"#ifdef INSTANCE_TRANSFORM",

	"#ifndef INSTANCE_MATRIX ",

		"mat4 _instanceMatrix = getInstanceMatrix();",

		"#define INSTANCE_MATRIX",

	"#endif",
	
	"#ifdef INSTANCE_UNIFORM",
	
		"mat3 _normalTransformMatrix = mat3(modelViewMatrix * _instanceMatrix);",
	
	"#else",
	
		"mat3 _normalTransformMatrix = transposeMat3( inverse( mat3( modelViewMatrix * _instanceMatrix ) ) );",
	
	"#endif",
	
"#else",

	"mat3 _normalTransformMatrix = normalMatrix;",	
	
"#endif",
	
"vec3 transformedNormal = _normalTransformMatrix * objectNormal;",

"#ifdef USE_TANGENT",

	"#ifdef FLIP_SIDED",

		"objectTangent = -objectTangent;",

	"#endif",

	"vec3 transformedTangent = _normalTransformMatrix * objectTangent;",
	
"#endif",

].join("\n");
