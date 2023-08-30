export class Txt {
	node = document.createTextNode('');
	update(text: string | number = '') {
		this.node.textContent = String(text);
	}
}
