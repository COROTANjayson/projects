<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { dashboard_details, isDashboardDetailsOpen } from '$lib/store/reportingStore';
	import axios from 'axios';
	import { PUBLIC_URL } from '$env/static/public';

	export let data: PageData;
	let details: { name: any; description?: any } = {
		name: '',
		description: ''
	};
	onMount(() => {
		details = {
			name: $dashboard_details.name,
			description: $dashboard_details.description ? $dashboard_details.description : ''
		};
	});
	const handleClickOutside = (event: any) => {
		const modal: any = document.getElementById('edit-dashboard-details');
		const outside = document.getElementById('outside');

		if (
			$isDashboardDetailsOpen &&
			!modal.contains(event.target) &&
			outside &&
			outside.contains(event.target)
		) {
			isDashboardDetailsOpen.set(false);
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		// Listen for clicks outside the dropdown to close it
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	let isSaving = false;
	const saveChange = async () => {
		isSaving = true;
		const currentDate = new Date();
		dashboard_details.set({
			...$dashboard_details,
			...details,
			updated_at: currentDate.toISOString()
		});

		const response: any = await axios.put(PUBLIC_URL + `/reports/${$dashboard_details.id}`, {
			...$dashboard_details
		});
		isSaving = false;
		isDashboardDetailsOpen.set(false);
	};
</script>

<div
	id="outside"
	class="fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center sm:bg-black sm:bg-opacity-50 sm:backdrop-blur-sm"
>
	<div
		id="edit-dashboard-details"
		class="rounded-md overflow-y-auto relative h-[65%] w-[50%] bg-white sm:shadow-md"
	>
		<div class="flex justify-between items-center px-6 py-4">
			<h1 class="text-xl font-semibold">Dashboard details</h1>
			<button
				on:click={() => {
					isDashboardDetailsOpen.set(false);
				}}
				class=" right-0 mx-3 my-2"
			>
				<img src="/x.svg" alt="" />
			</button>
		</div>
		<div class="w-full border-b-2" />
		<div class="px-6 py-6">
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="username"> Name </label>
				<input
					bind:value={details.name}
					class="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
					type="text"
					placeholder="New Dashboard"
				/>
			</div>
			<div class="mb-4">
				<label class="block text-gray-700 text-sm font-bold mb-2" for="username">
					Description
				</label>
				<textarea
					bind:value={details.description}
					class="shadow appearance-none border h-[100px] rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</div>
		</div>
		<div class="w-full border-b-2" />

		<div class="flex justify-end items-center px-6 py-4 gap-3">
			<button
				on:click={() => {
					isDashboardDetailsOpen.set(false);
				}}
				class="text-sm right-0 px-3 py-2 border border-slate-700 rounded-md"
			>
				Cancel
			</button>
			<button
				disabled={isSaving}
				on:click={saveChange}
				class="text-sm text-white right-0 px-3 py-2 border bg-blue-500 rounded-md"
			>
				{isSaving ? '...Saving' : 'Save Changes'}
			</button>
		</div>
	</div>
</div>
