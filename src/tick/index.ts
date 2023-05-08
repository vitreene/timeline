/* 
créer une class Ticker 
- avec subscribe 
- method tick recoit un delta et le passe aux observables

au dessus, un controller avec
- method play/stop/pause
- un compteur elapsed

un timer utilise un controller pour fournir des valeurs stables d'un compteur temps

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
	};
	stop = () => {
		this.playing = false;
		this.ticker.reset();
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

class Timer {
	ticker = new Ticker();
	elapsed = 0;
	time = 0;

	update = (delta: number) => {
		this.elapsed += delta;
		this.time = Math.floor(this.elapsed / 10) * 10;
		this.time % 100 === 0 && this.ticker.update(this.time);
	};
}

// DEMO 02
const timer = new Timer();
const div = document.createElement('div');
div.style.fontSize = '48px';
document.body.appendChild(div);

const transformer01 = (time: number) => {
	div.textContent = String(time);
};
timer.ticker.add(transformer01);

const controller = new Controller();
controller.ticker.add(timer.update);

const transformer02 = (value = 0) => {
	return (delta: number) => {
		value += delta;
		div.style.color = `hsl(${Math.round((value / 10) % 360)} 80% 50%)`;
	};
};
controller.ticker.add(transformer02(0));

controller.start().play();

setTimeout(() => {
	controller.pause();
}, 1000);

setTimeout(() => {
	controller.play();
}, 3000);

setTimeout(() => {
	controller.stop();
}, 5000);
