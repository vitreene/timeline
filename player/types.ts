import * as CSS from 'csstype';
import { Layer } from './lib/display/layer';
import { Txt } from './lib/display/text';
import { Matrix2D, TransformProperty } from './lib/sceneline/transform-types';
import { START, PAUSE, STOP } from '~/common/constants';

interface CSSTransformSpecialParam<T> {
	x: number;
	y: T;
	dx: T;
	dy: T;
	movex: T;
	movey: T;
}

export interface Style
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number>,
		Partial<CSSTransformSpecialParam<number>> {}

export interface StyleEntry {
	[x: string]:
		| string
		| number
		| { value: number; unit?: string; ease?: string; original: string }
		| LerpStringStyle;
}

export interface LerpStringStyle {
	value: Array<number>;
	pattern: Array<string>;
	ease?: string;
	original: string;
}

/* 
ecrire les interfaces par type d'élement en entrée
*/

export interface PersoLayerDef {
	readonly type: PersoType.LAYER;
	initial: Partial<Initial>;
	actions?: Record<string, Action | boolean>;
}
export interface PersoTextDef {
	readonly type: PersoType.TEXT;
	initial: Partial<Initial> & { content: string };
	actions?: Record<string, Action | boolean>;
}

export interface PersoImgDef {
	readonly type: PersoType.IMG | PersoType.SPRITE;
	initial: Partial<Initial> & { content: Img };
	actions?: Record<string, ImgAction>;
	media?: any;
}

export interface PersoSoundDef {
	readonly type: PersoType.SOUND;
	initial: { src: string };
	actions?: Record<string, Partial<SoundAction>>;
	media?: My;
}

export interface PersoVideoDef {
	readonly type: PersoType.VIDEO;
	initial: Partial<Initial> & { src: string };
	actions?: Record<string, Partial<Action>>;
	media?: any;
}

export type PersoMediaDef = PersoVideoDef | PersoSoundDef;

export interface SoundAction {
	action: typeof START | typeof STOP;
	volume: number;
	playbackRate: number;
	transition: Transition;
}

export type Broadcast =
	| BroadcastAction
	| {
			type?: BroadcastAction;
			transition?: Transition;
			volume?: number;
			playbackRate?: number;
	  };
type BroadcastAction = typeof START | typeof PAUSE | typeof STOP;

export interface ImgAction extends Omit<Action, 'content'> {
	content?: Img;
}
export type PersoDef = PersoTextDef | PersoLayerDef | PersoImgDef | PersoVideoDef;

export interface Action {
	className?: string | ActionClassList;
	style?: Style;
	content?: Content;
	transition?: Transition;
	move?: true | string | moveAction;
	strap?: StrapType;
	broadcast?: Broadcast;
}

export interface StrapType {
	type: string;
	initial: any;
}

export interface moveAction {
	to: string;
	order?: string | number;
}

export type Content = string;

export interface Transition {
	from?: Record<string, any>;
	to: Record<string, any>;
	duration?: number;
	repeat?: number;
	yoyo?: boolean;
	onComplete?: () => void;
	ease?: string | Array<string | Record<string, string>>;
}

export interface ActionClassList {
	add?: string | string[];
	remove?: string | string[];
	toggle?: string | string[];
}

export type DeltaFn = (delta: number) => void;

export type AddToTick = (fn: DeltaFn) => () => void;

export interface Income {
	time: number;
	delta: number;
	name: string;
	seek: boolean;
	data?: any;
}

export interface TimeOptions {
	delta: number;
	options: { time?: number };
}
export type TimerCallback = (data: TimeOptions) => void;

export type PersoId = string;
export type ActionId = string;

// types en entrée
export type Store = Record<PersoId, PersoDef | PersoSoundDef | PersoVideoDef>;

export type PersoStore = Record<PersoId, PersoDef>;

export type PersoAction = Record<ActionId, Action | boolean | SoundAction | ImgAction>;

// types en interne
export type MapEvent = Map<number, any>;
export type MapAction = Map<ActionId, Action>;
export type StateAction = Map<PersoId, Action>;
export type PersosAction = Map<PersoId, PersoAction>;
export type Render = (update: MapAction) => void;

// export type Store = Record<PersoId, Perso>;

export interface BaseNode {
	actions: PersoAction;
	// emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface Perso extends BaseNode {
	id: string;
	type: PersoType;
	initial: Partial<Initial>;
}

interface NodePerso extends Perso {
	parent: string;
	node: HTMLElement | SVGElement;
	style: Style;
	transform: TransformProperty;
	matrix: Matrix2D | [];
}

export interface PersoText extends NodePerso {
	type: PersoType.TEXT;
	child: Txt;
}

export interface PersoLayer extends NodePerso {
	type: PersoType.LAYER;
	child: Layer;
}

export interface PersoImg extends NodePerso {
	type: PersoType.IMG;
	initial: Partial<Initial> & Img;
	update: (update: Partial<Initial> & Img) => void;
}

export interface PersoSprite extends NodePerso {
	type: PersoType.SPRITE;
	initial: Partial<Initial> & Img;
	update: (update: Partial<Initial> & Img) => void;
}

export interface PersoVideo extends NodePerso {
	type: PersoType.VIDEO;
	initial: Partial<Initial> & Vid;
	media: HTMLVideoElement | HTMLAudioElement;
	update: (update: Partial<Broadcast>) => void;
}

export interface PersoSound extends NodePerso {
	type: PersoType.SOUND;
	initial: Partial<Initial> & Vid;
	media: My;
	update: (update: Partial<Broadcast>) => void;
}

export interface SoundNode extends PersoSoundDef {
	media?: My;
}

export interface My extends MediaElementAudioSourceNode {
	my?: {
		connect: () => void;
		disconnect: () => void;
	};
}

export type PersoNode = PersoText | PersoLayer | PersoSprite | PersoImg | PersoSound | PersoVideo;

export interface Initial {
	tag: string;
	id: string;
	attr: any;
	style: Style;
	classStyle: Style;
	className?: string | ActionClassList;
	move: string;
}

export interface Vid {
	src: string;
}

// voir Broadcast

// export interface VidAction {
// 	action: typeof START | typeof STOP;
// 	volume: number;
// 	playbackRate: number;
// 	transition: Transition;
// }

// A revoir passer les props en style sauf src et img
export interface Img {
	img?: HTMLImageElement;
	src: string;
	fit?: string;
	ratio?: number;
	width?: number | string;
	height?: number | string;
	px?: string;
	py?: string;
}
export type ImagesCollection = Map<string, Img>;

export enum PersoType {
	TEXT = 'text',
	IMG = 'img',
	LIST = 'list',
	BLOC = 'bloc',
	ROOT = 'root',
	VIDEO = 'video',
	PROTO = 'proto',
	LAYER = 'layer',
	SPRITE = 'sprite',
	BUTTON = 'button',
	POLYGON = 'polygon',
	SOUND = 'sound',
	AUDIO = 'audio',
}
