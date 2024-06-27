<script lang="ts">
	import { AppRail, AppRailAnchor, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import {
		IconDots,
		IconPhoneOff,
		IconLoader2,
		IconDoorExit,
		IconUserBolt,
		IconChartDots2,
		IconChevronLeft,
		IconTarget,
		IconNews,
		IconListCheck,
		IconExclamationCircle
	} from '@tabler/icons-svelte';
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import AgendaItem from './AgendaItem.svelte';
	import { selectedAgenda } from '$lib/stores/meetingStore';
	import axios from 'axios';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import { sideBarItem } from '$lib/stores/sideBar';
	import { convertTo12Hour } from '$lib/utils/formatDate';

	export let data: PageData;
</script>

<div class="fixed inset-y-0 top-0 left-0 z-20 w-60 flex h-full bg-white">
	<div class="flex flex-col w-full text-black">
		<div class="px-4 h-[56px] flex items-center justify-between">
			<!-- <p class="text-xs font-bold tracking-widest">01:16:15</p> -->
			<button
				on:click={() => {
					goto('/dashboard/teams');
				}}
				class="flex items-center"
			>
				<IconChevronLeft size={20} />
				BACK
			</button>
		</div>
		<div class="flex-1 overflow-y-auto space-y-5">
			<div>
				<h1 class="!font-medium h3 px-4 truncate">{data.team.name}</h1>
				<p class="text-surface-600 dark:text-surface-300  px-4">
					{data.team.weekly_start_day}s at {convertTo12Hour(data.team.start_time)}
				</p>
			</div>
		
			<div class="px-3 space-y-2">
				<button
					on:click={() => {
						sideBarItem.set('All Items');
					}}
					class={`flex gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
				${'All Items' === $sideBarItem ? 'bg-green-100' : ''}
				`}
				>
					<p class="font-medium">All Items</p>
				</button>
				<button
					on:click={() => {
						sideBarItem.set('KPI');
					}}
					class={`flex gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
					${'KPI' === $sideBarItem ? 'bg-green-100' : ''}
					`}
				>
					<IconChartDots2 size={20} />

					<p>KPI</p>
				</button>
				<button
					on:click={() => {
						sideBarItem.set('Goals');
					}}
					class={`flex items-center gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
						${'Goals' === $sideBarItem ? 'bg-green-100' : ''}
						`}
				>
					<IconTarget size={20} />

					<p>Goals</p>
				</button>
				<button
					on:click={() => {
						sideBarItem.set('Headlines');
					}}
					class={`flex items-center gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
					${'Headlines' === $sideBarItem ? 'bg-green-100' : ''}
					`}
				>
					<IconNews size={20} />
					<p>Headlines <span class="text-gray-400"></span></p>
				</button>
				<button
					on:click={() => {
						sideBarItem.set('To-Do');
					}}
					class={`flex items-center gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
					${'To-Do' === $sideBarItem ? 'bg-green-100' : ''}
					`}
				>
					<IconListCheck size={20} />
					<p>To-Do</p>
				</button>
				<button
					on:click={() => {
						sideBarItem.set('IDS');
					}}
					class={`flex items-center gap-3 mt-3 px-3 py-2 w-full hover:bg-blue-100
					${'IDS' === $sideBarItem ? 'bg-green-100' : ''}
					`}
				>
					<IconExclamationCircle size={20} />
					<p>IDS</p>
				</button>
			</div>
		</div>
	</div>
</div>
