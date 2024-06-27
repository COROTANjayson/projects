import { persisted } from 'svelte-persisted-store';
import { writable } from 'svelte/store';

export const leftSideBar = persisted('sideBar', false);
export const selectedAgenda = persisted('agenda', 'Segue');
export const teamIdStore = writable('')
export const isCanJoinMeeting = writable(true)

export const countdowns = writable(undefined)

