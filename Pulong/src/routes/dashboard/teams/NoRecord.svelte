<script>
	import { IconUsersPlus } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<IconUsersPlus size={130} />
	<h2 class="h2">No Teams Exist</h2>
	<div class="pt-5">
		<a
			href="/dashboard/teams/add"
			class="btn variant-ghost-primary"
			data-sveltekit-preload-data="hover">Create Team</a
		>
	</div>
</div>
