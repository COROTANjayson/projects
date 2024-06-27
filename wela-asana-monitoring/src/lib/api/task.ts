import { taskListsSync } from '$lib/store/reportingStore';
import { taskLists } from '$lib/store/taskStore';
import { getDateByDays, getDateByWeeks } from '$lib/utils/dateUtils';
import axios from 'axios';
export const getTaskByUser = async (user: any, access_token: any) => {
	try {
		const modified_since = getDateByDays('prev', 7);
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://app.asana.com/api/1.0/tasks',
			params: {
				// assignee: user.gid,
				completed_since: modified_since,
				assignee: 'me',
				workspace: user.workspace_id,
				opt_fields:
					'custom_fields.name,custom_fields.enum_value,custom_fields.enum_value.name,custom_fields.enum_value.color,completed_at,created_at,assignee_status,created_by,modified_at,permalink_url,tags,tags.name,assignee,assignee.name,completed,due_at,due_on,approval_status,assignee_status,name,resource_subtype,projects,projects.name'
			},
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		console.log('error', error);
		return [];
	}
};

export const getTaskFromProject = async (filters: any, project_id: any, access_token: any) => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: `https://app.asana.com/api/1.0/projects/${project_id}/tasks`,
			params: {
				...filters,
				// assignee: user.gid,
				// assignee: '1201737941711214',
				// workspace: user.workspace_id,
				opt_fields:
					'custom_fields.name,custom_fields.enum_value,custom_fields.enum_value.name,custom_fields.enum_value.color,completed_at,created_at,assignee_status,created_by,modified_at,permalink_url,tags,tags.name,assignee,assignee.name,completed,due_at,due_on,approval_status,assignee_status,name,resource_subtype,projects,projects.name'
			},
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		console.log('getTasks error', error);
		return [];
	}
};
export const getTasks = async (filter: any, access_token: any) => {
	try {
		const modified_since = getDateByDays('prev', 7);

		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://app.asana.com/api/1.0/tasks',
			params: {
				...filter,
				modified_since: modified_since.toISOString(),
				// modified_since: '2023-06-01T02:06:58.158Z',
				// assignee: user.gid,
				// assignee: '1201737941711214',
				// workspace: user.workspace_id,
				opt_fields:
					'custom_fields.name,custom_fields.enum_value,custom_fields.enum_value.name,custom_fields.enum_value.color,completed_at,created_at,assignee_status,created_by,modified_at,permalink_url,tags,tags.name,assignee,assignee.name,completed,due_at,due_on,approval_status,assignee_status,name,resource_subtype,projects,projects.name'
			},
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};
		const response = await axios.request(config);

		let result = response.data;

		return result.data;
	} catch (error) {
		// console.log('getTasks error', error);
		return [];
	}
};

// export const getTasksRecursive = async (filter: any, access_token: any): Promise<any[]> => {
// 	try {
// 		const config = {
// 			method: 'get',
// 			maxBodyLength: Infinity,
// 			url: 'https://app.asana.com/api/1.0/tasks',
// 			params: {
// 				...filter,
// 				limit: 100,
// 				completed_since: '2024-01-01T02:06:58.158Z',
// 				opt_fields:
// 					'custom_fields.name,custom_fields.enum_value,custom_fields.enum_value.name,custom_fields.enum_value.color,completed_at,created_at,assignee_status,created_by,modified_at,permalink_url,tags,tags.name,assignee,assignee.name,completed,due_at,due_on,approval_status,assignee_status,name,resource_subtype,projects,projects.name'
// 			},
// 			headers: {
// 				accept: 'application/json',
// 				authorization: 'Bearer ' + access_token
// 			}
// 		};

// 		const response = await axios.request(config);
// 		let result = response.data;

// 		let task_list: any[] = [];
// 		taskLists.subscribe((value: any) => (task_list = value));
// 		if (result.data) {
// 			taskLists.set([...task_list, ...result.data]);
// 		}

// 		if (result.next_page) {
// 			filter.offset = result.next_page.offset;
// 			return getTasksRecursive(filter, access_token);
// 		} else {
// 			return result.data; // Assuming 'data' contains tasks
// 		}
// 	} catch (error) {
// 		return []; // Return empty array in case of error
// 	}
// };

export const getTasksRecursive = async (filter: any, access_token: any): Promise<any[]> => {
	try {
		const config = {
			method: 'get',
			maxBodyLength: Infinity,
			url: 'https://app.asana.com/api/1.0/tasks',
			params: {
				...filter,
				limit: 100,
				modified_since: '2023-06-01T02:06:58.158Z',
				opt_fields:
					'custom_fields.name,custom_fields.enum_value,custom_fields.enum_value.name,custom_fields.enum_value.color,completed_at,created_at,assignee_status,created_by,modified_at,permalink_url,tags,tags.name,assignee,assignee.name,completed,due_at,due_on,approval_status,assignee_status,name,resource_subtype,projects,projects.name'
			},
			headers: {
				accept: 'application/json',
				authorization: 'Bearer ' + access_token
			}
		};

		const response = await axios.request(config);
		let result = response.data;

		let task_list: any[] = [];
		taskListsSync.subscribe((value: any) => (task_list = value));
		if (result.data) {
			taskListsSync.set([...task_list, ...result.data]);
		}

		if (result.next_page) {
			filter.offset = result.next_page.offset;
			return getTasksRecursive(filter, access_token);
		} else {
			return result.data; // Assuming 'data' contains tasks
		}
	} catch (error) {
		return []; // Return empty array in case of error
	}
};
