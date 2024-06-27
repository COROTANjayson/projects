<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { dashboard_details, isDeleteDashboardOpen } from '$lib/store/reportingStore';
	import axios from 'axios';
	import { PUBLIC_URL } from '$env/static/public';
	import { goto } from '$app/navigation';

	export let data: PageData;
	const handleClickOutside = (event: any) => {
		const modal: any = document.getElementById('delete-dashboard');
		const outside = document.getElementById('close-outside');

		if (
			$isDeleteDashboardOpen &&
			!modal.contains(event.target) &&
			outside &&
			outside.contains(event.target)
		) {
			isDeleteDashboardOpen.set(false);
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

	let isDeleting = false;
	const deleteDashboard = async () => {
		isDeleting = true;
		const response: any = await axios.delete(PUBLIC_URL + `/reports/${$dashboard_details.id}`, {
			...$dashboard_details
		});
        
		let result = response.data;
		if (result && result.success) {
			// await fetchCharts();
            isDeleting = false;
		isDeleteDashboardOpen.set(false);
			goto('/reporting');
		}

	};
</script>

<div
	id="close-outside"
	class="fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center sm:bg-black sm:bg-opacity-50 sm:backdrop-blur-sm"
>
	<div
		id="delete-dashboard"
		class="rounded-md overflow-y-auto relative h-[200px] w-[50%] bg-white sm:shadow-md"
	>
		<div class="flex justify-between items-center px-6 py-4">
			<h1 class="text-xl font-semibold">Dashboard details</h1>
			<button
				on:click={() => {
					isDeleteDashboardOpen.set(false);
				}}
				class=" right-0 mx-3 my-2"
			>
				<img src="/x.svg" alt="" />
			</button>
		</div>
        <div class="px-6 py-4">
            <p>Are you sure you want to delete <span class="font-medium">
                {$dashboard_details.name}
            </span></p>
        </div>

		<div class="flex justify-end items-center px-6 py-4 gap-3">
			<button
				on:click={() => {
					isDeleteDashboardOpen.set(false);
				}}
				class="text-sm right-0 px-3 py-2 border border-slate-700 rounded-md hover:bg-slate-100"
			>
				Cancel
			</button>
			<button
				disabled={isDeleting}
				on:click={deleteDashboard}
				class="text-sm text-white right-0 px-3 py-2 border bg-red-500 hover:bg-red-600 rounded-md"
			>
				{isDeleting ? '...Deleting' : 'Delete'}
			</button>
		</div>
	</div>
</div>
