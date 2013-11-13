attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform vec2 u_resolution;

varying vec2 v_texcoord;

void main()
{
	vec2 clip_space = ((a_position / u_resolution * 2.0) - 1.0) * vec2(1, -1);

	gl_Position = vec4(clip_space, 0, 1);
	v_texcoord = a_texcoord;
}
