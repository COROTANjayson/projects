<script>
	import { IconEye, IconEyeClosed } from '@tabler/icons-svelte';
	export let value = '';
	export let id = '';

	let showPassword = false;
	let type = 'password';

	function toggleVisibility() {
		showPassword = !showPassword;
		type = showPassword ? 'text' : 'password';
	}
</script>

<input {id} name={id} placeholder="Enter Password..." bind:value {...{ type }} />
{#if showPassword}
	<button on:click={toggleVisibility}><IconEye /></button>
{:else}
	<button on:click={toggleVisibility}><IconEyeClosed /></button>
{/if}
