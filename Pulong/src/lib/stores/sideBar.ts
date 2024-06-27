import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

export const sideBarStore = persisted('sideBar', false);
export const sideBarRight = writable(false);
export const sideBarMenu = writable(true);
export const sideBarItem = persisted('sideBarItem', 'KPI');

export const isDeleteModalOpen = writable(false);
export const isDeleteModalKPIOpen = writable(false);
export const deleteItem = writable({} as any);
export const endpointStore = writable('');
