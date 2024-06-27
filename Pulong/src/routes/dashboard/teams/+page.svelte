<script lang="ts">
	import { IconDotsVertical, IconEdit, IconPlus } from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import NoRecord from './NoRecord.svelte';
	import { goto } from '$app/navigation';
	import { Avatar, Modal, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import { convertTo12Hour } from '$lib/utils/formatDate';
	import JoinMeetingModal from './components/JoinMeetingModal.svelte';
	import { getModalStore, popup } from '@skeletonlabs/skeleton';
	import { isCanJoinMeeting, selectedAgenda, teamIdStore } from '$lib/stores/meetingStore';
	import _ from 'lodash';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();
	export let data: PageData;
	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		joinMeetingModal: { ref: JoinMeetingModal }
		// ...
	};
	const modal: ModalSettings = {
		type: 'component',
		component: 'joinMeetingModal'
	};
	const getCurrentTeamMeeting = (team: any) => {
		const isMeetingExist = _.find(team.teamMeeting, { isCurrent: true });
		return isMeetingExist;
	};
	const onOpenModal = (team: any) => {
		teamIdStore.set(team.id);
		modalStore.trigger(modal);
		let currentMeeting = getCurrentTeamMeeting(team);
		if (team.teamMeeting && !currentMeeting) {
			let agenda = _.find(team.agenda, { name: 'Segue' });
			selectedAgenda.set(agenda.name);
		}
		let isInMeeting;
		if (currentMeeting) {
			isInMeeting = _.find(data.teamMeeting, { id: currentMeeting.id });
		}
		let isUserJoinedMeeting = _.find(data.userAttendances, { isJoined: true });

		if (!isInMeeting && isUserJoinedMeeting) {
			isCanJoinMeeting.set(false);
		} else if (
			isUserJoinedMeeting &&
			isInMeeting &&
			isUserJoinedMeeting.meetingId !== isInMeeting.id
		) {
			isCanJoinMeeting.set(false);
		} else {
			isCanJoinMeeting.set(true);
		}
	};

	// const onOpenModal = (team: any) => {
	// 	teamIdStore.set(team.id);
	// 	modalStore.trigger(modal);
	// 	let currentMeeting = getCurrentTeamMeeting(team);
	// 	if (team.teamMeeting && !currentMeeting) {
	// 		selectedAgenda.set(team.agenda[0].name);
	// 	}
	// 	// if (team.teamMeeting && !team.teamMeeting.isStarted) {
	// 	// 	selectedAgenda.set(team.agenda[0].name);
	// 	// }

	// 	// let isInMeeting = _.find(data.teamMeeting, { id: team.teamMeeting.id });
	// 	let isInMeeting;
	// 	if (currentMeeting) {
	// 		isInMeeting = _.find(data.teamMeeting, { id: currentMeeting.id });
	// 	}

	// 	let isUserJoinedMeeting = _.find(data.userAttendances, { isJoined: true });

	// 	if (isUserJoinedMeeting && isInMeeting && isUserJoinedMeeting.meetingId !== isInMeeting.id) {
	// 		isCanJoinMeeting.set(false);
	// 	} else {
	// 		isCanJoinMeeting.set(true);
	// 	}
	// };
	const popupClick: any = {
		event: 'click',
		target: 'popupClick',
		placement: 'left',
		middleware: {
			offset: 0,
			shift: {
				crossAxis: true
			}
		}
	};
</script>

<Modal components={modalRegistry} />
<div class="w-full relative">
	<div
		class="px-5 flex justify-end items-center sticky top-0 right-0 w-full h-[60px] dark:bg-surface-900 bg-surface-200 shadow-md z-20"
	>
		<button
			on:click={() => {
				// onNewForm('Issue');
				goto('/dashboard/teams/add');
			}}
			type="button"
			class={`btn  variant-filled-primary flex justify-between  rounded-md h-[44px]  dark:text-white font-semibold`}
		>
			<span class="text-xl">ADD</span>
			<span><IconPlus size={25} /></span>
		</button>
	</div>

	<div class="px-5 py-4">
		{#if data.teams.length > 0}
			<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
				{#each data.teams as team}
					<div class="card p-4 block">
						<div class="flex justify-between">
							<div class=" w-[80%]">
								<!-- <Avatar width="w-10" initials={team.owner.name || ''} background="bg-primary-500" /> -->
								<h1 class="text-2xl font-semibold truncate text-ellipsis">{team.name}</h1>
								<p class="text-surface-600 dark:text-surface-300">
									{team.weekly_start_day} at {convertTo12Hour(team.start_time)}
								</p>
							</div>
							<button
								use:popup={{
									...popupClick,
									target: `popupClick-${team.id}`
								}}
								class="hover:bg-surface-50 dark:hover:bg-surface-400 rounded-full w-[30px] h-[30px] flex items-center justify-center"
							>
								<IconDotsVertical size={20} />
							</button>
							<div
								class="card bg-white dark:bg-surface-900 shadow-sm py-4 w-[150px] z-10"
								data-popup={`popupClick-${team.id}`}
							>
								<div class="flex flex-col dark:text-white">
									<button
										on:click={() => {
											goto(`/dashboard/teams/edit/${team.id}`);
										}}
										id="will-close"
										class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left"
									>
										<div class="flex gap-3">
											<IconEdit size={20} />
											<p>Edit</p>
										</div>
									</button>
									<!-- <form
									class="w-full"
									method="POST"
									action={endpoint
										? `/dashboard/${endpoint}?/delete&id=${item.id}`
										: `?/delete&id=${item.id}`}
									use:enhance
								>
									<button
										id="will-close"
										class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left w-full"
									>
										<div class="flex gap-3">
											<IconTrash size={20} />
											<p>Delete</p>
										</div>
									</button>
								</form> -->
								</div>
							</div>
						</div>

						<div class="flex gap-4 w-full justify-end mt-6">
							<button
								on:click={() => {
									goto(`/dashboard/teams/details/${team.id}`);
								}}
								class="btn variant-soft-surface rounded-lg"
							>
								Details
							</button>
							<button
								on:click={() => {
									onOpenModal(team);
								}}
								class="btn variant-filled-primary rounded-lg"
							>
								<!-- {#if team.teamMeeting && team.teamMeeting.isStarted}
									Join
								{:else}
								Start meeting
								{/if} -->
								{#if getCurrentTeamMeeting(team)}
									Join
								{:else}
									Start meeting
								{/if}
							</button>
						</div>

						<!-- <a href="/dashboard/teams/edit/{team.id}">{team.name}</a>
			<p>Owner: {team.owner.name}</p> -->
					</div>
				{/each}
			</div>
		{:else}
			<NoRecord />
		{/if}
	</div>
</div>
