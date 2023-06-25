import * as CSS from 'csstype';
export interface Style extends CSS.Properties<string | number>, CSS.PropertiesHyphen<string | number> {}

export interface Action {
	className?: string | ActionClassList;
	style?: Style;
	content?: Content;
	transition?: Transition;
}

export type Content = string;

export interface Transition {
	from?: Style;
	to: Style;
	duration?: number;
	repeat?: number;
	yoyo?: boolean;
	oncomplete?: any;
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
export type PersoAction = Record<ActionId, Action | boolean>;

// types en interne
export type MapEvent = Map<number, any>;
export type MapAction = Map<ActionId, Action>;
export type PersosAction = Map<PersoId, PersoAction>;
export type Render = (update: MapAction) => void;

export type Store = Record<PersoId, PersoNode>;

export interface BaseNode {
	actions: PersoAction;
	// emit?: { [prop in keyof Emit]: Partial<Eventime> };
}

export interface PersoNode extends BaseNode {
	type: PersosTypes;
	// initial: Partial<Initial>;
}

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
