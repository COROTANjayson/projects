<script lang="ts">
	import PublicNavbar from "./PublicNavbar.svelte";

    // import type { LayoutData } from './$types';
    
    // export let data: LayoutData;
</script>

<div class="relative  px-6 w-full ">
	<PublicNavbar />
	<slot data />
</div>
