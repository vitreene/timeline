import * as CSS from 'csstype';

export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

export interface Eventime {
	name?: string;
	startAt: number;
	channel?: string;
	data?: any;
	events?: Eventime[];
}

export interface Initial {
	id: string;
	attr: any;
	fit: string;
	style: Style;
	content: Content;
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

export interface Store {
	[perso: string]: PersoNode;
}

export interface PersoNode {
	actions: { [action: string]: Action };
	initial: Partial<Initial>;
}
export interface Perso {
	readonly id: string;
	readonly element: PersoElement;
	initial: Initial;
	listen?: Eventime[];
	actions: Action[];
	// emit?: Emit;
	// extends?: string;
	// src?: string;
}

export type Emit = {
	readonly [key in keyof GlobalEventHandlersEventMap]?: EmitEvent | Array<EmitEvent>;
};

interface EmitEvent {
	event: Eventime;
	data?: any;
}

interface Move {
	to: string;
	rescale?: boolean;
}

export interface Transition {
	from?: string | Style;
	to: string | Style;
	duration?: number;
	oncomplete?: any;
}

export type Content = Lang | string | HTMLElement | Array<Initial> | CollectionImages;

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

export enum PersoElement {
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
