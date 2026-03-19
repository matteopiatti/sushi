<script>
	import { codeToHtml } from 'shiki';
	const props = $props();

	const html = await codeToHtml(props.value, {
		lang: props.lang || 'js',
		theme: 'github-light',
		defaultColor: false
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html html}
