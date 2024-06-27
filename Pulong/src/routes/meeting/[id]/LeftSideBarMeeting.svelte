<script lang="ts">
	import { AppRail, AppRailAnchor, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import {
		IconDots,
		IconPhoneOff,
		IconLoader2,
		IconDoorExit,
		IconUserBolt
	} from '@tabler/icons-svelte';
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import AgendaItem from '../components/AgendaItem.svelte';
	import { selectedAgenda } from '$lib/stores/meetingStore';
	import axios from 'axios';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import _ from 'lodash';

	export let data: PageData;
	let isScribeExist: boolean = false;
	$: teamMeeting = data.teamMeeting;
	$: userAttendanceInfo = data.userAttendanceInfo;
	$: {
		isScribeExist = _.find(teamMeeting.teamMeetingAttendance, { role: 'scribe' }) ? true : false;
	}
	onMount(() => {});
	$: team = teamMeeting.team;
	const order = ['Segue', 'KPI', 'Goals', 'Headlines', 'To-Do', 'IDS', 'Conclude'];
	$: agendaItems = team.agenda.sort(
		(a: { name: string }, b: { name: string }) => order.indexOf(a.name) - order.indexOf(b.name)
	);
	const popUp: PopupSettings = {
		event: 'click',
		target: 'popUp',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};
	// const slug = $page.params.id;
	let isEnding = false;
	const onEndMeeting = async () => {
		isEnding = true;
		let resp = await axios.put(`/api/meeting/end/${teamMeeting.id}`, {
			role: userAttendanceInfo.role
		});
		goto('/dashboard/teams');
	};

	const getIndexWithName = (targetName: string): number | null => {
		let result: number | null = null;
		team.agenda.forEach((item: { name: string }, index: number | null) => {
			if (item.name === targetName && result === null) {
				result = index;
			}
		});
		return result;
	};
	let isEndMeeting = false;
	$: {
		if ($selectedAgenda) {
			const index = getIndexWithName($selectedAgenda);
			if (index !== null && index + 1 === team.agenda.length) {
				isEndMeeting = true;
			} else {
				isEndMeeting = false;
			}
		}
	}
	const onNext = () => {
		const index = getIndexWithName($selectedAgenda);
		if (index !== null && index + 1 < team.agenda.length) {
			let agenda = team.agenda[index + 1];
			selectedAgenda.set(agenda.name);
		}
		// performNextAction(indices);
	};

	// Specify the start time (e.g., "2024-06-10T14:00:00")
	$: startDate = teamMeeting.startAt.getTime();
	let elapsedTime: {
		hours: string;
		minutes: string;
		seconds: string;
	} = {
		hours: '00',
		minutes: '00',
		seconds: '00'
	};

	let timer: number;

	const padTime = (time: number): string => {
		return time < 10 ? `0${time}` : `${time}`;
	};

	const calculateElapsedTime = (): void => {
		let now: number = new Date().getTime();
		let distance: number = now - startDate;

		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((distance % (1000 * 60)) / 1000);

		elapsedTime = {
			hours: padTime(hours),
			minutes: padTime(minutes),
			seconds: padTime(seconds)
		};
	};
	onMount(() => {
		calculateElapsedTime();
		timer = window.setInterval(calculateElapsedTime, 1000);

		return () => {
			clearInterval(timer);
		};
	});
	let scribeLoading = false;

	const onClaimScribe = async () => {
		scribeLoading = true;
		let teamId = teamMeeting.teamId;

		let resp = await axios.post(`/api/meeting`, {
			teamId: teamId,
			role: 'scribe'
		});

		resp.data;
		let result = resp.data;

		if (result.meeting) {
			let resp = await axios.put(`/api/meeting/join/${result.meeting.id}`, {
				teamId: teamId,
				role: 'scribe'
			});
		}
		scribeLoading = false;
		invalidateAll();
	};
</script>

<div class="card dark:bg-surface-50 bg-surface-50 shadow-xl z-50 py-2" data-popup="popUp">
	<button
		disabled={isEnding}
		on:click={onEndMeeting}
		class="flex items-center gap-2 py-1 px-2 hover:bg-surface-100 text-black"
	>
		{#if isEnding}
			<IconLoader2 class="animate-spin" size={20} />
		{:else if userAttendanceInfo.role === 'scribe'}
			<IconPhoneOff size={20} />
		{:else}
			<IconDoorExit size={20} />
		{/if}
		{#if userAttendanceInfo.role === 'scribe'}
			End Meeting
		{:else}
			Leave Meeting
		{/if}
	</button>
	{#if !isScribeExist}
		<button
			disabled={scribeLoading}
			on:click={onClaimScribe}
			class="flex items-center gap-2 py-1 px-2 hover:bg-surface-100 text-black w-full"
		>
			{#if scribeLoading}
				<IconLoader2 class="animate-spin" size={20} />
			{:else}
				<IconUserBolt size={20} />
			{/if}
			Claim Scribe
		</button>
	{/if}
	<!-- <div class="arrow bg-surface-100-800-token" /> -->
</div>

<div class="fixed inset-y-0 top-0 left-0 z-10 w-60 flex h-full bg-white">
	<div class="flex flex-col w-full text-black">
		<div class="px-4 h-[56px] flex items-center justify-between">
			{#if teamMeeting.isStarted}
				<div>{elapsedTime.hours}:{elapsedTime.minutes}:{elapsedTime.seconds}</div>
			{:else}
				<div>00:00:00</div>
			{/if}

			<!-- <p class="text-xs font-bold tracking-widest">01:16:15</p> -->
			<button use:popup={popUp} class="hover:bg-surface-200 p-1 rounded-full">
				<IconDots size={20} />
			</button>
		</div>
		<div class="flex-1 overflow-y-auto">
			<h1 class="!font-medium h3 px-4 truncate">{team.name}</h1>
			<div class="px-3 space-y-2">
				{#each agendaItems as item}
					<AgendaItem {item} />
				{/each}
			</div>
		</div>
		{#if !isEndMeeting}
			<button on:click={onNext} class="py-3 bg-black text-white text-xl font-bold">NEXT</button>
		{:else}
			<button
				disabled={isEnding}
				on:click={onEndMeeting}
				class="py-3 bg-red-500 text-white text-xl font-bold flex items-center justify-center gap-3"
			>
				{#if isEnding}
					<IconLoader2 class="animate-spin" size={20} />
				{:else if userAttendanceInfo.role === 'scribe'}
					<IconPhoneOff size={20} />
				{:else}
					<IconDoorExit size={20} />
				{/if}
				{#if userAttendanceInfo.role === 'scribe'}
					End Meeting
				{:else}
					Leave Meeting
				{/if}</button
			>
		{/if}
	</div>
</div>
