/* 
créer une class Ticker 
- avec subscribe 
- method tick recoit un delta et le passe aux observables

au dessus, un controller avec
- method play/stop/pause
- un compteur elapsed

un timer utilise un controller pour fournir des valeurs stables d'un compteur temps

*/

/* 
Ticker
add callbacks : (delta:number)=>void
update : each tick
*/

type Callback = (delta: number) => void;
class Ticker {
	callbacks = new Set<Callback>();
	add = (fn: Callback) => {
		this.callbacks.add(fn);
		return () => this.callbacks.delete(fn);
	};
	reset = () => {
		this.callbacks.clear();
	};
	update = (delta: number) => {
		this.callbacks.forEach((fn) => fn(delta));
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
	ticker = new Ticker();
	playing = false;
	paused = false;
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

		this.ticker.update(delta);
		this.raf(this.tick);
	};
	raf = (fn: Callback) => {
		this.playing && requestAnimationFrame(fn);
	};
	get totalTime() {
		return this.elapsed + this.pauseElapsed;
	}
}

/* 
Timer
register ticker
update : 
(delta:number)-> set time 
ticker update(time)
*/
class Timer {
	ticker = new Ticker();
	elapsed = 0;
	time = 0;

	update = (delta: number) => {
		this.elapsed += delta;
		const time = Math.round(this.elapsed / 10) * 10;
		if (this.time !== time) {
			this.time = time;
			this.time % 100 === 0 && this.ticker.update(this.time);
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
	actionner = actionner;
	add(events: Map<number, unknown>) {
		this.events = events;
	}
	update = (time: number) => {
		if (events.has(time)) {
			this.actionner(events.get(time));
		}
	};
}

/* 
class 
register actions
register components 
compose effects
*/
const actionner = (event) => {
	for (const item in event) {
		if (item === 'func') event[item]();
		else div.style[item] = event[item];
	}
};

/* 
class 
register effects
compose queue
*/
const effecter = (effect) => {};

// PREP

const app = document.getElementById('app');
const div = document.createElement('div');
div.style.fontSize = '48px';
app.appendChild(div);
const timer = new Timer();
const controller = new Controller();
controller.ticker.add(timer.update);

// DEMO 3

const events = new Map<number, any>();
events.set(500, { fontWeight: 'bold' });
events.set(1000, { color: 'red' });
events.set(3000, { func: controller.stop });

const loopEvent = new LoopEvent();
loopEvent.add(events);
timer.ticker.add(loopEvent.update);

const transformer01 = (time: number) => {
	div.textContent = String(time);
};
timer.ticker.add(transformer01);

controller.start().play();
