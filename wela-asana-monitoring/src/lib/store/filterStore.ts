import { writable } from 'svelte/store';
import _ from 'lodash';
import { asanaData } from './chartStore';

export const selectedFilters: any = writable([]);
export const filterOptions: any = writable([
	{ name: 'Assignee', show: true },
	{ name: 'Creator', show: true },
	// { name: 'Subtask', show: true },
	{
		name: 'Date',
		sub: [{ name: 'Completion date' }, { name: 'Creation date' }, { name: 'Due date' }],
		show: true
	},
	// {
	// 	name: 'Excluded tasks',
	// 	sub: [{ name: 'Teams' }, { name: 'Project owned by' }, { name: 'Specific projects' }],
	// 	show: true
	// },
	{ name: 'Task completion status', show: true },
	{ name: 'Task status', show: true },
	{ name: 'Priority level', show: true }
]);

export const getOverdueTask = (task_list: any[]) => {
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
	return overdueTaskList;
};
export const removeFilter = (data: any) => {
	let selected_filter: any[] = [];
	let filter_option: any[] = [];

	selectedFilters.subscribe((el: any) => (selected_filter = el));
	filterOptions.subscribe((el: any) => (filter_option = el));
	selected_filter = selected_filter.filter((el: any) => el.name !== data.name);
	selectedFilters.set(selected_filter);

	let map_filters = filter_option.map((el: any) => {
		if (el.name === 'Excluded tasks' && data.name === 'Excluded tasks') {
			el.sub = [...el.sub, { name: data.sub }];
		}
		if (el.name === el.name) {
			el.show = true;
		}
		return el;
	});
	filterOptions.set(map_filters);
};

export const updateFilter = (filter: any) => {
	let selected_filter: any[] = [];

	selectedFilters.subscribe((el: any) => (selected_filter = el));
	const filters: any = _.map(selected_filter, (element: any) => {
		// Example: Incrementing age by 1
		if (element.name === filter.name) {
			element = filter;
		}
		return element;
	});
	selectedFilters.set(filters);
};

export const getFilters = (selected_filter: any) => {
	let data: any = {};
	asanaData.subscribe((value: any) => (data = value));
	let filters: any = {};
	const completed: any = _.find(selected_filter, { name: 'Task completion status' });
	const assignee: any = _.find(selected_filter, { name: 'Assignee' });
	const creator: any = _.find(selected_filter, { name: 'Creator' });
	const task_status: any = _.find(selected_filter, { name: 'Task status' });
	const priority_level: any = _.find(selected_filter, { name: 'Priority level' });
	const date: any = _.find(selected_filter, { name: 'Date' });
	if (date) {
		filters.date = date;
	}
	if (priority_level) {
		filters.priority_level = priority_level.level;
	}
	if (task_status) {
		filters.task_status = task_status.status;
	}
	if (completed) {
		filters.completed = completed.completed === '1' ? true : false;
	}
	if (assignee && assignee.assignees && assignee.assignees.length > 0) {
		let assigneesList: any = [];
		if (assignee.is_included) {
			assigneesList = assignee.assignees;
		} else {
			assigneesList = _.differenceWith(data.allUsers, assignee.assignees, _.isEqual);
			// assigneesList = [...assigneesList, null];
			filters.is_assignees_included = assignee.is_included;
		}
		if (assigneesList && assigneesList.length > 0) {
			filters.assignees = assigneesList.map((val: any) => val.gid);
		}
	}
	if (creator && creator.creators && creator.creators.length > 0) {
		let creatorsList: any = [];
		if (creator.is_included) {
			creatorsList = creator.creators;
		} else {
			creatorsList = _.differenceWith(data.allUsers, creator.creators, _.isEqual);
			creatorsList = [...creatorsList, null];
		}
		if (creatorsList && creatorsList.length > 0) {
			filters.creators = creatorsList.map((val: any) => val.gid);
		}
	}

	return filters;
};

