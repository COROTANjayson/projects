<script lang="ts">
	import type { PageData } from './$types';
	import DashboardPage from './DashboardPage.svelte';

	export let data: PageData;
</script>

<DashboardPage {data} />
