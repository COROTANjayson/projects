<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	import { enhance } from '$app/forms';

	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form" method="post" action="/dashboard?/logout" use:enhance>
			<footer class="modal-footer {parent.regionFooter}">
				<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
					>{parent.buttonTextCancel}</button
				>
				<button class="btn variant-ghost-primary">Sign out</button>
			</footer>
		</form>
	</div>
{/if}
