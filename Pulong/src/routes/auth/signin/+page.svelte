<script lang="ts">
	import { Toast } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms';

	import type { PageData } from './$types';

	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import { IconLoader2 } from '@tabler/icons-svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	let isFormLoading = false;

	const { form, errors, enhance } = superForm(data.form, {
		onSubmit() {
			isFormLoading = true;
		},
		async onResult({ result }) {
			let res:any = result
			if (result && res.data.success) {
				goto('/dashboard');
			}
			isFormLoading = false;
		},
		applyAction: false,
		invalidateAll: false,
		resetForm: true,
		dataType: 'json'
	});
</script>

<Toast />
<div class="min-h-screen flex items-center justify-center">
	<div class="max-w-md w-full mx-auto p-8shadow-md rounded-md">
		<h2 class="text-2xl font-bold mb-4">Sign In</h2>
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
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Password</span>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<PasswordInput id="password" bind:value={$form.password} />
					</div>
					{#if $errors.password}<span class="text-error-500">{$errors.password}</span>{/if}
				</label>
			</div>
			<div class="flex justify-end mb-2">
				<a href="/auth/forgot" class="text-secondary-50 hover:underline">Forgot Password?</a>
			</div>
			<button
				disabled={isFormLoading}
				type="submit"
				class="w-full py-2 px-4 btn variant-filled-primary"
			>
				{#if isFormLoading}
					<IconLoader2 class=" animate-spin " size={20} />
				{/if}
				<p>Sign In</p>
			</button>
			<div class="flex justify-center mt-2">
				<span class="text-tertiary-500 mr-2">Don't have an account?</span>
				<a href="/auth/signup" class="text-secondary-50 hover:underline">Create an account</a>
			</div>
		</form>
	</div>
</div>
