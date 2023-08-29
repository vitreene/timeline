import { extractTransform, withTransform } from './transform';
import { stringSnakeToCamel, addSuffix } from '../../common/utils';

import type { PersoItem, Style } from 'src/types';

export function resolveStyles(styleExtended: Style, zoom: number, perso: PersoItem) {
	const styleNtransform = extractTransform(styleExtended);
	const transform = withTransform(styleNtransform.transform, zoom, perso);

	const style: Style = {};
	for (const property in styleNtransform.style) {
		const value = addSuffix(property, styleNtransform.style[property], zoom);
		const prop = stringSnakeToCamel(property);
		style[prop] = value;
	}

	return transform === null ? style : { ...style, transform };
}
