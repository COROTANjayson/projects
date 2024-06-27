<script lang="ts">
	import { getToastStore, Toast } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';

	import type { PageData } from './$types';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

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
</script>

<Toast />
<div class="min-h-screen flex items-center justify-cente">
	<div class="max-w-md w-full mx-auto p-8shadow-md rounded-md">
		<h2 class="text-2xl font-bold mb-4">Forgot Password</h2>
		<form method="POST" use:enhance>
			<div class="mb-4">
				<label class="label">
					<span>Email</span>
					<input
						id="email"
						name="email"
						type="text"
						placeholder="juan@sample.com"
						bind:value={$form.email}
						aria-invalid={$errors.email ? 'true' : 'false'}
						class="input w-full px-3 py-2 sm:text-sm sm:leading-5 {$errors.email
							? 'input-error'
							: ''}"
					/>
					{#if $errors.email}<span class="text-error-500">{$errors.email}</span>{/if}
				</label>
			</div>
			<button type="submit" class="w-full py-2 px-4 btn variant-filled-primary">Send</button>
		</form>
	</div>
</div>
