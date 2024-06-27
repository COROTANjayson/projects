<script>
	import { IconCircle, IconCircleFilled } from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';

	// Define a prop for the number of divs
	export let number = 5; // Default to 5 divs

	$: circles = [false, false, false, false, false];
	onMount(() => {
		circles.forEach((_, i) => {
			setTimeout(() => {
				circles[i] = true;
			}, i * 100);
		});
	});
</script>

<!-- <div class="space-y-4">
	{#each Array(number) as _, index}
	  <div class="h-16 w-full bg-slate-400/30 dark:bg-slate-500/30 animate-pulse"></div
	{/each}
  </div> -->
<div class="space-y-4">
	<div
		class="transition-all flex items-center gap-3 justify-center pb-4 pt-5 w-full  opacity-50 animate-pulse"
	>
		{#each circles as visible, i}
			<IconCircleFilled
				size={20}
				class={` text-white dark:text-gray-400  ${visible ? 'animate-bounce' : 'w-0'} transition-all`}
			/>
		{/each}
	</div>
</div>
