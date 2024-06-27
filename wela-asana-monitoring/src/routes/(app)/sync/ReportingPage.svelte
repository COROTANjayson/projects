<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from '../sync/$types';
	import { isOpenModal, taskListsSync } from '$lib/store/reportingStore';
	import { goto } from '$app/navigation';
	import { PUBLIC_URL } from '$env/static/public';
	import axios from 'axios';
	import { getTaskByUser, getTasks, getTasksRecursive } from '$lib/api/task';
	import { taskLists } from '$lib/store/taskStore';
	// import { syncProgress } from '$lib/store/syncStore';
	export let data: PageData;

	const createReport = async () => {
		const currentDate = new Date();
		const newDashboard = {
			owner: data.user_data.id,
			name: 'New Dashboard',
			created_at: currentDate.toISOString()
		};
		const response: any = await axios.post(PUBLIC_URL + '/reports', {
			...newDashboard
		});
		const result = response.data;
		if (result.success) {
			// let data = result.data;
			isOpenModal.set(true);
			goto(`/dashboard/${result.data.id}`);
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
	let syncAssignees: number | undefined;
	let syncProjects: number | undefined;

	// const syncProjectReport = async () => {
	// 	let allProject = data.allProject;
	// 	syncProjects = 0;
	// 	for (const element of allProject) {
	// 		syncProjects += 1;
	// 		taskListsSync.set([]);
	// 		let filter = { project: element.gid };
	// 		const tasks = await getTasks(filter, data.access_token);

	// 		if (tasks) {
	// 			taskListsSync.set(tasks);
	// 		}

	// 		let taskL_list = $taskListsSync.map((task: any) => {
	// 			let project_ids: any[] = [];
	// 			if (task.projects.length) {
	// 				task.projects.forEach((element: any) => {
	// 					project_ids.push(element.gid);
	// 				});
	// 			}
	// 			task.project_ids = project_ids;
	// 			return task;
	// 		});
	// 		console.log(element.name, ':', taskL_list);
	// 		if (taskL_list) {
	// 			for (const taskElement of taskL_list) {
	// 				let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
	// 					...taskElement
	// 				});
	// 				console.log(resp.data);
	// 			}
	// 		}
	// 		// console.log(resp.data);
	// 	}
	// 	syncProjects = undefined;
	// };

	const syncProjectReport = async () => {
		// const res = await getTaskByUser(data.user_data, data.access_token);
		let resp = await axios.get(PUBLIC_URL + `/projects`);

		let allProject = resp.data.data;
		syncProjects = 0;
		for (const element of allProject) {
			syncProjects += 1;
			taskListsSync.set([]);
			console.log(element.name, '=', element.isFetch);
			if (!element.isFetch) {
				let filter = { project: element.gid };
				const tasks = await getTasks(filter, data.access_token);

				if (tasks) {
					taskListsSync.set(tasks);
				} else {
					taskListsSync.set([]);
					await getTasksRecursive(filter, data.access_token);
				}

				let taskL_list = $taskListsSync.map((task: any) => {
					let project_ids: any[] = [];
					if (task.projects.length) {
						task.projects.forEach((element: any) => {
							project_ids.push(element.gid);
						});
					}
					task.project_ids = project_ids;

					let custom_fields: any[] = [];
					if (task.custom_fields && task.custom_fields.length) {
						task.custom_fields.forEach((element: any) => {
							let data = {
								gid: element.gid,
								name: element.name,
								value: element.enum_value ? element.enum_value.name : '',
								color: element.enum_value ? element.enum_value.color : ''
							};
							custom_fields.push(data);
						});
					}
					task.custom_fields = custom_fields;

					return task;
				});

				console.log(element.name, ':', taskL_list);

				if (taskL_list) {
					for (const taskElement of taskL_list) {
						let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
							...taskElement
						});
						console.log(resp.data);
					}
				}

				let resp = await axios.put(PUBLIC_URL + `/projects/${element.gid}`, {
					...element,
					isFetch: true
				});
			}

			console.log(resp.data);
		}
		syncProjects = undefined;
	};
	const syncAssigneesReport = async () => {
		// const res = await getTaskByUser(data.user_data, data.access_token);

		let resp = await axios.get(PUBLIC_URL + `/users`);

		let users = resp.data.data;
		syncAssignees = 0;
		for (const element of users) {
			syncAssignees += 1;
			taskListsSync.set([]);
			console.log(element.name, '=', element.isFetch);
			if (!element.isFetch) {
				let filter = { assignee: element.gid, workspace: data.user_data.workspace_id };
				const tasks = await getTasks(filter, data.access_token);

				if (tasks) {
					taskListsSync.set(tasks);
				} else {
					taskListsSync.set([]);
					await getTasksRecursive(filter, data.access_token);
				}
				console.log(element.name, ':', $taskListsSync.length);
				let taskL_list = $taskListsSync.map((task: any) => {
					let project_ids: any[] = [];
					if (task.projects.length) {
						task.projects.forEach((element: any) => {
							project_ids.push(element.gid);
						});
					}
					task.project_ids = project_ids;

					let custom_fields: any[] = [];
					if (task.custom_fields && task.custom_fields.length) {
						task.custom_fields.forEach((element: any) => {
							let data = {
								gid: element.gid,
								name: element.name,
								value: element.enum_value ? element.enum_value.name : '',
								color: element.enum_value ? element.enum_value.color : ''
							};
							custom_fields.push(data);
						});
					}
					task.custom_fields = custom_fields;
					return task;
				});
				console.log(taskL_list);
				if (taskL_list) {
					for (const taskElement of taskL_list) {
						let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
							...taskElement
						});
						console.log(resp.data);
					}
				}
			}
			let resp = await axios.put(PUBLIC_URL + `/users/${element.gid}`, {
				...element,
				isFetch: true
			});
		}

		syncAssignees = undefined;
	};

	const syncAllProjects = async () => {
		// const res = await getTaskByUser(data.user_data, data.access_token);
		console.log(data.allProject)
		for (const element of data.allProject) {
			let resp = await axios.put(PUBLIC_URL + `/projects/${element.gid}`, {
				...element
			});
			console.log(resp.data);
		}
	};

	const syncAllUsers = async () => {
		// const res = await getTaskByUser(data.user_data, data.access_token);
		console.log(data.allUsers)
		for (const element of data.allUsers) {
			let resp = await axios.put(PUBLIC_URL + `/users/${element.gid}`, {
				...element
			});
			console.log(resp.data);
		}
	};

	// const syncTask = async () => {
	// 	// const res = await getTaskByUser(data.user_data, data.access_token);

	// 	for (const element of data.allUsers) {
	// 		taskListsSync.set([]);

	// 		let filter = {
	// 			assignees: element.gid,
	// 			workspace: data.user_data.workspace_id,
	// 			limit: 100
	// 		};
	// 		const tasks = await getTasks(filter, data.access_token);

	// 		if (tasks) {
	// 			taskListsSync.set(tasks);
	// 		} else {
	// 			taskListsSync.set([]);
	// 			await getTasksRecursive(filter, data.access_token);
	// 		}
	// 		console.log(element.name, ':', $taskListsSync.length);
	// 		// if ($taskListsSync) {
	// 		// 	for (const taskElement of res) {
	// 		// 		let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
	// 		// 			...taskElement
	// 		// 		});
	// 		// 		console.log(resp.data);
	// 		// 	}
	// 		// }
	// 	}
	// };
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
			class="bg-blue-400 rounded-md px-2 py-1"
		>
			<h6 class="text-white font-medium">+ Create</h6>
		</button>
		<div class="flex flex-col gap-5 justify-end items-end">
			<div class="flex items-center gap-2">
				{#if syncAssignees}
					<p>{syncAssignees}/{data.allUsers.length}</p>
				{/if}
				<button
					on:click={() => {
						syncAssigneesReport();
					}}
					class="bg-violet-500 rounded-md px-2 py-1"
				>
					<h6 class="text-white text-sm h-[30px] flex items-center">Sync task by Assignees</h6>
				</button>
			</div>
			<div class="flex items-center gap-2">
				{#if syncProjects}
					<p>{syncProjects}/{data.allProject.length}</p>
				{/if}
				<button
					on:click={() => {
						syncProjectReport();
					}}
					class="bg-violet-500 rounded-md px-2 py-1"
				>
					<h6 class="text-white text-sm h-[30px] flex items-center">Sync task by Project</h6>
				</button>
			</div>
			<button
				on:click={() => {
					syncAllProjects();
				}}
				class="bg-violet-500 rounded-md px-2 py-1"
			>
				<h6 class="text-white text-sm h-[30px] flex items-center">Sync all projects</h6>
			</button>
			<button
				on:click={() => {
					syncAllUsers();
				}}
				class="bg-violet-500 rounded-md px-2 py-1"
			>
				<h6 class="text-white text-sm h-[30px] flex items-center">Sync all assignees</h6>
			</button>
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
						class="h-[160px] border rounded-lg"
					>
						<div class="px-6 py-7 flex items-center gap-2">
							<div class="rounded-md p-4 bg-blue-100">
								<img src="/analytics.svg" width="30" alt="" />
							</div>
							<h3 class="text-xl">{dashboard.name}</h3>
						</div>
						<div class="border-b"></div>

						<p class="text-left px-6 py-2 text-sm text-gray-600">
							Owned by {dashboard.owner === data.user_data.id ? 'you' : ''}
						</p>
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>
