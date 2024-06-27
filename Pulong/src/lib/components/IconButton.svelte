<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	interface Props {
		onClick?: () => void;
		className?: string;
	}
	export let onClick: Props['onClick'] = () => {};
	export let className: Props['className'] = '';

	const dispatch = createEventDispatcher();
</script>

<button
	on:click={onClick}
	class={`hover:bg-surface-50 rounded-full w-[40px] h-[40px] flex items-center justify-center ${className}`}
>
	<slot></slot>
</button>