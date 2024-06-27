<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import type { PageData } from './$types';
	export let data: PageData;

	let name: string = '';

	onMount(() => {
		if (data.user) {
			name = data.user.name;
		}
		setTimeout(() => {
			window.location.href = '/';
		}, 1000);
	});
</script>

<!-- <div class="flex items-stretch w-full h-full bg-gradient-to-b from-[#4539CE] from-10% via-[#B15486] via-80% to-[#DD4460]"> -->
<div class="flex items-stretch w-full h-full">
	<div class="flex items-center justify-center w-full my-20">
		<div class=" flex flex-col items-center justify-center">
			<div class=" text-5xl pb-5 flex items-center" transition:fly={{ duration: 2000, x: -200 }}>
				<div class="float-left"> Welcome! </div>
				<!-- <div class="float-left">
                    <img width="48" height="48" src="https://img.icons8.com/emoji/48/waving-hand-emoji.png" alt="waving-hand-emoji"/>
                </div> -->
				<div>
					<img
						width="48"
						height="48"
						src="https://img.icons8.com/emoji/48/smiling-face-with-smiling-eyes.png"
						alt="smiling-face-with-smiling-eyes"
					/>
				</div>
			</div>
			<div class=" text-5xl" transition:fly={{ duration: 1000, x: 200 }}>
				{name}
			</div>
		</div>
	</div>
</div>
