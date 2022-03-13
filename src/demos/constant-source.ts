const context = new AudioContext();

const start = context.currentTime;
let count = 0;
schedule(context.createConstantSource());

function onEnd(e) {
	console.log(context.currentTime - start);
	console.log(e.timeStamp);
	if (count < 10) {
		count++;
		schedule(context.createConstantSource());
	}
}

function schedule(constantNode) {
	constantNode.onended = onEnd;
	constantNode.start();
	constantNode.stop(0.01);
}
