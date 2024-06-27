<script lang="ts">
	import type { PageData } from './$types';
	import { _authLoginAsana } from './+page';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let isLoggingIn = false;

	onMount(async () => {
		if (data.url != '') {
			goto(data.url);
		}
	});

	function handleLinkAccount() {
		isLoggingIn = true;
		_authLoginAsana();
	}
</script>

<div class="flex flex-col items-center mt-[15%]">
	<div class="flex flex-col items-center">
		<h6 class=" text-[32px] font-medium">Welcome to Wela Asana Reports</h6>
		<p class=" text-xl font-medium">To proceed, kindly log in.</p>
	</div>
	<!-- <form class="auth-form" method="POST" action="?/signup"> -->
	<button
		on:click={handleLinkAccount}
		disabled={isLoggingIn}
		class=" mt-12 h-14 w-[340px] border-2 rounded-lg flex justify-center items-center gap-6"
	>
		<img alt="google-icon" class=" h-4 w-4" src="/google.svg" />
		<p class=" text-sm font-medium">Sign in with Google</p>
	</button>
	<!-- </form> -->
</div>

<!-- <div
	class="flex items-stretch w-7/12 h-full bg-gradient-to-b from-[#4539CE] from-10% via-[#B15486] via-80% to-[#DD4460]"
>
	<div class="flex self-center justify-center w-full">
		<img class="w-4/6 h-4/6" src="/left-side-login.svg" />
	</div>
</div>
<div class="flex items-stretch w-5/12 h-full">
	<div class="flex self-center justify-center w-full">
		<div class="flex-col items-stretch">
			<div>
				<img class="w-72" src="/right-side-login.svg" />
			</div>
			<button
				class="h-14 w-full border-2 {isLoggingIn
					? 'cursor-wait border-blue-700 bg-blue-100'
					: 'border-blue-200'} rounded-full mt-16 self-center hover:bg-blue-100 hover:border-blue-700"
				disabled={isLoggingIn}
				on:click={handleLinkAccount}
			>
				<div class="flex flex-row px-10">
					<div class="flex-shrink">
						<img class="h-8 w-8" src="/google.svg" />
					</div>
					<div class="flex-grow text-lg">Link Account Here</div>
				</div>
			</button>
		</div>
	</div>
</div> -->
