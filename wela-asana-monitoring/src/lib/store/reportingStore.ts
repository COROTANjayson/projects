import { writable } from 'svelte/store';



export const isOpenModal =  writable(false);
export const isDashboardDetailsOpen =  writable(false);
export const isDeleteDashboardOpen =  writable(false);
export const isShareOpen=  writable(false);


export const dashboard_details:any = writable({})

export const taskListsSync = writable([] as any);


