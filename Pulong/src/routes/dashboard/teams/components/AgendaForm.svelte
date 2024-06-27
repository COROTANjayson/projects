<script lang="ts">
	import DropdownForm from '$lib/components/DropdownForm.svelte';
	import { generateTimeIntervals, getDaysOfWeek } from '$lib/utils/formatDate';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import {
	IconBulb,
		IconChartDots2,
		IconEdit,
		IconListCheck,
		IconNews,
		IconTarget,
		IconUsers,
		IconUsersGroup
	} from '@tabler/icons-svelte';
	import AgendaItem from './AgendaItem.svelte';

	export let form: any;
	export let errors;
</script>

<div class="w-[430px] h-[450px] space-y-2">
	{#each $form.agenda as item}
	<AgendaItem bind:item={item}  {form} {errors} />

	{/each}
	<!-- <AgendaItem title="KPI" icon={IconChartDots2} {form} {errors} />
	<AgendaItem title="Goals" icon={IconTarget} {form} {errors} />
	<AgendaItem title="Headlines" icon={IconNews} {form} {errors} />
	<AgendaItem title="To-Do" icon={IconListCheck} {form} {errors} />
	<AgendaItem title="IDS" icon={IconListCheck} {form} {errors} />
	<AgendaItem title="Conclude" icon={IconBulb} {form} {errors} /> -->
</div>
