class Timer {
	isPlaying = false;
	origin: number = 0;
	count: number = 0;

	constructor() {
		onmessage = this.connect.bind(this);
		this.tick = this.tick.bind(this);
	}

	start() {
		this.count = 0;
		this.origin = performance.now();
		this.isPlaying = true;
		postMessage(this.count);
		this.tick();
		console.log('TIMER PLAY');
	}

	stop() {
		this.isPlaying = false;
		console.log('TIMER STOP');
	}

	connect(e: any) {
		console.log('CONNECT', e);

		switch (e.data) {
			case 'start':
				this.start();
				break;
			case 'stop':
				this.stop();
				break;

			default:
				break;
		}
	}

	tick() {
		const now = performance.now();
		const count = Math.floor((now - this.origin) / 10) * 10;
		if (this.isPlaying) {
			if (this.count != count) {
				this.count = count;
				postMessage(count);
			}
			setTimeout(this.tick, 0);
		}
	}
}

const counter = new Timer();
