<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ViewTaskPage from './ViewTaskPage.svelte';

	export let data: PageData;
	let isLoggingIn = false;
</script>

<ViewTaskPage {data} />
