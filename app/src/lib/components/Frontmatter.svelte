<script>
	import { parse as parseYaml } from 'yaml';
	const { value } = $props();
	const data = parseYaml(value);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
</svelte:head>
