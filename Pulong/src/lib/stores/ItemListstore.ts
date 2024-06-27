import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
import axios from 'axios';
import { writable } from 'svelte/store';

export const kpiList = writable([] as any[]);
export const goalList = writable([] as any[]);
export const headlineList = writable([] as any[]);
export const todoList = writable([] as any[]);
export const issueList = writable([] as any[]);

export const toast = writable(undefined as any);
export const toastContent = writable(undefined as any);
export const loadingList = writable(false);
export const triggerToast = (method: string, message: string, seconds: number = 5) => {
	const t: ToastSettings = {
		message: message,
		timeout: seconds * 1000
	};
	if (method === 'add') {
		t.classes = 'bg-green-500 ';
	} else if (method === 'update') {
		t.classes = 'bg-blue-500';
	} else if (method === 'delete') {
		t.classes = 'bg-red-500';
	} else if (method === 'warning') {
		t.classes = 'bg-yellow-500';
	}
	toastContent.set(t);
};
export const getKPIList = async (filter?: any) => {
	loadingList.set(true)
	let kpi = [];
	let response = await axios.get(`/api/kpi`, {
		params: {
			...filter
		}
	});
	let result = response.data;
	kpi = result.data;
	kpiList.set(kpi);
	loadingList.set(false)
};

export const getGoalList = async (filter?: any) => {
	let goal = [];
	let response = await axios.get(`/api/goal`, {
		params: {
			...filter
		}
	});
	let result = response.data;
	goal = result.data;
	goalList.set(goal);
};
export const getHeadlineList = async (filter?: any) => {
	let headline = [];
	let response = await axios.get(`/api/headline`, {
		params: {
			...filter
		}
	});
	let result = response.data;
	headline = result.data;
	headlineList.set(headline);
};
export const getTodoList = async (filter?: any) => {
	let todo = [];
	let response = await axios.get(`/api/todo`, {
		params: {
			...filter
		}
	});
	let result = response.data;
	todo = result.data;
	todoList.set(todo);
};
export const getIssueList = async (filter?: any) => {
	let issue = [];
	let response = await axios.get(`/api/issue`, {
		params: {
			...filter
		}
	});
	let result = response.data;
	issue = result.data;
	issueList.set(issue);
};
