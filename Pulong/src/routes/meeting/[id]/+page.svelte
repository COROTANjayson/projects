<script lang="ts">
	import { selectedAgenda } from '$lib/stores/meetingStore';
	import KpiPage from '../components/KPIPage.svelte';
	import SeguePage from '../components/SeguePage.svelte';
	import GoalPage from '../components/GoalPage.svelte';
	import HeadlinePage from '../components/HeadlinePage.svelte';
	import TodoPage from '../components/TodoPage.svelte';
	import IssuePage from '../components/IssuePage.svelte';
	import ConcludePage from '../components/ConcludePage.svelte';




	export let data

</script>

<!-- <Toast /> -->
<!-- <SuperDebug data={$form} /> -->

<div class="p-6">
	{#if $selectedAgenda === 'Segue'}
		<SeguePage data={data}/>
	{:else if $selectedAgenda === 'KPI'}
	<KpiPage data={data}/>

	{:else if $selectedAgenda === 'Goals'}
	<GoalPage data={data}/>
	{:else if $selectedAgenda === 'Headlines'}
	<HeadlinePage data={data}/>

	{:else if $selectedAgenda === 'To-Do'}
	<TodoPage data={data}/>

	{:else if $selectedAgenda === 'IDS'}
	<IssuePage data={data}/>

	{:else if $selectedAgenda === 'Conclude'}
	<ConcludePage data={data}/>

	{/if}
</div>
