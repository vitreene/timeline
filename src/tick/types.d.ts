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

export type MapEvent = Map<number, any>;
export type MapAction = Map<string, Action>;
export type PersoId = string;
export type PersoAction = Map<PersoId, MapAction>;
export type Render = (update: MapAction) => void;
