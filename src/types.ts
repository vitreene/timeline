import * as CSS from 'csstype';
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

export interface BaseInitial {
	tag: string;
	id: string;
	attr: any;
	style: Style;
	classStyle: Style;
	className: string | string[];
	move: string | Move;
	src: string;
	fit: string;
	track: string;
}
export interface Initial extends BaseInitial {
	content: Content | Content[];
}

export interface Action extends Partial<Initial> {
	transition?: Transition;
	action?: 'start' | 'end';
	delta?: number;
	currentTime?: number;
	// order?: number;
	// exit?: boolean;
	// leave?: boolean;
}

export type Store = Record<string, PersoNode | SoundNode | Thr3dSceneNode>;
export type PersoStore = Record<string, PersoNode>;
export type SoundStore = Record<string, SoundNode>;

export interface BaseNode {
	actions: { [action: string]: Action | boolean };
	emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface PersoNode extends BaseNode {
	type: Omit<PersoElementType, PersoElementType.SOUND | PersoElementType.THR3D_SCENE>;
	initial: Partial<Initial>;
}

export interface SoundNode extends BaseNode {
	type: PersoElementType.SOUND;
	src: string;
	initial: Partial<Initial>;
	media?: MediaElementAudioSourceNode;
}

export interface Thr3dSceneNode extends BaseNode {
	type: PersoElementType.THR3D_SCENE;
	initial: Partial<BaseInitial> & { content: Partial<THR3D_SCENE> };
}

interface Item {
	id: string;
	prec: Partial<Action>;
	update: (update?: Partial<Action> | undefined) => void;
	node: HTMLElement;
	child: any; // Txt | Layer | Thr3d;
	style: Style;
	listeners?: Map<keyof HTMLElementEventMap, HandlerListener>;
	reset: () => void;
	transform: TransformStyle;
}
export type PersoItem = Item & PersoNode;
export interface PersoThr3dSceneItem extends Item, Thr3dSceneNode {
	add: (perso: PersoNode) => void;
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

export interface THR3D_SCENE {
	children: string[];
	renderer: any;
	camera: any;
	controls: any;
}

export type Render = (update: Update) => void;
export type Update = { [id: string]: Partial<Action> };
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

// ENUM

export enum ChannelName {
	MAIN = 'main',
	TELCO = 'telco',
	STRAP = 'strap',
	DEFAULT = MAIN,
	SOUND = 'sound',
	THR3D = 'THR3D',
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
	THR3D = 'THR3D',
	THR3D_SCENE = 'THR3D_SCENE',
}
