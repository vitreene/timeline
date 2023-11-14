type LayerContent = Set<HTMLElement | SVGElement>;

export class Layer {
	node: HTMLElement | SVGElement;
	content = new Set<HTMLElement | SVGElement>();

	constructor(node: HTMLElement | SVGElement) {
		this.node = node;
	}

	add(item: HTMLElement | SVGElement, order: number | string = undefined) {
		switch (typeof order) {
			case 'undefined':
				this.content.add(item);
				break;
			case 'string':
				if (order === 'last') this.content.add(item);
				if (order === 'first') this.content = new Set([item, ...this.content]);
				break;

			case 'number':
				this.content = new Set(Array.from(this.content).splice(order, 0, item));
				break;
		}

		return this.content;
	}
	remove(item: HTMLElement | SVGElement) {
		this.content.delete(item);
	}
	reset() {
		while (this.node.firstChild) {
			this.node.removeChild(this.node.firstChild);
		}
		this.content.clear();
	}
	order() {}

	update(content: LayerContent) {
		if (!content || !content.size) return;
		let child: HTMLElement | SVGElement | DocumentFragment;

		if (content.size > 1) {
			child = document.createDocumentFragment();
			content.forEach((element: HTMLElement | SVGElement) => {
				child.appendChild(element);
			});
		} else {
			child = content.values().next().value;
		}
		this.node.appendChild(child);
	}
}
