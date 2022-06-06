type LayerContent = Set<HTMLElement>;

export class Layer {
	node: HTMLElement;
	content = new Set<HTMLElement>();
	constructor(node: HTMLElement) {
		this.node = node;
	}

	add(item: HTMLElement, order: number = null) {
		if (!order) {
			this.content.add(item);
		} else {
			this.content = new Set(Array.from(this.content).splice(order, 0, item));
		}
		return this.content;
	}
	remove(item: HTMLElement) {
		this.content.delete(item);
	}
	order() {}

	update(content: LayerContent) {
		if (!content || !content.size) return;
		if (content.size > 1) {
			const child = document.createDocumentFragment();
			content.forEach((element: HTMLElement) => {
				child.appendChild(element);
				this.node.appendChild(child);
			});
		} else {
			const element = content.values().next().value;
			this.node.appendChild(element);
		}
	}
}
