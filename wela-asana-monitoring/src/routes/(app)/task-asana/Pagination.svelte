<script>
	import { taskTotalPages } from '$lib/store/taskStore';
	import { onMount } from 'svelte';

	/**
	 * @type {number}
	 */
	export let currentPage;

	/**
	 * @type {any}
	 */

	/**
	 * @type {(arg0: any) => void}
	 */
	export let onPageChange;

	const limit = 5; // Maximum number of pages to display
	$: pages = Array.from({ length: $taskTotalPages }, (_, i) => i + 1); // Array of all pages
	$: index = pages.indexOf(currentPage); // Index of the current page in the array
	$: startPage = Math.max(index - Math.floor(limit / 2), 0); // Starting index for displayed pages
	$: endPage = Math.min(startPage + limit, $taskTotalPages); // Ending index for displayed pages
	$: displayedPages = pages.slice(startPage, endPage); // Array of displayed pages
</script>

<div class="pagination">
	{#if startPage > 1}
		<button
			class="px-3 py-2 ml-0 leading-tight bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
			on:click={() => onPageChange(1)}>1</button
		>
		{#if startPage > 2}
			<span>...</span>
		{/if}
	{/if}

	{#each displayedPages as page}
		<button
			class={`px-3 py-2 ml-0 leading-tight 
        ${
					currentPage === page
						? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
						: 'bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
				}`}
			on:click={() => onPageChange(page)}
		>
			{page}
		</button>
	{/each}
</div>
