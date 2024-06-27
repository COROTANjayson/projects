<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import HomePage from './HomePage.svelte';

	export let data: PageData;
	let pathname: String;

	onMount(() => {
		pathname = $page.url.pathname;
	});
</script>

{#if pathname == '/'}
	<HomePage {data} />
{/if}
