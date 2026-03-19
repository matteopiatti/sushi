import { visit } from 'unist-util-visit';

export default function spacerSyntax() {
	return (tree) => {
		visit(tree, 'paragraph', (node, index, parent) => {
			if (!parent || index == null) return;

			const text = node.children
				.filter((c) => c.type === 'text')
				.map((c) => c.value)
				.join('')
				.trim();

			if (text !== '+++') return;

			parent.children[index] = {
				type: 'spacer'
			};
		});
	};
}
