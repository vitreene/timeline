import * as CSS from 'csstype';

/* interface Transform {
  x?: number;
  y?: number;
  rotate?: CSS.Property.Rotate | number;
  scale?: CSS.Property.Scale | number;
  skewX?: number;
  skewY?: number;
  dX?: number;
  dY?: number;
} */

declare module 'csstype' {
	interface Properties {
		// Add a missing property
		// WebkitRocketLauncher?: string;

		// Add a CSS Custom Property
		// '--theme-color'?: 'black' | 'white';

		// ...or allow any other property
		// [index: string]: any;

		x?: number;
		y?: number;
		rotate?: CSS.Property.Rotate | number;
		scale?: CSS.Property.Scale | number;
		skewX?: number;
		skewY?: number;
		dX?: number;
		dY?: number;
	}

	interface PropertiesHyphen {
		x?: number;
		y?: number;
		rotate?: CSS.Property.Rotate | number;
		scale?: CSS.Property.Scale | number;
		skewX?: number;
		skewY?: number;
		dX?: number;
		dY?: number;
	}
}
