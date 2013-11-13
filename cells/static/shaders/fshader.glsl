#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_sampler;

varying vec2 v_texcoord;

void main()
{
	vec4 color = texture2D(u_sampler, v_texcoord);
	
	if (color.rgb == vec3(1.0, 0.0, 1.0)) // Magenta color key
		discard;
	
	gl_FragColor = color;
}
