import { Style, Transition } from 'src/types';

class Controller {
	timer = new Timer();
	ticker = new Ticker();
	loopEvent = null;

	constructor(actions, events) {
		this.ticker.handlers.store(this.timer.update);
		this.loopEvent = new LoopEvent(this.ticker.handlers.store);
		this.registerEvents(events);
		this.registerActions(actions);
	}

	registerEvents = (events) => {
		this.loopEvent.add(events);
		this.timer.handlers.store(this.loopEvent.update);
	};
	registerActions = (actions) => {
		this.loopEvent.actionner.add(actions);
	};
	addToTick = (fn) => {
		return this.ticker.handlers.store(fn);
	};
	addToTimer = (fn) => {
		return this.timer.handlers.store(fn);
	};

	reset = () => {
		this.ticker.reset();
		return this;
	};
	play = () => {
		console.log('PLAY');
		this.ticker.play();
		return this;
	};
	pause = () => {
		console.log('PAUSE');

		this.ticker.pause();
		return this;
	};
	stop = () => {
		this.ticker.stop();
		return this;
	};
	start = () => {
		this.ticker.start();
		return this;
	};
	seek = (time = 0) => {
		console.log('SEEK');

		this.pause();
		this.timer.seek(time);
		this.loopEvent.seek(time);
		return this;
	};

	wait = (wait = 0) => {
		this.timer.wait(wait);
		return this.pause();
		// manquent :
		// bloquer les tweens
		// faire attendre la fonction suivante
	};
	/* 
	wait pourrait fonctionner comme pause, pour le Timer 
	*/
	/* 	wait = (wait = 0) => {
		let ticker = new Ticker();
		let timer = new Timer();
		const delTimer = ticker.handlers.store(timer.update);
		timer.handlers.store(({ options: { time } }) => {
			console.log('oh, wait', time);
			if (time >= wait) {
				delTimer();
				timer = null;
				ticker = null;
				this.play();
			}
		});
		ticker.start();
		ticker.play();

		return this.pause();
	}; */
	log = () => {
		console.log(this);
		return this;
	};
}

type ControllerTimeCallback = (delta: number) => void;

interface TimeOptions {
	delta: number;
	options: { time?: number };
}
type TimerCallback = (data: TimeOptions) => void;

/* 
Store
add callbacks : (delta:number)=>void
update : each tick
*/

class Store<T extends Function> extends Set {
	store = (fn: T) => {
		this.add(fn);
		return () => this.delete(fn);
	};
	reset = () => {
		this.clear();
	};
	update = (data: unknown) => {
		this.forEach((fn) => fn(data));
	};
}

class Ticker {
	timeStamp = 0;
	timePause = 0;
	timeScale = 1;
	timeElapsed = 0;

	paused = false;
	playing = false;
	cancelRaf = null;

	handlers = new Store<ControllerTimeCallback>();

	reset = () => {
		this.timeStamp = 0;
		this.timePause = 0;
		this.timeScale = 1;
		this.timeElapsed = 0;
	};

	play = () => (this.playing = true);

	pause = () => (this.playing = false);

	stop = () => {
		cancelAnimationFrame(this.cancelRaf);
		this.playing = false;
		this.handlers.reset();
		console.log('STOP');
	};

	start = (seconds = 0) => {
		console.log('START', seconds);
		this.reset();
		this.tick(0);
	};

	tick = (timestamp: number) => {
		if (this.playing === false) this.paused = true;

		if (this.playing) {
			if (this.paused === true) {
				this.paused = false;
				this.timePause = this.timeStamp - this.timeElapsed;
			}
			const time = timestamp - this.timePause;
			const delta = time - this.timeElapsed;
			this.timeElapsed = time;
			// console.log('TICK', this.timeElapsed, delta);
			this.timeStamp = timestamp;
			this.handlers.update(delta);
		}

		this.raf(this.tick);
	};

	raf = (fn: (time: number) => void) => {
		this.cancelRaf = requestAnimationFrame((timestamp) => {
			fn(timestamp * this.timeScale);
		});
	};
}

/* 
Timer update chaque 1/100s (rafraichissement raf)
register store
update : 
(delta:number)-> set time 
store update(time)
*/
class Timer {
	handlers = new Store<TimerCallback>();
	elapsed = 0;
	time = 0;
	waiting = 0;

	seek(time: number) {
		this.elapsed = time;
	}

	wait = (time: number) => {
		this.waiting = time;
	};

	update = (delta: number) => {
		if (this.waiting > 0) {
			this.waiting -= delta;
		} else {
			this.waiting = 0;
			// console.log('TIMER', delta, this.elapsed);
			this.elapsed += delta;
			const time = Math.round(this.elapsed / 10) * 10;
			if (this.time !== time) {
				this.time = time;
				this.time % 100 === 0 && Promise.resolve(this.handlers.update({ delta, options: { time } }));
			}
		}
	};
}

/* 
class 
register events
compose actionner
*/
type MapEvent = Map<number, any>;

class LoopEvent {
	events: MapEvent;
	actionner = null;

	constructor(ticker) {
		this.actionner = new Actionner(ticker);
	}

	add(events: Map<number, any>) {
		this.events = events;
	}

	update = ({ options }) => {
		const { time } = options;
		if (this.events.has(time)) {
			console.log('EVENT', time, this.events.get(time));
			this.actionner.update({ ...this.events.get(time), delta: 0, time });
		}
	};

	seek = (seek: number) => {
		initDiv();
		const { select } = selectUpTo(this.events, seek);
		select.forEach((event, time) => {
			const delta = seek - time;
			this.actionner.update({ ...event, delta, time, seek: true });
		});
	};
}

