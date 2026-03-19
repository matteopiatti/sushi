<script>
	const { depth, children } = $props();

	const registry = {
		1: 'h1',
		2: 'h2',
		3: 'h3',
		4: 'h4',
		5: 'h5',
		6: 'h6'
	};
</script>

<svelte:element this={registry[depth] || 'h1'}>{@render children()}</svelte:element>
