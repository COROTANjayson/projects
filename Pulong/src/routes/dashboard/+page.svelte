<script lang="ts">
	import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

	import type { PageData, ActionData } from './$types';

	import ConfirmEmailAlert from '$lib/components/ConfirmEmailAlert.svelte';

	export let data: PageData;
	export let form: ActionData;

	const toastStore = getToastStore();

	$: if (form?.message) {
		const t: ToastSettings = {
			message: form.message
		};
		toastStore.trigger(t);
	}
</script>

{#if !data.user.isEmailVerified}
	<ConfirmEmailAlert />
{/if}
