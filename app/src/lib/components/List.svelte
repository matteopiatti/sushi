<script>
	const props = $props();
</script>

<svelte:element this={props.ordered ? 'ol' : 'ul'}>
	{@render props.children?.()}
</svelte:element>
