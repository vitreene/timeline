
import * as CSS from 'csstype';

export interface Style
	extends CSS.Properties<string | number>,
		CSS.PropertiesHyphen<string | number> {}


export interface Eventime{
  name?: string
  startAt: number;
  channel?: string
  events?: Eventime[]
}


export interface Initial {
	id?: string;
	attr?: any;
	fit?: string;
	style?: Style;
	content?: Content;
	classStyle?: Style;
	className?: string | [string];
}

export interface Action extends Initial {
	name: string;
	move?: string | Move;
  transition?: Transition;
	// order?: number;
	// exit?: boolean;
	// leave?: boolean;
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
	readonly [key in keyof GlobalEventHandlersEventMap]?:
		| EmitEvent
		| Array<EmitEvent>;
};

interface EmitEvent {
	event: Eventime;
	data?: any;
}

interface Move {
	layer?: string;
	story?: string;
	slot: string;
	rescale?: boolean;
}

interface Transition {
	from?: string | Style;
	to: string | Style;
	duration?: number;
	oncomplete?: any;
}


export type Content =
  | Lang
	| string
	| HTMLElement
	| Array<Initial>
	| CollectionImages
  ;

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
	DEFAULT_NS = MAIN,
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

