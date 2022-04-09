import { render } from 'solid-js/web';

import { App } from './demos/demo07';

const rootElement = document.getElementById('app');
const dispose = render(() => App, rootElement);

// HMR stuff, this will be automatically removed during build
if (import.meta.hot) {
	import.meta.hot.accept();
	import.meta.hot.dispose(dispose);
}
