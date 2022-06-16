import { ChannelName } from '../types';
import { stringToLowercase } from './utils';

export const { MAIN, STRAP } = ChannelName;

export const ROOT = 'root';

export const END_SEQUENCE = 4000;
export const MAX_ENDS = 10000;
export const TIME_INTERVAL = 10;
export const DEFAULT_TIMER = '1/10';
export const DEFAULT_CHANNEL_NAME = ChannelName.DEFAULT;

export const FORWARD = 'forward';
export const BACKWARD = 'backward';

export const TICK = 'tick';
export const PLAY = 'play';
export const PAUSE = 'pause';
export const SEEK = 'seek';
export const SEEKING = 'seeking';

export const DEFAULT_IMG = {
	width: 250,
	height: 250,
	ratio: 1,
	src: './ikono/placeholder.png',
};

export const DEFAULT_STYLES = {
	x: 0,
	y: 0,
	dX: 0,
	dY: 0,
	s: 1,
	r: 0,
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	skew: 1,
	skewX: 1,
	skewY: 1,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	scaleZ: 1,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	rotateZ: 0,
	opacity: 1,
	color: '#000',
};

export const exceptions = new Set(Object.keys(DEFAULT_STYLES));

// properties that can use unitless values (unit added on render)
const whiteListCss = [
	'backgroundPosition',
	'borderBottom',
	'borderBottomWidth',
	'borderLeft',
	'borderLeftWidth',
	'borderRight',
	'borderRightWidth',
	'borderTop',
	'borderTopWidth',
	'borderWidth',
	'borderRadius',
	'flexBasis',
	'fontSize',
	'height',
	'left',
	'letterSpacing',
	'listStylePosition',
	'margin',
	'marginBottom',
	'marginLeft',
	'marginRight',
	'marginTop',
	'padding',
	'minWidth',
	'maxWidth',
	'minHeight',
	'maxHeight',
	'objectPosition',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'perspective',
	'strokeDasharray',
	'strokeDashoffset',
	'strokeWidth',
	'textIndent',
	'top',
	'width',
];

export const whiteListCssPropsCC = new Set(whiteListCss);
export const whiteListCssProps = new Set(whiteListCss.map(stringToLowercase));
