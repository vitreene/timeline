/* 
créer une class Ticker 
- avec subscribe 
- method tick recoit un delta et le passe aux observables

au dessus, un controller avec
- method play/stop/pause
- un compteur elapsed

un timer utilise un controller pour fournir des valeurs stables d'un compteur temps

*/

import { Transition } from 'src/types';

/* 
Ticker
add callbacks : (delta:number)=>void
update : each tick
*/

type ControllerTimeCallback = (delta: number) => void;
interface TimeOptions {
	delta: number;
	options: { time?: number };
}
type TimerCallback = (data: TimeOptions) => void;

class Ticker<T extends Function> {
	callbacks = new Set<T>();
	add = (fn: T) => {
		this.callbacks.add(fn);
		return () => this.callbacks.delete(fn);
	};
	reset = () => {
		this.callbacks.clear();
	};
	update = (data: any) => {
		this.callbacks.forEach((fn) => fn(data));
	};
}

/* 
register ticker
controls : play pause start stop 
tick (delta) => ticket update(delta) 
raf tick
*/
class Controller {
	timestamp = 0;
	pauseTime = 0;
	timeOffset = 0;

	elapsed = 0;
	pauseElapsed = 0;

	timeScale = 1;
	paused = false;
	playing = false;
	ticker = new Ticker<ControllerTimeCallback>();

	reset = () => {
		this.elapsed = 0;

		this.timeOffset = 0;
		this.timestamp = 0;
		this.pauseTime = 0;
	};

	play = () => {
		if (!this.playing) {
			this.timeOffset = this.timestamp - this.timeOffset - this.pauseTime;
			this.pauseTime = 0;
		}
		this.playing = true;
		this.raf(this.tick);
	};
	pause = () => {
		this.pauseTime = this.timestamp;
		this.playing = false;
		return this;
	};
	stop = () => {
		cancelAnimationFrame(this.cancelRaf);
		this.playing = false;
		this.ticker.reset();
		console.log('STOP');
		return this;
	};
	start = (time = 0) => {
		this.reset();
		requestAnimationFrame(this.updateTimeStamp);
		// this.tick(time);
		return this;
	};

	seek = (time = 0) => {
		this.elapsed = time;

		this.playing = false;
		loopEvent.seek(time);
		return this;
	};

	tick = (time: number) => {
		console.log('tick', time - this.timeOffset);

		if (this.paused === true) {
			this.pauseElapsed += time - this.elapsed;
			this.paused = false;
		}
		if (this.playing === false) this.paused = true;

		const effectiveTime = time - this.pauseElapsed;
		const delta = effectiveTime - this.elapsed;
		this.elapsed = effectiveTime;
		const payload = { delta, options: { time } };
		this.ticker.update(delta);
		this.raf(this.tick);
	};

	raf = (fn: (delta: number) => void) => {
		requestAnimationFrame((timestamp) => {
			this.playing && fn(timestamp * this.timeScale);
		});
	};

	cancelRaf = null;
	updateTimeStamp = (timestamp: number) => {
		this.timestamp = timestamp * this.timeScale;
		this.cancelRaf = requestAnimationFrame(this.updateTimeStamp);
	};

	// get totalTime() {
	// 	return this.elapsed + this.pauseElapsed;
	// }
}

/* 
Timer update chaque 1/100s (rafraichissement raf)
register ticker
update : 
(delta:number)-> set time 
ticker update(time)
*/
class Timer {
	ticker = new Ticker<TimerCallback>();
	elapsed = 0;
	time = 0;

	update = (delta: number) => {
		this.elapsed += delta;
		const time = Math.round(this.elapsed / 10) * 10;
		if (this.time !== time) {
			this.time = time;
			this.time % 100 === 0 && this.ticker.update({ delta, options: { time } });
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
	actionner = new Actionner();

	add(events: Map<number, any>) {
		this.events = events;
	}
	update = ({ options }) => {
		const { time } = options;
		if (this.events.has(time)) {
			this.actionner.update({ ...this.events.get(time), time });
		}
	};
	seek(seek: number) {
		const { select, last } = selectUpTo(this.events, seek);
		const delta = seek - last;
		select.forEach((event, time) => {
			const delta = seek - time;
			this.actionner.update({ ...event, delta, time, seek: true });
		});
	}
}

/* 
class 
register actions
register components ?
compose effects ?
*/
class Actionner {
	actions: Map<string, any>;
	add(actions: Map<string, any>) {
		this.actions = actions;
	}
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
						for (const s in style) div.style[s] = style[s];
					}
					break;
				case 'className':
					div.classList.add(action[attr]);
					break;
				case 'transition':
					console.log(action[attr]);
					new Tween(delta, action[attr], seek);
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
const effecter = (effect) => {};

class Tween {
	duration: number;
	progress: number = 0;
	removeTick: () => void;
	from: any;
	to: any;

	constructor(delta = 0, transition: Transition, seek = false) {
		const duration = transition.duration || 500;
		if (delta >= duration) {
			console.log({ delta, duration, seek });
			for (const item in this.to) this.updateStyle(item, this.to[item]);
			return;
		}
		if (seek) this.tick(delta);
		this.from = transition.from;
		this.to = transition.to;
		this.duration = duration || 500;
		this.removeTick = controller.ticker.add(this.tick);
	}

	tick = (delta: number) => {
		this.progress += delta;
		if (this.progress >= this.duration) {
			this.progress = this.duration;
			this.removeTick();
		}

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
		switch (item) {
			case 'x':
				div.style.translate = prop + 'px';
				break;
			case 'font-size':
				div.style.fontSize = prop + 'px';
				break;
			case 'top':
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
const div = document.createElement('div');
div.style.fontSize = '48px';
div.style.position = 'absolute';
app.appendChild(div);
const timer = new Timer();
const controller = new Controller();
controller.ticker.add(timer.update);

////////////
// DEMO 4 //
////////////

// INIT
const events = new Map<number, any>([
	[500, { name: 'enter' }],
	[700, { name: 'action03' }],
	[1000, { name: 'action01' }],
	[3000, { name: 'action02', data: { style: { 'font-size': '150px' } } }],
]);

const actions = new Map<string, any>(
	Object.entries({
		enter: {
			style: { color: 'orange' },
			className: 'init-action',
		},
		action01: {
			style: { 'font-weight': 'bold' },
			className: 'action01',
			transition: {
				from: { 'font-size': 16, top: 0, right: 50, x: 0 },
				to: { 'font-size': 120, top: 100, right: 100, x: -300 },
				duration: 1500,
			},
		},
		action02: {
			className: 'action02',
			// action: controller.stop,
		},
		action03: {
			className: 'action03',
			content: 'ToTO',
		},
	})
);

const transformer01 = ({ options: { time } }: TimeOptions) => {
	div.textContent = String(time);
};

// PROCESS
const loopEvent = new LoopEvent();
loopEvent.add(events);
loopEvent.actionner.add(actions);

timer.ticker.add(transformer01);
timer.ticker.add(loopEvent.update);

controller.start().play();
// controller.start().seek(1700).play();

setTimeout(() => {
	console.log('PAUSE');
	console.log('timestamp', controller.timestamp);
	console.log('pauseTime', controller.pauseTime);
	controller.pause();
}, 1000);

setTimeout(() => {
	console.log('PLAY');
	console.log('timestamp', controller.timestamp);
	console.log('pauseTime', controller.pauseTime);
	controller.play();
}, 3000);

setTimeout(() => {
	if (controller.playing) controller.stop();
}, 4000);

// console.log(selectUpTo(events, 1100));
