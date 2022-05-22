import { extractTransform, withTransform } from './transform';
import { stringSnakeToCamel, addSuffix } from '../common/utils';

import type { Style } from 'src/types';

export function resolveStyles(styleExtended: Style, zoom: number) {
	const { style, transform } = extractTransform(styleExtended);
	const _transform = withTransform(transform, zoom);

	const _style = {};
	for (const _prop in style) {
		const value = addSuffix(_prop, style[_prop], zoom);
		const prop = stringSnakeToCamel(_prop);
		_style[prop] = value;
	}

	return { ..._style, ..._transform };
}
