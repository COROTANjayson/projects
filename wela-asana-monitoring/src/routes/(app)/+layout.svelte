<script lang="ts">
	// import { _deAuthentication } from './+layout';
	import { goto } from '$app/navigation';
	import { teams } from '$lib/store/projectStore';
	import type { LayoutData } from './$types';
	import Navbar from './Navbar.svelte';
	import { onMount } from 'svelte';
	export let data: LayoutData;
	onMount(() => {
		teams.set(data.teams);
		asanaData.set(data);
	});
	onMount(() => {
		// Listen for changes in the pathname
		page.subscribe((value) => {
			currentPath = value.url.pathname;
		});
	});
	// function handleLogout(){
	//     _deAuthentication()
	//     goto('login/?logout=true')
	// }
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import { asanaData } from '$lib/store/chartStore';
	import { syncAllTask, syncName, syncNumbers, syncProgress } from '$lib/store/syncStore';

	let pathname;
	$: {
		setInterval(() => {
			if (!data.access_token) {
				goto('/login');
			}
		}, 5000);
	}
	// onMount(()=>{
	// 	syncAllTask(data);
	// })

	let currentPath: string;
	onMount(() => {
		currentPath = window.location.pathname;
		// Update the current path whenever the URL changes
		// window.addEventListener('popstate', () => {
		// 	currentPath = window.location.pathname;
		// });
	});
</script>

<Navbar {data} />
<div class=" flex">
	<div class="mt-16 fixed inset-y-0 top-0 left-0 w-[236px] py-4 px-2 border-r-2 space-y-3">
		<button
			on:click={() => {
				goto('/');
				currentPath = '/';
			}}
			class={`${currentPath === '/' ? 'bg-[#EEF0F5]' : ''}  hover:bg-gray-50 rounded-lg h-10 flex items-center gap-2 just px-4 w-full`}
		>
			<img src="/dashboard.svg" alt="" />
			<p class="font-medium">My Task</p>
		</button>
		<!-- <button
			on:click={() => {
				goto('/task-asana');
				currentPath = '/task-asana';
			}}
			class={`${currentPath === '/task' ? 'bg-[#EEF0F5]' : ''}  hover:bg-gray-50 rounded-lg h-10 flex items-center gap-2 just px-4 w-full`}
		>
			<img src="/reports-icon.svg" alt="" />
			<p class="font-medium">Task</p>
		</button> -->
		<button
			on:click={() => {
				goto('/reporting');
				currentPath = '/reporting';
			}}
			class={`${currentPath === '/reporting' ? 'bg-[#EEF0F5]' : ''}  hover:bg-gray-50 rounded-lg h-10 flex items-center gap-2 just px-4 w-full`}
		>
			<img src="/reports-icon.svg" alt="" />
			<p class="font-medium">Reporting</p>
		</button>
	</div>
	<div class="ml-[236px] px-6 py-2 w-full overflow-x-hidden">
		<slot />
	</div>
</div>

<!-- <div class="flex flex-row w-full h-14 bg-[#5C3DBD]">
    <div class="flex text-white w-25">
        <img class="text-white h-10 w-10" src="/burger-menu.svg" />
    </div>
    <div class="flex-grow text-center h-full items-center">
        <div class="items-center text-white text-4xl font-semibold">Wela Asana Monitoring</div>
    </div>
    <div class="flex w-25 h-full">
        <img class="flex h-10 w-10 items-center mx-1 mt-1" src="/user-circle.svg" />
        <img class="flex h-10 w-10 items-center mx-1 mt-1 cursor-pointer" src="/logout-2.svg" on:click={handleLogout} />
    </div>
</div>
<div class="text-lg text-blue-800">
    Whatsup mga oyamot
</div>
<slot/> -->
