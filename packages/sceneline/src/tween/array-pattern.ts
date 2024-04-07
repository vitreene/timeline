export function extractNumbersFromString(str: string) {
	const numbers = [...str.matchAll(/\d*\.?\d+/gm)].map((p) => Number(p[0]));
	const pattern = str.split(/\d*\.?\d+/m);
	return { numbers, pattern };
}

export function mixNumbersInArray(numbers: Array<number>, pattern: Array<string>) {
	const mix = numbers.map((n, i) => `${pattern[i]}${n}`).join('') + pattern[pattern.length - 1];
	return mix;
}

export function test() {
	const nope = 'there is no numbers in this string';
	const rgba = 'rgba(255,128,240,0.5)';
	const lch = 'lch(52.2% 72.2 50 / 0.5)';
	const hwb = 'hwb(194 0% 0% / 0.5)';
	const oklch = 'oklch(60% 0.15 50)';
	const oklab = 'oklab(59% 0.1 0.1 / 0.5)';
	const d = `M 10,30 A 20, 20 0, 0, 1 50, 30 A 20, 20 0, 0, 1 90, 30 Q 90, 60 50, 90 Q 10, 60 10, 30 z`;
	const d2 = `M 10,30 A 20, 20 0, 0, 1 50, 30 A 20, 20 0, 0, 1 90, 30 Q 90, 60 50, 90 Q 10, 60 10, 30`;

	const results = [nope, d, d2, rgba, lch, hwb, oklch, oklab].map((color) => {
		const { numbers, pattern } = extractNumbersFromString(color);
		const mix = mixNumbersInArray(numbers, pattern);
		console.log(mix === color, numbers.length, pattern.length, color, mix);
		return mix;
	});

	console.log(results);
}
