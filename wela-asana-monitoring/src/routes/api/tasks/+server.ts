import type { RequestHandler } from './$types';
import axios from 'axios';
import { SECRET_FIRESTORE_KEY } from '$env/static/private';
import { initializeApp, cert, type ServiceAccount, getApps } from 'firebase-admin/app';
import { getFirestore, FieldPath } from 'firebase-admin/firestore';

// import * as serviceAccount from '../../../../accountServiceKey.json';
// const serviceAccountKey = serviceAccount as ServiceAccount;
const serviceAccountKey = JSON.parse(SECRET_FIRESTORE_KEY);

const firebaseApp =
	getApps().length === 0
		? initializeApp({
				credential: cert(serviceAccountKey)
			})
		: getApps();

// initializeApp({
// 	credential: cert(serviceAccountKey)
// }, 'wela-asana');
const db = getFirestore();

export const GET: RequestHandler = async ({ request, fetch, cookies }) => {
	try {
		const queryParams = new URL(request.url).searchParams;

		const included_from = queryParams.get('included_from');
		const projectids = queryParams.get('projectids');

		// const dashboard_id = queryParams.get('dashboard_id');
		// const project = queryParams.get('project');
		const assignees = queryParams.get('assignees');
		const creators = queryParams.get('creators');
		const completed = queryParams.get('completed');

		let size = 0;
		let tasks: any = [];
		let projectids_json: any = [];

		let snapshot: any = db.collection('tasks');

		if (completed) {
			let isCompleted = completed === 'true' ? true : false;

			snapshot = snapshot.where('completed', '==', isCompleted);
		}

		if (included_from === 'wela.online') {
			if (assignees && JSON.parse(assignees).length <= 30) {
				snapshot = snapshot.where(new FieldPath('assignee', 'gid'), 'in', JSON.parse(assignees));
			}
			if (creators && JSON.parse(creators).length <= 30) {
				snapshot = snapshot.where(new FieldPath('created_by', 'gid'), 'in', JSON.parse(creators));
			}
			const res = await snapshot.get();
			size = res.size;
			res.forEach((doc: any) => {
				tasks = [...tasks, doc.data()];
			});
		} else if (included_from === 'Teams') {
			let assignees_json = []
			if (assignees) {
				assignees_json = JSON.parse(assignees);
			}
			if (assignees_json.length > 30) {
				let splitIndex = Math.ceil(assignees_json.length / 2);

				let firstHalf = assignees_json.slice(0, splitIndex);
				let secondHalf = assignees_json.slice(splitIndex);
				let firstSnapshot = snapshot.where(new FieldPath('assignee', 'gid'), 'in', firstHalf);
				let secondSnapshot = snapshot.where(new FieldPath('assignee', 'gid'), 'in', secondHalf);
				const res_1 = await firstSnapshot.get();
				const res_2 = await secondSnapshot.get();

				res_1.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});

				res_2.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});
			} else {
				snapshot = snapshot.where(new FieldPath('assignee', 'gid'), 'in', assignees_json);
				const res = await snapshot.get();
				res.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});
			}
		} else {
			if (projectids) {
				projectids_json = JSON.parse(projectids);
			}

			if (projectids_json.length > 30) {
				let splitIndex = Math.ceil(projectids_json.length / 2);

				let firstHalf = projectids_json.slice(0, splitIndex);
				let secondHalf = projectids_json.slice(splitIndex);
				let firstSnapshot = snapshot.where('project_ids', 'array-contains-any', firstHalf);
				let secondSnapshot = snapshot.where('project_ids', 'array-contains-any', secondHalf);
				const res_1 = await firstSnapshot.get();
				const res_2 = await secondSnapshot.get();

				res_1.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});

				res_2.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});
			} else {
				snapshot = snapshot.where('project_ids', 'array-contains-any', projectids_json);
				const res = await snapshot.get();
				res.forEach((doc: any) => {
					tasks = [...tasks, doc.data()];
				});
			}
		}
		tasks = mergeTasks(tasks);

		return new Response(JSON.stringify({ success: true, data_size: size, tasks }));
	} catch (e) {
		console.log(e);
		return new Response(JSON.stringify({ success: false, data_size: 0, tasks: [] }));
	}
};
export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestBody = await request.json();

		const res = await db.collection('charts').add(requestBody);
		let doc = await res.get();
		let data = { ...doc.data(), id: res.id };
		return new Response(JSON.stringify({ success: true, data }));
	} catch (e) {
		console.log('Authentication Error', e);
		return new Response(JSON.stringify({ success: 'hi' }));
	}
};

const mergeTasks = (tasks: any) => {
	let mergedTasks: any = [];
	let taskMap = new Map();

	tasks.forEach((task: any) => {
		if (!taskMap.has(task.gid)) {
			taskMap.set(task.gid, task);
			mergedTasks.push(task);
		} else {
			let existingTask = taskMap.get(task.gid);
			Object.keys(task).forEach((key) => {
				if (key !== 'gid' && !existingTask[key]) {
					existingTask[key] = task[key];
				}
			});
		}
	});
	return mergedTasks;
};
