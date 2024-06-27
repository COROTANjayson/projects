<script lang="ts">
	import {
		getModalStore,
		getToastStore,
		Modal,
		Toast,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import TeamForm from '../../components/TeamForm.svelte';
	import KpiPage from '../components/KPIPage.svelte';
	import GoalPage from '../components/GoalPage.svelte';
	import HeadlinePage from '../components/HeadlinePage.svelte';
	import TodoPage from '../components/TodoPage.svelte';
	import IssuePage from '../components/IssuePage.svelte';
	import AllItems from '../components/AllItems.svelte';

	import type { PageData } from './$types';
	import { pageForm } from '$lib/stores/team';
	import AgendaForm from '../../components/AgendaForm.svelte';
	import AddMembersForm from '../../components/AddMembersForm.svelte';
	import { onMount } from 'svelte';
	import {
		sideBarMenu,
		sideBarStore,
		sideBarItem,
		isDeleteModalOpen,
		endpointStore
	} from '$lib/stores/sideBar';
	import LeftSideBarTeam from '../LeftSideBarTeam.svelte';
	import DeleteModal from '$lib/components/DeleteModal.svelte';
	import JoinMeetingModal from '../../components/JoinMeetingModal.svelte';
	import { isCanJoinMeeting, selectedAgenda, teamIdStore } from '$lib/stores/meetingStore';
	import _ from 'lodash';
	const modalStore = getModalStore();

	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		joinMeetingModal: { ref: JoinMeetingModal }
		// ...
	};
	const modal: ModalSettings = {
		type: 'component',
		component: 'joinMeetingModal'
	};
	// import { zod } from 'sveltekit-superforms/adapters';
	// import { teamSchema } from '$lib/schema/team';
	// import { goto } from '$app/navigation';

	export let data: PageData;
	onMount(() => {
		sideBarItem.set('All Items');
		sideBarMenu.set(false);
		sideBarStore.set(false);
		return () => {
			sideBarMenu.set(true);
			sideBarStore.set(true);
			endpointStore.set('');
		};
	});
	const getCurrentTeamMeeting = (team: any) => {
		const isMeetingExist = _.find(team.teamMeeting, { isCurrent: true });
		return isMeetingExist;
	};
	let team = data.team;
	const onOpenModal = () => {
		if (team) {
			teamIdStore.set(team.id);
			modalStore.trigger(modal);
			let currentMeeting = getCurrentTeamMeeting(team);
			if (team.teamMeeting && !currentMeeting) {
				selectedAgenda.set(team.agenda[0].name);
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
		}
	};
</script>

<!-- <SuperDebug data={$form} /> -->
<Modal components={modalRegistry} />

{#if $isDeleteModalOpen}
	<DeleteModal />
{/if}
<div class="relative">
	<LeftSideBarTeam {data} />
	<!-- <div class=" "><div class="w-60"></div></div> -->
	<div
		class="pl-60 px-5 sticky top-0 right-0 w-full h-[60px] dark:bg-surface-900 bg-surface-200 shadow-md z-10 flex justify-between items-center"
	>
		<div class="flex justify-end w-full">
			<button
				on:click={() => {
					onOpenModal();
				}}
				class="btn variant-filled-primary rounded-lg"
			>
				{#if getCurrentTeamMeeting(team)}
					Join
				{:else}
					Start meeting
				{/if}
			</button>
		</div>
	</div>
	<div class=" pl-60 relative w-full py-3">
		{#if $sideBarItem === 'All Items'}
			<AllItems {data} />
		{:else if $sideBarItem === 'KPI'}
			<KpiPage {data} />
		{:else if $sideBarItem === 'Goals'}
			<GoalPage {data} />
		{:else if $sideBarItem === 'Headlines'}
			<HeadlinePage {data} />
		{:else if $sideBarItem === 'To-Do'}
			<TodoPage {data} />
		{:else if $sideBarItem === 'IDS'}
			<IssuePage {data} />
		{/if}
	</div>
</div>
