<script lang="ts">
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import {
		syncName,
		syncNumbers,
		syncProgress,
		syncProjectReport,
		syncTaskByAssigneesInBackground
	} from '$lib/store/syncStore';

	let currentPath = '';
	export let data: LayoutData;
	onMount(() => {
		currentPath = window.location.pathname;
	});

	let precentage = 0;
	onMount(async () => {
		//
		// syncProgress.set(0);
		// syncNumbers.set(data.allProject.length + data.allUsers.length);
		// syncName.set('Sync all task');
		// syncTaskByAssigneesInBackground(data.allUsers, data);
		// syncProgress.set(0);
		// syncNumbers.set(data.allProject.length);
		// syncName.set('Sync task by Project');
		// await syncProjectReport(data.allProject, data);
		// syncProgress.set(undefined);
		// syncName.set('Sync tasks');
	});

	const syncTask = async () => {
		syncProgress.set(0);
		syncNumbers.set(data.allProject.length + data.allUsers.length);
		syncName.set('Sync all task');
		// syncAllTask(data);
		// syncTaskByAssigneesInBackground(data.allUsers, data);
		syncProgress.set(0);
		syncNumbers.set(data.allProject.length);
		syncName.set('Sync task by Project');
		await syncProjectReport(data.allProject, data);
		syncProgress.set(undefined);
		syncName.set('Sync tasks');
	};
	let user_data: any = {};
	onMount(async () => {
		//
		if (data.user_data) {
			user_data = _.find(data.allUsers, { gid: data.user_data.gid });
		}
	});
	const initials = (name: string) => {
		// Remove leading and trailing whitespaces and split the string into words
		if (name) {
			const words = name.trim().split(' ');

			// Retrieve the first letter of the first word
			const firstLetterFirstWord = words[0][0];

			// Retrieve the first letter of the last word
			const lastWordIndex = words.length - 1;
			const firstLetterLastWord = words[lastWordIndex][0];

			return firstLetterFirstWord + firstLetterLastWord;
		} else {
			return '';
		}
	};

	$: {
		precentage = ($syncProgress / $syncNumbers) * 100;
	}
</script>

<div
	class="h-16 w-full flex items-center justify-between border-b-2 sticky top-0 z-30 px-6 bg-white"
>
	<h3 class=" text-xl text-[#4573D2] font-medium flex items-center">Wela Asana Reports</h3>
	<div class=" flex justify-center gap-5">
		{#if $syncProgress && $syncProgress <= 100}
			<div class="flex flex-col justify-end">
				<div class=" w-44 bg-gray-200 rounded-full h-1.5">
					<div class=" h-1.5 rounded-full bg-blue-500" style={`width: ${precentage}%`}></div>
				</div>
				<p class="text-xs text-gray-500">Syncing asana task...</p>
			</div>
		{:else}
			<div class="group relative flex items-center">
				<button class="" on:click={syncTask}>
					<img src="/sync.svg" width="20" height="20" alt="" />
				</button>
				<span
					class="hidden text-sm group-hover:block absolute bg-gray-400 text-white text-center py-1 px-2 rounded-lg w-[120px] top-[100%] left-[50%] ml-[-60px]"
				>
					Sync Asana task
				</span>
			</div>
			<!-- <div class="relative group flex items-center">
				<button class="">
					<img src="/sync.svg" width="20" height="20" alt="" />
				</button>
				<div
					class="absolute  mt-2 left-full top-0 bg-gray-800 text-white w-[200px] text-xs rounded py-1 px-2 hidden group-hover:block"
				>
					Sync asana task
				</div>
			</div> -->
		{/if}
		<div class="dropdown dropdown-end">
			<div
				tabindex="0"
				role="button"
				class=" btn btn-sm border-none flex justify-center items-center"
			>
				{#if user_data.photo && user_data.photo.image_36x36 !== null}
					<img
						src={user_data.photo.image_36x36}
						width="32"
						height="32"
						alt=""
						class="rounded-full w-full"
					/>
				{:else}
					<div
						class=" flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#4573D2] hover:bg-blue-900"
					>
						<p class="text-white text-sm font-medium">{initials(user_data.name)}</p>
					</div>
				{/if}
			</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div tabindex="0" class=" shadow menu dropdown-content z-[1] rounded-md w-40 bg-white">
				<div class="w-full">
					<form method="POST" action="/?/logout" class=" w-full">
						<button class=" w-full flex px-2 py-2 hover:bg-gray-50">Logout</button>
					</form>
				</div>
			</div>
		</div>
	</div>

	<!-- <progress class="progress progress-info w-56" value="10" max="100"></progress> -->
</div>
