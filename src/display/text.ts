export class Txt {
	node = document.createTextNode('');
	update(text: string | number = '') {
		this.node.nodeValue = String(text);
	}
}
