import * as CSS from 'csstype';
import { Layer } from '../display/layer';
import { Txt } from '../display/text';
import { Sprite } from '../display/sprite';
import { Matrix2D, TransformProperty } from './transform-types';

export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

export interface StyleEntry {
	[x: string]:
		| string
		| number
		| { value: number; unit?: string; ease?: string }
		| { value: number[]; pattern: string; ease?: string };
}

/* 
ecrire les interfaces par type d'élement en entrée

*/
export interface PersoBaseDef {
	type: PersosTypes;
	initial: Partial<Initial>;
	actions?: Record<string, Action | boolean>;
}
export interface PersoImgDef {
	type: PersosTypes.IMG | PersosTypes.SPRITE;
	initial: Partial<Omit<Initial, 'content'>> & { content: Img };
	actions?: Record<string, Action & { content?: Img }>;
}

export type PersoDef = PersoBaseDef | PersoImgDef;

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
export type PersoStore = Record<PersoId, PersoDef>;
export type PersoAction = Record<ActionId, Action | boolean>;

// types en interne
export type MapEvent = Map<number, any>;
export type MapAction = Map<ActionId, Action>;
export type StateAction = Map<PersoId, Action>;
export type PersosAction = Map<PersoId, PersoAction>;
export type Render = (update: MapAction) => void;

export type Store = Record<PersoId, Perso>;

export interface BaseNode {
	actions: PersoAction;
	// emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface Perso extends BaseNode {
	id: string;
	type: PersosTypes;
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
	type: PersosTypes.TEXT;
	child: Txt;
}

interface PersoLayer extends NodePerso {
	type: PersosTypes.LAYER;
	child: Layer;
}

export interface PersoSprite extends NodePerso {
	type: PersosTypes.SPRITE;
	child: Sprite;
	initial: Partial<Initial> & Img; // FIXME
}

export type PersoNode = PersoText | PersoLayer | PersoSprite;

export interface Initial {
	tag: string;
	id: string;
	attr: any;
	style: Style;
	classStyle: Style;
	className?: string | ActionClassList;
	move: string;
	content: Content;
}

export interface Img {
	src: string;
	fit?: string;
	ratio?: number;
	width?: number;
	height?: number;
	px?: string;
	py?: string;
}
export type ImagesCollection = Map<string, Img>;

export enum PersosTypes {
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
}