import { writable } from 'svelte/store';
import { onMount } from 'svelte';

// Initialize the writable store with the current path
export const currentPath = writable('');
