<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	import type { PageData } from './$types';
	export let data: PageData;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	toastStore.clear();
	modalStore.clear();
</script>

<div class="flex items-end justify-end p-10">
	{#if data.user}
		<a href="/dashboard" class="btn variant-soft-success" data-sveltekit-preload-data="hover"
			>Dashboard</a
		>
	{:else}
		<div class="pr-5">
			<a href="/auth/signup" class="btn variant-soft-tertiary" data-sveltekit-preload-data="hover"
				>Sign Up</a
			>
		</div>
		<a href="/auth/signin" class="btn variant-soft-primary" data-sveltekit-preload-data="hover"
			>Sign In</a
		>
	{/if}
</div>
<div class="container mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Pulong</h1>
		
	</div>
</div>
