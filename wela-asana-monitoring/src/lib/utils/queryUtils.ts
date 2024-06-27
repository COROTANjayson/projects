export const mergeTasks = (tasks: any) => {
	let mergedTasks: any = [];
	let taskMap = new Map();

	tasks.forEach((task: any) => {
		if (!taskMap.has(task.gid)) {
			taskMap.set(task.gid, task);
			mergedTasks.push(task);
		} else {
			// Merge properties of tasks with the same gid
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
export const mergeArraywithGID = (tasks: any) => {
	let mergedTasks: any = [];
	let taskMap = new Map();

	tasks.forEach((task: any) => {
		if (!taskMap.has(task.gid)) {
			taskMap.set(task.gid, task);
			mergedTasks.push(task);
		} else {
			// Merge properties of tasks with the same gid
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

export const mergeArraywithID = (array: any) => {
	let mergedarrays: any = [];
	let arrayMap = new Map();

	array.forEach((array: any) => {
		if (!arrayMap.has(array.id)) {
			arrayMap.set(array.id, array);
			mergedarrays.push(array);
		} else {
			// Merge properties of arrays with the same id
			let existingarray = arrayMap.get(array.id);
			Object.keys(array).forEach((key) => {
				if (key !== 'id' && !existingarray[key]) {
					existingarray[key] = array[key];
				}
			});
		}
	});

	return mergedarrays;
};
