/**************************
 * Dusan Bosnjak @pailhead
 **************************/

// multiply the color with per instance color if enabled

module.exports = /* glsl */`
#if defined( USE_COLOR_ALPHA )

	diffuseColor *= vColor;

#elif defined( USE_COLOR )

	diffuseColor.rgb *= vColor;

#endif

#if defined( INSTANCE_COLOR )

	diffuseColor.rgb *= vInstanceColor;

#endif
`
