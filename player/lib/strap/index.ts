export { Strap } from './strap';
import { Counter } from './counter';

const strapCollection = {
	[Counter.type]: Counter,
};

export function straps(type: string, initial: any) {
	return new strapCollection[type](initial);
}