export const updateFilterSelection = (val: any) => {
	let value: any = {
		...val
	};

	let filters;
	let filter_options: any[] = [];
	filterOptions.subscribe((data: any) => (filter_options = data));
	if (value.name === 'Excluded tasks') {
		let excluded = filter_options.find((data: any) => data.name == value.name);
		if (excluded.sub.length > 0) {
			let sub_array = excluded.sub.filter((sub: any) => sub.name !== value.sub);
			let map = filter_options.map((data: any) => {
				if (data.name == value.name) {
					data.sub = sub_array;
				}
				return data;
			});
			excluded.sub = sub_array;
			filterOptions.set(map);
		} else {
			filters = filter_options.map((data: any) => {
				if (data.name === value.name) {
					data.show = false;
				}
				return data;
			});
			filterOptions.set(filters);
		}
	} else {
		filters = filter_options.map((data: any) => {
			if (data.name === value.name) {
				data.show = false;
			}
			return data;
		});
		filterOptions.set(filters);
	}
};
export const filterTask = (chart_details: any, all_chart_task: any) => {
	let filters = getFilters(chart_details.filters);
	let tasks: any[] = all_chart_task;
	if (filters.priority_level) {
		let list: any[] = [];
		tasks.forEach((val: any) => {
			if (val.custom_fields) {
				let priority_level = _.find(val.custom_fields, { value: filters.priority_level });
				let priority_level_2 = _.find(val.custom_fields, {
					value: filters.priority_level.replace('priority', '')
				});
				if (priority_level || priority_level_2) {
					list.push(val);
				}
			}
		});
		tasks = list;
	}
	if (filters.task_status) {
		tasks = getOverdueTask(tasks);
	}
	if (filters.assignees) {
		let no_assignees = [];
		if (filters.is_assignees_included === false) {
			no_assignees = _.filter(tasks, { assignee: null });
		}

		const filteredAssignees = _.filter(tasks, (task) => {
			if (task.assignee && filters.assignees.includes(task.assignee.gid)) {
				return task;
			}
		});
		tasks = [...no_assignees, ...filteredAssignees];
	}
	if (filters.creators) {
		const filteredCreators = _.filter(tasks, (task) => {
			if (task.created_by && filters.creators.includes(task.created_by.gid)) {
				return task;
			}
		});
		tasks = filteredCreators;
	}
	if (filters.completed !== undefined) {
		const filteredCreators = _.filter(tasks, { completed: filters.completed });
		tasks = filteredCreators;
	}
	tasks = tasks.map((val: any) => {
		if (val.custom_fields) {
			const list = _.filter(val.custom_fields, (field) => {
				return field.name === 'Priority level?' && field.value !== '';
			});
			if (list.length > 0) {
				val.priority_level = list[0];
			}
		}
		return val;
	});

	if (filters.date) {
		let date = filters.date;

		const fromDate = new Date(date.from_date);
		const toDate = new Date(date.to_date);
		tasks = _.filter(tasks, (item) => {
			if (date.sub === 'Completion date') {
				if (item.completed_at) {
					const itemDate = new Date(item.completed_at);
					return itemDate >= fromDate && itemDate <= toDate;
				}
			}
			if (date.sub === 'Creation date') {
				if (item.created_at) {
					const itemDate = new Date(item.created_at);
					return itemDate >= fromDate && itemDate <= toDate;
				}
			}
			if (date.sub === 'Due date') {
				if (item.due_on) {
					const itemDate = new Date(item.due_on);
					return itemDate >= fromDate && itemDate <= toDate;
				}
			}
		});
	}
	return tasks;
};

export const getAssigneesOption = (tasks: any[]) => {
	let assignees: any = [];
	tasks.forEach((task: any) => {
		if (task.assignee && task.assignee.gid) {
			let assignee = assignees.find((val: any) => {
				if (val.gid === task.assignee.gid) {
					return task;
				}
			});
			if (!assignee) {
				assignees = [...assignees, task.assignee];
			}
		}
	});
	return assignees;
};
