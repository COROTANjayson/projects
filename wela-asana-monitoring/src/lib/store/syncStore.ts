import { PUBLIC_URL } from '$env/static/public';
import { getTasks } from '$lib/api/task';
import axios from 'axios';
import { writable } from 'svelte/store';

export const syncProgress: any = writable(undefined);
export const syncNumbers: any = writable(0);

export const syncName: any = writable('Sync tasks');
export const syncProjectReport = async (project_array: any, data: any) => {
	for (const element of project_array) {
		let sync_projects = 0;
		let task_list = [];
		syncProgress.subscribe((val: any) => (sync_projects = val));

		sync_projects += 1;
		syncProgress.set(sync_projects);
		// console.log(element.name, '=', element.isFetch);
		let filter = { project: element.gid };
		const tasks = await getTasks(filter, data.access_token);
		let taskL_list = tasks.map((task: any) => {
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
		// console.log(element.name, ':', taskL_list);

		if (taskL_list) {
			for (const taskElement of taskL_list) {
				let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
					...taskElement
				});
				// console.log(resp.data);
			}
		}
	}
};
export const syncTaskByAssignees = async (array_assignees: any, data: any) => {
	for (const element of array_assignees) {
		let sync_projects = 0;
		let task_list = [];
		syncProgress.subscribe((val: any) => (sync_projects = val));

		sync_projects += 1;
		syncProgress.set(sync_projects);
		// console.log(element.name, '=', element.isFetch);
		let filter = { assignee: element.gid, workspace: data.user_data.workspace_id };
		const tasks = await getTasks(filter, data.access_token);

		let taskL_list = tasks.map((task: any) => {
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
		// console.log(element.name, ':', taskL_list);

		if (taskL_list) {
			for (const taskElement of taskL_list) {
				let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
					...taskElement
				});
				// console.log(resp.data);
			}
		}
	}
};

export const syncAllTask = async (data: any) => {
	await syncProjectReport(data.allProject, data);
	await syncTaskByAssignees(data.allUsers, data);
	syncProgress.set(undefined);
	syncName.set('Sync tasks');
};

export const syncTaskByAssigneesInBackground = async (array_assignees: any, data: any) => {
	for (const element of array_assignees) {
		let filter = { assignee: element.gid, workspace: data.user_data.workspace_id };
		const tasks = await getTasks(filter, data.access_token);

		let taskL_list = tasks.map((task: any) => {
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
		// console.log(element.name, ':', taskL_list);

		if (taskL_list) {
			for (const taskElement of taskL_list) {
				let resp = await axios.post(PUBLIC_URL + `/tasks/${taskElement.gid}`, {
					...taskElement
				});
				// console.log(resp.data);
			}
		}
	}
};
