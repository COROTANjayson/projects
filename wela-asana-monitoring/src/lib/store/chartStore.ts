import { writable } from 'svelte/store';
import { filterOptions, selectedFilters } from './filterStore';
import _ from 'lodash';

export const chart_method = writable('create' as 'create' | 'edit');
export const isOpenModal = writable(false);
export const isFetchingCharts = writable(false);
export const isDashboardDetailsOpen = writable(false);
export const allChartTask: any = writable([]);
export const chartList: any = writable([]);
export const chart_data: any = writable({
	chart_style: 'Number',
	report_on: 'Tasks',
	include_from: '',
	include_from_array: [] as any
});

export const included_array = writable([]);
export const filtered_included_array: any = writable([]);
export const asanaData: any = writable({});
export const chartMessage: any = writable('');
export const isFetching: any = writable(false);

export const emptyChartData = () => {
	allChartTask.set([]);
	included_array.set([]);
	filtered_included_array.set([]);
	included_array.set([]);
	chart_data.set({
		chart_style: 'Number',
		report_on: 'Tasks',
		include_from: '',
		include_from_array: [] as any
	});
	selectedFilters.set([]);
	filterOptions.set([
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
};

export const handleIncludedArray = (include_from: string) => {
	included_array.set([]);
	let data: any = {};
	asanaData.subscribe((value: any) => (data = value));
	let chartData: any = {};
	chart_data.subscribe((value: any) => (chartData = value));
	chart_data.set({
		...chartData,
		include_from_array: [],
		include_from: include_from
	});
	chart_data.subscribe((value: any) => (chartData = value));

	if (chartData.include_from == 'Teams') {
		included_array.set(data.teams);
		filtered_included_array.set(data.teams);
	} else if (chartData.include_from == 'Projects owned by') {
		included_array.set(data.allUsers);
		filtered_included_array.set(data.allUsers);
	} else if (chartData.include_from == 'Specific projects') {
		included_array.set(data.allProject);
		filtered_included_array.set(data.allProject);
	}
};

export const searchInIncludedArray = (searchInput: string) => {
	let data: any = {};
	asanaData.subscribe((value: any) => (data = value));

	let includedArray: any = [];
	included_array.subscribe((value: any) => (includedArray = value));
	if (searchInput === '' || !searchInput) {
		filtered_included_array.set(includedArray);
	} else {
		const filteredArray = includedArray.filter((item: { name: string }) =>
			item.name.toLowerCase().includes(searchInput.toLowerCase())
		);
		filtered_included_array.set(filteredArray);
	}
};

export const addToIncludedArray = (data: any) => {
	let chartData: any = {};
	chart_data.subscribe((value: any) => (chartData = value));
	const isFind = chartData.include_from_array.find((val: { name: any }) => {
		return val.name === data.name;
	});
	if (!isFind) {
		chart_data.set({
			...chartData,
			include_from_array: [...chartData.include_from_array, data]
		});
	}
};
export const removeFromIncludedArray = (data: any) => {
	let chartData: any = {};
	chart_data.subscribe((value: any) => (chartData = value));
	// allChartTask
	let all_chart_task: any = [];
	allChartTask.subscribe((value: any) => (all_chart_task = value));

	if (chartData.include_from === 'Teams') {
		let removed_tasks = all_chart_task.filter((element: any) => element.team !== data.name);
		allChartTask.set(removed_tasks);
	}
	if (chartData.include_from === 'Projects owned by') {
		let removed_tasks = all_chart_task.filter((element: any) => element.project_owner !== data.gid);
		allChartTask.set(removed_tasks);
	}
	if (chartData.include_from === 'Specific projects') {
		let removed_tasks = all_chart_task.filter((element: any) => element.project_gid !== data.gid);
		allChartTask.set(removed_tasks);
	}
	const new_array = chartData.include_from_array.map((val: any) => {
		if (val.gid === data.gid) {
			val.fetch = false;
		}
		return val;
	});
	const array = new_array.filter((val: { name: any }) => {
		return val.name !== data.name;
	});
	chart_data.set({
		...chartData,
		include_from_array: [...array]
	});
};

// const mergeTask = (data:any) => {
// 	// Group objects by id
// 	const groupedById = _.groupBy(data, 'gid');

// 	// Merge objects within each group
// 	const mergedData = _.map(groupedById, (group) => _.merge({}, ...(group as any)));
// };

// import _ from 'lodash';
