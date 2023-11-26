const transformParam = [
	'perpective',
	'translate',
	'translateX',
	'translateY',
	'rotate',
	'scale',
	'scaleX',
	'scaleY',
	'skew',
	'skewX',
	'skewY',
];
const transformMatrixParam = ['matrix', 'matrixX', 'matrixY', 'matrixZ', 'matrixW'];
const transformSpecialParam = ['x', 'y', 'dx', 'dy', 'movex', 'movey'];

export const transformAliases = {
	x: 'translateX',
	y: 'translateY',
};

type CSSTransformParam = (typeof transformParam)[number];
type CSSTransformMatrixParam = (typeof transformMatrixParam)[number];
export type CSSTransformSpecialParam = (typeof transformSpecialParam)[number];

export const transformKeys = [...transformParam, ...transformMatrixParam, ...transformSpecialParam];

type TransformUnit = '' | 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax' | 'deg' | 'rad' | 'turn';

interface TransformDiscreteProperty {
	value: number;
	unit: TransformUnit;
	zoomable: boolean;
}
interface TransformMatrixProperty {
	value: Matrix;
}

type TransformDiscretePrep = { [key in CSSTransformParam]: TransformDiscreteProperty };
type TransformSpeciaPrep = { [key in CSSTransformSpecialParam]: TransformDiscreteProperty };
type TransformMatrixPrep = { [key in CSSTransformMatrixParam]: TransformMatrixProperty };

export type TransformProperty = TransformSpeciaPrep | TransformDiscretePrep | TransformMatrixPrep;

export declare type Matrix2D = [number, number, number, number, number, number];

export declare type Matrix3D = [
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number,
	number
];

export declare type Matrix = Matrix2D | Matrix3D;
