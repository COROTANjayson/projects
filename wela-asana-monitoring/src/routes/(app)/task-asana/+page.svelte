<script lang="ts">
    import type { PageData } from './$types';
	import ReportsPage from './ReportsPage.svelte';
    
    export let data: PageData;
</script>

<!-- <div>Hello</div> -->
<ReportsPage {data} />
