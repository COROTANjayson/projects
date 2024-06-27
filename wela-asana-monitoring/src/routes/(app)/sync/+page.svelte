<script lang="ts">
    import type { PageData } from './$types';
	import ReportingPage from './ReportingPage.svelte';
    
    export let data: PageData;
</script>

<ReportingPage {data} />