/* 
class 
register actions
register components ?
compose effects ?
*/
class Actionner {
	actions: Map<string, any>;
	ticker = null;
	tweens = new Set();
	constructor(ticker) {
		this.ticker = ticker;
	}

	add = (actions: Map<string, any>) => {
		this.actions = actions;
	};

	update = ({
		delta,
		time,
		name,
		data,
		seek = false,
	}: {
		delta: number;
		name: string;
		time: number;
		seek: boolean;
		data?: any;
	}) => {
		if (seek) {
			this.tweens.clear();
		}
		const action = { ...this.actions.get(name), ...data };
		for (const attr in action) {
			switch (attr) {
				case 'content':
					div.textContent = action[attr];
					break;
				case 'action':
					action[attr]();
					break;
				case 'style':
					{
						const style = action[attr];
						for (const s in style) {
							div.style[s] = style[s];
						}
					}
					break;
				case 'className':
					div.classList.add(action[attr]);
					break;
				case 'transition':
					console.log('transition', time, delta, seek, action[attr]);
					this.tweens.add(new Tween(delta, action[attr], seek, this.ticker));
				default:
					break;
			}
		}
	};
}

/* 
class 
register effects
compose queue
*/

class Tween {
	duration: number;
	progress: number = 0;
	from: any;
	to: any;
	removeTick: () => void;
	ticker: (fn: (delta: number) => void) => () => void;

	constructor(delta = 0, transition: Transition, seek = false, ticker) {
		this.ticker = ticker;
		this.from = transition.from;
		this.to = transition.to;
		this.duration = transition.duration || 500;

		// console.log('TWEEN', delta >= this.duration, !!seek);
		this.removeTick = this.ticker(this.tick);

		if (delta >= this.duration) {
			this.tick(this.duration);
		} else {
			this.tick(delta);
		}
	}

	tick = (delta: number) => {
		this.progress += delta;

		if (this.progress >= this.duration) {
			this.progress = this.duration;
			this.removeTick();
		}

		// console.log('tick Tween', this.progress / this.duration);

		for (const item in this.to) {
			const prop = this.lerp(this.from[item], this.to[item], this.progress / this.duration);
			this.updateStyle(item, prop);
		}
	};

	lerp(start: number, end: number, amt: number) {
		return (1 - amt) * start + amt * end;
	}
	// seulement cette partie dans raf
	updateStyle = (item: string, prop: number) => {
		console.log('updateStyle', item, prop);

		switch (item) {
			case 'x':
				div.style.setProperty('--translate-x', prop + 'px');
				break;
			case 'y':
				div.style.setProperty('--translate-y', prop + 'px');
				break;
			case 'font-size':
				// console.log('font-size', Math.round(prop));

				div.style.fontSize = prop + 'px';
				break;
			case 'top':
			case 'bottom':
			case 'left':
			case 'right':
				div.style[item] = prop + 'px';
				break;

			default:
				break;
		}
		div.style[item] = prop;
	};
}

function selectUpTo(map: MapEvent, upTo: number): { select: MapEvent; last: number } {
	const select: MapEvent = new Map();
	let last = 0;
	map.forEach((v, k) => {
		if (k <= upTo) {
			select.set(k, v);
			last = Math.max(k, last);
		}
	});
	return { select, last };
}

// PREP

const app = document.getElementById('app');
let div = document.createElement('div');
app.appendChild(div);
initDiv();

function initDiv() {
	div.removeAttribute('style');
	div.removeAttribute('className');
	// div.textContent = '';
	div.style.fontSize = '48px';
	div.style.position = 'absolute';
}
////////////
// DEMO 4 //
////////////

// INIT
const events = new Map<number, any>([
	[0, { name: 'enter' }],
	[700, { name: 'action01' }],
	[1500, { name: 'action02' }],
	[3000, { name: 'action03', data: { style: { 'font-size': '200px', color: 'cyan' } } }],
]);

const actions = new Map<string, any>(
	Object.entries({
		enter: {
			style: { color: 'orange', transform: 'translate( var(--translate-x) , var(--translate-y) )' },
			className: 'enter',
			content: 'ToTO',
		},
		action01: {
			className: 'action01',
		},
		action02: {
			style: { 'font-weight': 'bold', top: 0 },
			className: 'action02',
			transition: {
				from: { 'font-size': 16, x: 0, y: 0 },
				to: { 'font-size': 120, x: 300, y: 200 },
				duration: 1500,
			},
		},

		action03: {
			className: 'action03',
			// action: controller.stop,
		},
	})
);

const transformer01 = ({ options: { time } }: TimeOptions) => {
	div.textContent = String(time);
};

// PROCESS
const controller = new Controller(actions, events);
controller.addToTimer(transformer01);

// PLAY
// la priorité sur le seek n'est aps la meme que pour le play
controller.start().seek(3000).play();

setTimeout(() => {
	console.log('stout PLAY');
	controller.seek(1500).play();
}, 1000);

// setTimeout(() => {
// 	console.log('PAUSE');
// 	console.log('timeElapsed', controller.timeElapsed);
// 	console.log('timePause', controller.timePause);
// 	controller.pause();
// }, 1000);

// setTimeout(() => {
// 	console.log('PLAY');
// 	console.log('timeElapsed', controller.timeElapsed);
// 	console.log('timePause', controller.timePause);
// 	controller.play();
// }, 2000);

setTimeout(() => {
	controller.stop();
	console.log(controller);
}, 5000);

/* TODO
- wait
- types 
- queue
- render

multi components
tween
tests events, actions

*/

/* FIXME
priorité des actions n'est pas la meme en play et en seek
 */
