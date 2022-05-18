import { withTransform } from './transform';

export function resolveStyles(_style, zoom) {
	const style = withTransform(_style, zoom);
	return style;
}
