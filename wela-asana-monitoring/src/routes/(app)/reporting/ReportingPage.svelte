<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { isOpenModal} from '$lib/store/reportingStore';
	import { goto } from '$app/navigation';
	import { PUBLIC_URL } from '$env/static/public';
	import axios from 'axios';

	import _ from 'lodash';
	export let data: PageData;

	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
	let isCreating = false;
	const createReport = async () => {
		isCreating = true;
		const currentDate = new Date();

		let owner = _.find(data.allUsers, { gid: data.user_data.id.toString() });
		console.log(owner);
		if (owner) {
			owner.is_owner = true;

			// membersList = [owner, ...membersList];
		}
		let members = [owner];
		let members_ids = [owner.gid];
		const newDashboard = {
			owner: data.user_data.id,
			name: 'New Dashboard',
			created_at: currentDate.toISOString(),
			updated_at: currentDate.toISOString(),
			viewed_at: currentDate.toISOString(),
			members,
			members_ids
		};
		const response: any = await axios.post(PUBLIC_URL + '/reports', {
			...newDashboard
		});
		const result = response.data;
		if (result.success) {
			isCreating = false;
			// let data = result.data;
			isOpenModal.set(true);
			goto(`/dashboard-test/${result.data.id}`);
		}
	};
	let dashboards: any = [];
	let skeleton: any = [0, 0, 0, 0];
	let isLoading: any = false;
	onMount(async () => {
		isLoading = true;
		const response: any = await axios.get(PUBLIC_URL + '/reports', {
			params: { owner_id: data.user_data.id }
		});
		const result = response.data;
		if (result.success) {
			dashboards = result.data;
		}
		isLoading = false;
	});
	const getOwnerName = (owner_id: any) => {
		let owner = _.find(data.allUsers, { gid: owner_id.toString() });
		let name = '';
		if (owner) {
			name = owner.name;
		}
		return name;
	};
</script>

<div class=" w-full h-screen space-y-2">
	<div class=" border-b-2 py-2 w-full">
		<h1 class=" text-2xl font-semibold">Reporting</h1>
	</div>
	<div class="flex justify-between items-center">
		<button
			on:click={() => {
				createReport();
			}}
			class="bg-blue-400 hover:bg-blue-500 rounded-md px-2 py-1"
		>
			{#if isCreating}
				<h6 class="text-white font-medium">... Create</h6>
			{:else}
				<div class="flex items-center gap-1">
					<img src="/plus.svg" width="16" alt="" />
					<h6 class="text-white font-medium">Create report</h6>
				</div>
			{/if}
		</button>
		<div class="flex flex-col gap-5 justify-end items-end">
			<div class={` dropdown  dropdown-end`}>
				<!-- <div
					tabindex="0"
					role="button"
					class="text-sm text-white bg-violet-600 px-2 py-1 rounded flex gap-2"
				>
					{#if $syncProgress}
						<p>{$syncProgress}/{$syncNumbers}</p>
					{/if}
					<h3 class="text-sm text-white">{$syncName}</h3>
				</div> -->
				<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
				<!-- <div
					tabindex="0"
					class="m-0 p-0 dropdown-content z-[1] menu shadow w-56 border rounded bg-white"
				>
					<button
						disabled={!$syncProgress ? false : true}
						class="hover:bg-slate-100 py-2 px-4 flex"
						on:click={async () => {
							syncProgress.set(0);
							syncNumbers.set(data.allProject.length + data.allUsers.length);
							syncName.set('Sync all task');
							syncAllTask(data);
							handleClick();
						}}><p>Sync all Task</p></button
					>
					<button
						disabled={!$syncProgress ? false : true}
						class="hover:bg-slate-100 py-2 px-4 flex"
						on:click={async () => {
							handleClick();

							syncProgress.set(0);
							syncNumbers.set(data.allProject.length);
							syncName.set('Sync task by Project');
							await syncProjectReport(data.allProject, data);
							syncProgress.set(undefined);
							syncName.set('Sync tasks');
						}}><p>Sync task by Project</p></button
					>
					<button
						disabled={!$syncProgress ? false : true}
						class="hover:bg-slate-100 py-2 px-4 flex"
						on:click={async () => {
							handleClick();
							syncProgress.set(0);
							syncNumbers.set(data.allUsers.length);
							syncName.set('Sync task by Assignees');
							await syncTaskByAssignees(data.allUsers, data);
							// deleteChart();
							syncProgress.set(undefined);
							syncName.set('Sync tasks');
							handleClick();
						}}><p>Sync task by Assignees</p></button
					>
				</div> -->
			</div>
		</div>
	</div>
	<div class=" px-12 py-5">
		<div class="grid grid-cols-2 gap-4">
			{#if isLoading}
				{#each skeleton as dashboards}
					<div class="h-[160px] border rounded-lg bg-slate-300 animate-pulse"></div>
				{/each}
			{:else}
				{#each dashboards as dashboard}
					<button
						on:click={() => [goto('dashboard-test/' + dashboard.id)]}
						class="h-[160px] border rounded-lg hover:border-2"
					>
						<div class="px-6 py-7 flex items-center gap-2">
							<div class="rounded-md p-4 bg-blue-100">
								<img src="/analytics.svg" width="30" alt="" />
							</div>
							<h3 class="text-xl">{dashboard.name}</h3>
						</div>
						<div class="border-b"></div>

						<p class="text-left px-6 py-2 text-sm text-gray-600">
							Owned by {dashboard.owner === data.user_data.id
								? 'you'
								: getOwnerName(dashboard.owner)}
						</p>
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>
