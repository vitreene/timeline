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
	elapsed = 0;
	pauseElapsed = 0;
	ticker = new Ticker<ControllerTimeCallback>();
	playing = false;
	paused = false;
	timeScale = 1;
	play = () => {
		this.playing = true;
		this.raf(this.tick);
	};
	pause = () => {
		this.playing = false;
		return this;
	};
	stop = () => {
		this.playing = false;
		this.ticker.reset();
		console.log('STOP');
		return this;
	};
	start = (time = 0) => {
		this.elapsed = 0;
		this.tick(time);
		return this;
	};
	tick = (time: number) => {
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
		this.playing && requestAnimationFrame((delta) => fn(delta * this.timeScale));
	};
	get totalTime() {
		return this.elapsed + this.pauseElapsed;
	}
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
class LoopEvent {
	events: Map<number, unknown>;
	actionner = new Actionner();

	add(events: Map<number, unknown>) {
		this.events = events;
	}
	update = ({ options }) => {
		const { time } = options;
		if (events.has(time)) {
			this.actionner.update({ ...events.get(time), time });
		}
	};
	seek(time: number) {
		/* 
		select events en dessous de time
		update avec delta = time - event.time

		*/
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
	update = ({ delta, time, name, data }: { delta: number; name: string; time: number; data?: any }) => {
		const action = { ...this.actions.get(name), ...data };
		for (const attr in action) {
			switch (attr) {
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
					new Tween(delta, action[attr]);
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
	constructor(delta = 0, transition: Transition) {
		this.from = transition.from;
		this.to = transition.to;
		this.duration = transition.duration || 500;
		//TODO selon play ou seek
		// this.removeTick = ()=>{}
		//this.tick(delta)
		this.removeTick = controller.ticker.add(this.tick);
	}

	tick = (delta: number) => {
		this.progress += delta;
		if (this.progress >= this.duration) this.removeTick();

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
			action: controller.stop,
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

setTimeout(() => {
	if (controller.playing) controller.stop();
}, 5000);
