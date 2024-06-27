<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import type { PageData } from './$types';

	import PasswordInput from '$lib/components/PasswordInput.svelte';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form);
</script>

<div class="min-h-screen flex items-center justify-cente">
	<div class="max-w-md w-full mx-auto p-8shadow-md rounded-md">
		<h2 class="text-2xl font-bold mb-4">Sign Up</h2>
		<form method="POST" use:enhance>
			<div class="mb-4">
				<label class="label">
					<span>Name</span>
					<input
						id="name"
						name="name"
						type="text"
						placeholder="Juan Cruz"
						bind:value={$form.name}
						aria-invalid={$errors.name ? 'true' : 'false'}
						class="input w-full px-3 py-2 sm:text-sm sm:leading-5 {$errors.name
							? 'input-error'
							: ''}"
					/>
					{#if $errors.name}<span class="text-error-500">{$errors.name}</span>{/if}
				</label>
			</div>
			<div class="mb-4">
				<label class="label">
					<span>Email</span>
					<input
						id="email"
						name="email"
						type="text"
						placeholder="juan@test.com"
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
			<div class="mb-4">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="label">
					<span>Confirm Password</span>
					<div class="input-group input-group-divider grid-cols-[1fr_auto]">
						<PasswordInput id="confirmPassword" bind:value={$form.confirmPassword} />
					</div>
					{#if $errors.confirmPassword}<span class="text-error-500">{$errors.confirmPassword}</span
						>{/if}
				</label>
			</div>

			<button type="submit" class="w-full py-2 px-4 btn variant-filled-primary">Sign Up</button>
			<div class="flex justify-center mt-2">
				<span class="text-tertiary-500 mr-2">Already have an account?</span>
				<a href="/auth/signin" class="text-secondary-50 hover:underline">Sign In</a>
			</div>
		</form>
	</div>
</div>
