import * as CSS from 'csstype';
import { Layer } from './lib/display/layer';
import { Txt } from './lib/display/text';
import { Sprite } from './lib/display/sprite';
import { Matrix2D, TransformProperty } from './lib/sceneline/transform-types';
import { START, STOP } from '~/common/constants';

export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

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
	actions?: Record<string, SoundAction>;
	media?: My;
}

export interface SoundAction {
	[action: string]: typeof START | typeof STOP;
}

export interface ImgAction extends Omit<Action, 'content'> {
	content?: Img;
}
export type PersoDef = PersoTextDef | PersoLayerDef | PersoImgDef;

export interface Action {
	className?: string | ActionClassList;
	style?: Style;
	content?: Content;
	transition?: Transition;
	move?: true | string | moveAction;
	strap?: StrapType;
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
	from?: Style;
	to: Style;
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

export interface TimeOptions {
	delta: number;
	options: { time?: number };
}
export type TimerCallback = (data: TimeOptions) => void;

export type PersoId = string;
export type ActionId = string;

// types en entrée
export type Store = Record<string, PersoDef | PersoSoundDef>;

export interface PersoMediaStore {
	persos: Record<string, PersoDef>;
	sounds?: Record<string, PersoSoundDef>;
}

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

interface PersoText extends NodePerso {
	type: PersoType.TEXT;
	child: Txt;
}

interface PersoLayer extends NodePerso {
	type: PersoType.LAYER;
	child: Layer;
}

export interface PersoImg extends NodePerso {
	type: PersoType.IMG;
	child: Sprite;
	initial: Partial<Initial> & Img;
	update: (update: Partial<Initial> & Img) => void;
}

export interface PersoSprite extends NodePerso {
	type: PersoType.SPRITE;
	child: Sprite;
	initial: Partial<Initial> & Img;
	update: (update: Partial<Initial> & Img) => void;
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

export type PersoNode = PersoText | PersoLayer | PersoSprite | PersoImg;

export interface Initial {
	tag: string;
	id: string;
	attr: any;
	style: Style;
	classStyle: Style;
	className?: string | ActionClassList;
	move: string;
}

export interface Img {
	img?: typeof Image;
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
}
