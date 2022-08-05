import { extractTransform, withTransform } from './transform';
import { stringSnakeToCamel, addSuffix } from '../common/utils';

import type { Style } from 'src/types';

export function resolveStyles(styleExtended: Style, zoom: number) {
	const { style, transform: t_ } = extractTransform(styleExtended);
	const transform = withTransform(t_, zoom);

	const s_ = {};
	for (const prop_ in style) {
		const value = addSuffix(prop_, style[prop_], zoom);
		const prop = stringSnakeToCamel(prop_);
		s_[prop] = value;
	}

	return { ...s_, transform };
}
