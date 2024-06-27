<script lang="ts">
	import { onMount } from 'svelte';

	let currentPath = '';

	onMount(() => {
		// Accessing the current path
		currentPath = window.location.pathname;
	});
</script>

<div
	class="h-16 w-full flex items-center justify-between border-b-2 sticky top-0 z-50 px-6 bg-white"
>
	<!-- <h3 class=" text-xl text-[#4573D2] font-medium">API-REPORTS</h3> -->
	<h3 class=" text-xl text-[#4573D2] font-medium">Wela Asana Reports</h3>

	
</div>
