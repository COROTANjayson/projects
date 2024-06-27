import { writable } from 'svelte/store';
import { onMount } from 'svelte';

// Initialize the writable store with the current path
export const currentPath = writable('');
export const taskLists = writable([] as any);
export const incompleteTasks = writable([] as any);
export const completedTasks = writable([] as any);
export const tasksByProject = writable({} as any);
export const overdueTasks = writable([] as any);
export const taskFilter = writable({} as any);
export const isLoadingReport = writable(false);
export const openTaskList = writable(false);
export const taskType = writable('');
export const taskTotalPages = writable(10)
export const getByCompleteStatus = () => {
	let task_list: any[] = [];
	taskLists.subscribe((value: any) => (task_list = value));

	let incomplete: any[] = [];
	let complete: any[] = [];
	task_list.forEach((data: any) => {
		if (data.completed) {
			complete = [...complete, data];
		} else {
			incomplete = [...incomplete, data];
		}
	});

	incompleteTasks.set(incomplete);
	completedTasks.set(complete);
};
export const getTaskByProject = () => {
	let task_list: any[] = [];
	taskLists.subscribe((value: any) => (task_list = value));

	const separatedTasks: any = {};
	task_list.forEach((task: any) => {
		if (task.projects.length != 0) {
			task.projects.forEach((project: any) => {
				const projectName = project.name;
				if (!separatedTasks[projectName]) {
					separatedTasks[projectName] = [];
				}
				separatedTasks[projectName].push(task);
			});
		}
		// else {
		// 	noProject = [...noProject, task];
		// }
	});
	tasksByProject.set(separatedTasks);
};

export const getOverdueTask = () => {
	let task_list: any[] = [];
	taskLists.subscribe((value: any) => (task_list = value));

	const today = new Date();
	const year = today.getFullYear();
	let month: any = today.getMonth() + 1;
	let day: any = today.getDate();
	if (month < 10) {
		month = '0' + month;
	}
	if (day < 10) {
		day = '0' + day;
	}
	const formattedDate = `${year}-${month}-${day}`;
	const overdueTaskList = task_list.filter(
		(task) => task.due_on < formattedDate && task.completed == false
	);
	overdueTasks.set(overdueTaskList);
};
