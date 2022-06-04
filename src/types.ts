import * as CSS from 'csstype';
import { Layer, Txt } from './render/create-perso';

export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

export interface Eventime {
	name?: string;
	startAt: number;
	channel?: string;
	data?: any;
	events?: Eventime[];
}

export interface Initial {
	tag: string;
	id: string;
	attr: any;
	fit: string;
	style: Style;
	content: Content | Content[];
	classStyle: Style;
	className: string | [string];
	move: string | Move;
}

export interface Action extends Partial<Initial> {
	transition?: Transition;
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
export interface Store {
	[perso: string]: PersoNode;
}

export interface PersoNode {
	type: PersoElementType;
	actions: { [action: string]: Action | boolean };
	initial: Partial<Initial>;
	emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface PersoItem extends Omit<PersoNode, 'type'> {
	id: string;
	prec: Partial<Action>;
	update: (update?: Partial<Action> | undefined) => void;
	node: HTMLElement;
	child: Txt | Layer;
	style: Style;
	listeners?: Map<keyof HTMLElementEventMap, HandlerListener>;
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

export type Content = string | number | PersoItem | HTMLElement;
/* |Lang |  CollectionImages */

export interface CollectionImages {
	src: string;
	ratio: number;
	width: number;
	height: number;
}

export type ImagesCollection = Map<string, CollectionImages>;

// ENUM

export enum ChannelName {
	MAIN = 'main',
	TELCO = 'telco',
	PLAY = 'play',
	STRAP = 'strap',
	DEFAULT = MAIN,
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
