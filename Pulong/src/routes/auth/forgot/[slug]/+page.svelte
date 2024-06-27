<script lang="ts">
	import { getToastStore, Toast } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';

	import type { PageData } from './$types';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import PasswordInput from '$lib/components/PasswordInput.svelte';

	export let data: PageData;

	const { form, errors, enhance, message } = superForm(data.form);

	const toastStore = getToastStore();

	message.subscribe((value) => {
		if (value) {
			const t: ToastSettings = {
				message: value
			};
			toastStore.trigger(t);
			if (browser) {
				goto('/auth/signin');
			}
		}
	});
	if (data.error) {
		const t: ToastSettings = {
			message: data.error
		};
		toastStore.trigger(t);
		if (browser) {
			goto('/auth/forgot');
		}
	}
</script>

<Toast />
<div class="min-h-screen flex items-center justify-cente">
	<div class="max-w-md w-full mx-auto p-8shadow-md rounded-md">
		<h2 class="text-2xl font-bold mb-4">Change Password</h2>
		<form method="POST" use:enhance>
			<div class="mb-4">
				<div class="mb-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<span>New Password</span>
						<div class="input-group input-group-divider grid-cols-[1fr_auto]">
							<PasswordInput id="password" bind:value={$form.password} />
						</div>
						{#if $errors.password}<span class="text-error-500">{$errors.password}</span>{/if}
					</label>
				</div>
				<div class="mb-4">
					<!-- svelte-ignore a11y-label-has-associated-control -->
					<label class="label">
						<span>Confirm New Password</span>
						<div class="input-group input-group-divider grid-cols-[1fr_auto]">
							<PasswordInput id="confirmPassword" bind:value={$form.confirmPassword} />
						</div>
						{#if $errors.confirmPassword}<span class="text-error-500"
								>{$errors.confirmPassword}</span
							>{/if}
					</label>
				</div>
				<button type="submit" class="w-full py-2 px-4 btn variant-filled-primary">Send</button>
			</div>
		</form>
	</div>
</div>
