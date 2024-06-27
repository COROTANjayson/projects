import { writable } from 'svelte/store';
import { sideBarRight } from './sideBar';
import axios from 'axios';
import { triggerToast } from './ItemListstore';

export const editForm = writable(false);
export const goalsData = writable(undefined as any);
export const headlineData = writable(undefined as any);
export const issueData = writable(undefined as any);
export const todoData = writable(undefined as any);
export const kpiData = writable(undefined as any);

export const creatorName = writable(undefined as any);
export const relatedFrom = writable(undefined as any);
export const formName = writable('');
export const inputLoading = writable(undefined as any);
export const members = writable([] as any[]);
export const teamsStore = writable([] as any[]);
export const getMembers = async (teamId: string) => {
	inputLoading.set(true);
	let resp = await axios.get(`/api/team/members/${teamId}`);
	let result = resp.data;
	members.set(result.data);
	inputLoading.set(false);
};

export const onNewForm = (name: string, isRelated: boolean = false) => {
	let teams = [];

	teamsStore.subscribe((val: any) => {
		teams = val;
	});
	if (teams.length > 0) {
		formName.set(name);
		sideBarRight.set(true);
		editForm.set(false);
		creatorName.set(undefined);
		if (!isRelated) relatedFrom.set(undefined);
	} else {
		triggerToast('warning', 'You do not have a team yeat. Please create or join a team first');
	}
};

export const onUpdateForm = (name: string, data: any) => {
	creatorName.set(data.creator.name);
	sideBarRight.set(true);
	formName.set(name);
	editForm.set(true);

	handleRelation(data, name);
};
export const handleRelation = (data: any, name: string) => {
	let relation: any = {};

	if (data.issueId) {
		if (name === 'Issue') {
			relation.issueId = data.issueId;
			relatedFrom.set({
				...relation,
				name: data.successor.name
			});
		}
		if (name === 'Todo' && data.issue) {
			relation.issueId = data.issueId;
			relatedFrom.set({
				...relation,
				name: data.issue.name
			});
		}
	} else if (data.todoId) {
		relation.todoId = data.todoId;
		if (name === 'Todo') {
			relation.todoId = data.todoId;
			relatedFrom.set({
				...relation,
				name: data.successor.name
			});
		}
		if (name === 'Issue' && data.todo) {
			relation.todoId = data.todoId;
			relatedFrom.set({
				...relation,
				name: data.todo.name
			});
		}
	} else if (data.goalId) {
		relation.goalId = data.goalId;
		relatedFrom.set({
			...relation,
			name: data.goal.name
		});
	} else if (data.headlineId) {
		relation.headlineId = data.headlineId;
		relatedFrom.set({
			...relation,
			name: data.headline.name
		});
	} else if (data.kpiId) {
		relation.kpiId = data.kpiId;
		relatedFrom.set({
			...relation,
			name: data.kpi.name
		});
	} else {
		relatedFrom.set(undefined);
		creatorName.set(data.creator.name);
	}
	return relation;
};

export const onClosForm = () => {
	formName.set('');
	sideBarRight.set(false);
	editForm.set(false);
	issueData.set(undefined);
	relatedFrom.set(undefined);
};
