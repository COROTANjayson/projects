<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { IconDots, IconUserBolt, IconUsersGroup } from '@tabler/icons-svelte';
	import { goto } from '$app/navigation';
	import { isCanJoinMeeting, teamIdStore } from '$lib/stores/meetingStore';
	import axios from 'axios';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;
	const modalStore = getModalStore();
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
	let selectedRole = 'follower';

	let isJoining = false;
	const onJoin = async () => {
		isJoining = true;

		let resp = await axios.post(`/api/meeting`, {
			teamId: $teamIdStore,
			role: selectedRole
		});

		resp.data;
		let result = resp.data;

		if (result.meeting) {
			let resp = await axios.put(`/api/meeting/join/${result.meeting.id}`, {
				role: selectedRole,
				teamId: $teamIdStore
			});
		}
		if (resp.data && resp.data.success) {
			isJoining = true;
			modalStore.close();
			goto(`/meeting/${$teamIdStore}`);
		}
	};
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class=" card flex flex-col items-center justify-center gap-3 w-[310px] py-7 px-6">
		<div class="flex flex-col items-center justify-center">
			<p class="uppercase text-xl">Pick your role</p>
			<p class="text-gray-500 text-center">
				Please select how you'd like to join the meeting from the options below
			</p>
		</div>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class=" space-y-4 flex flex-col w-full">
			<div
				on:click={() => {
					selectedRole = 'scribe';
				}}
				class={`cursor-pointer btn w-full text-xl justify-start border-transparent border rounded focus:border-none
                ${selectedRole === 'scribe' ? 'variant-ghost-warning  ' : 'hover:border-black dark:hover:border-white'}`}
			>
				<IconUserBolt size={20} />Scribe
			</div>

			<div
				on:click={() => {
					selectedRole = 'follower';
				}}
				class={`cursor-pointer btn w-full text-xl justify-start border-transparent border rounded !focus:outline-none
             ${selectedRole === 'follower' ? 'variant-ghost-warning  ' : 'hover:border-black dark:hover:border-white'}`}
			>
				<IconUsersGroup size={20} /> Follower
			</div>
			{#if $isCanJoinMeeting}
				<div
					on:click={() => {
						if (!isJoining) {
							onJoin();
						}
					}}
					class={`cursor-pointer btn w-full h-[44px] text-lg font-semibold  border-transparent bg-black rounded text-white`}
				>
					{#if isJoining}
						<div class="animate-bounce">
							<IconDots size={30} />
						</div>
					{:else}
						JOIN
					{/if}
				</div>
			{:else}
				<div class="text-center text-red-400">You already joined from other team meeting</div>
			{/if}
		</div>
	</div>
{/if}
