import * as CSS from 'csstype';
import { Txt } from './render/components/txt';
import { Layer } from './render/components/layer';
import { TransformStyle } from './render/transform';

export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

export interface Eventime {
	name?: string;
	startAt: number;
	channel?: ChannelName;
	track?: string;
	data?: any;
	duration?: number;
	events?: Eventime[];
}

export interface Initial {
	tag: string;
	id: string;
	attr: any;
	style: Style;
	content: Content | Content[];
	classStyle: Style;
	className: string | string[];
	move: string | Move;
	src: string;
	fit: string;
	track: string;
}

export interface Action extends Partial<Initial> {
	transition?: Transition;
	action?: 'start' | 'end';
	// order?: number;
	// exit?: boolean;
	// leave?: boolean;
}

export type Update = { [id: string]: Partial<Action> };
export type Render = (update: Update) => void;

export interface Perso {
	readonly id: string;
	readonly element: PersoElementType;
	initial: Initial;
	listen?: Eventime[];
	actions: Action[];
	// emit?: Emit;
	// extends?: string;
	// src?: string;
}
export type Store = Record<string, PersoNode | SoundNode>;
export type PersoStore = Record<string, PersoNode>;
export type SoundStore = Record<string, SoundNode>;

export interface PersoNode {
	type: Omit<PersoElementType, PersoElementType.SOUND>;
	actions: { [action: string]: Action | boolean };
	initial: Partial<Initial>;
	emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface SoundNode extends Partial<PersoNode> {
	type: PersoElementType.SOUND;
	src: string;
	media?: MediaElementAudioSourceNode;
}

export interface PersoItem extends Omit<PersoNode, 'type'> {
	id: string;
	prec: Partial<Action>;
	update: (update?: Partial<Action> | undefined) => void;
	node: HTMLElement;
	child: Txt | Layer;
	style: Style;
	listeners?: Map<keyof HTMLElementEventMap, HandlerListener>;
	reset: () => void;
	transform: TransformStyle;
}

export type HandlerListener = (target: Event) => void;

export type Emit = {
	readonly [key in keyof GlobalEventHandlersEventMap]?: EmitEvent | Array<EmitEvent>;
};

interface EmitEvent {
	event: Eventime;
	data?: any;
}

export interface Move {
	to: string;
	rescale?: boolean;
}

export interface Transition {
	from?: string | Style;
	to: string | Style;
	duration?: number;
	repeat?: number;
	yoyo?: boolean;
	oncomplete?: any;
}

export type Content = string | number | PersoItem | HTMLElement | Set<HTMLElement> | CollectionImages;
/* |Lang |  */

export interface CollectionImages {
	src: string;
	fit?: string;
	ratio?: number;
	width?: number;
	height?: number;
}

export type ImagesCollection = Map<string, CollectionImages>;

// ENUM

export enum ChannelName {
	MAIN = 'main',
	TELCO = 'telco',
	STRAP = 'strap',
	DEFAULT = MAIN,
	SOUND = 'sound',
}

export enum Lang {
	FR = 'fr',
	EN = 'en',
	DE = 'de',
	ES = 'es',
	NL = 'nl',
	IT = 'it',
	PL = 'pl',
	PT = 'pt',
	RU = 'ru',
	CN = 'cn',
}

export enum PersoElementType {
	TEXT = 'text',
	IMG = 'img',
	LIST = 'list',
	BLOC = 'bloc',
	ROOT = 'root',
	SOUND = 'sound',
	VIDEO = 'video',
	PROTO = 'proto',
	LAYER = 'layer',
	SPRITE = 'sprite',
	BUTTON = 'button',
	POLYGON = 'polygon',
}
