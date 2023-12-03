export { Strap } from './strap';
import { Counter } from './counter';

const strapCollection = {
	[Counter.type]: Counter,
};

export function straps(type: string, initial: any) {
	const strap = type in strapCollection && new strapCollection[type](initial);
	return strap;
}
