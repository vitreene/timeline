type LayerContent = Set<HTMLElement>;

export class Layer {
	node: HTMLElement;
	content = new Set<HTMLElement>();
	constructor(node: HTMLElement) {
		this.node = node;
	}

	add(item: HTMLElement, order: number | string = undefined) {
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
	remove(item: HTMLElement) {
		this.content.delete(item);
	}
	order() {}

	update(content: LayerContent) {
		if (!content || !content.size) return;
		let child: HTMLElement | DocumentFragment;

		if (content.size > 1) {
			child = document.createDocumentFragment();
			content.forEach((element: HTMLElement) => {
				child.appendChild(element);
			});
		} else {
			child = content.values().next().value;
		}
		this.node.appendChild(child);
	}
}
