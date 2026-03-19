import { visit } from 'unist-util-visit';

export default function childrenDirective() {
	return (tree) => {
		visit(tree, 'paragraph', (node, index, parent) => {
			if (!parent || index == null) return;
			if (!node.children?.length) return;

			const first = node.children[0];
			if (first.type !== 'text') return;
			if (!first.value.startsWith('@CONTENT')) return;

			const children = structuredClone(node.children);
			children[0].value = children[0].value.slice(3);

			parent.children[index] = {
				type: 'layoutChildren'
			};
		});
	};
}
