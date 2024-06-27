<script lang="ts">
	import axios from 'axios';
	import { onMount } from 'svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';
	import GoalsList from '../../../goals/GoalsList.svelte';
	import { page } from '$app/stores';
	import KpiPage from './KPIPage.svelte';
	import GoalPage from './GoalPage.svelte';
	import HeadlinePage from './HeadlinePage.svelte';
	import TodoPage from './TodoPage.svelte';
	import IssuePage from './IssuePage.svelte';
	$: teamId = $page.params.id;
	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	$: goals = [] as any[];
	let isLoading = false;
	let skeletonDivNum = 1;
</script>

<div class="pb-5 space-y-6">
	<KpiPage {data} {skeletonDivNum} />
	<GoalPage {data} {skeletonDivNum} />
	<HeadlinePage {data} {skeletonDivNum} />
	<TodoPage {data} {skeletonDivNum} />
	<IssuePage {data} {skeletonDivNum} />
</div>
