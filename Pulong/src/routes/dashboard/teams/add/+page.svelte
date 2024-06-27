<script lang="ts">
	import { getToastStore, Toast } from '@skeletonlabs/skeleton';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import type { PageData } from './$types';
	import TeamForm from './../components/TeamForm.svelte';
	import AgendaForm from '../components/AgendaForm.svelte';
	import { pageForm } from '$lib/stores/team';
	import AddMembersForm from '../components/AddMembersForm.svelte';
	import { teamSchema } from '$lib/schema/team';
	import { zod } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const toastStore = getToastStore();
	const { form, errors, enhance, message } = superForm(data.form, {
		onResult({ result }) {
			if (result.status === 200) {
				let res: any = result;
				let { team } = res.data;
				pageForm.set(1);
				goto(`/dashboard/teams/details/${team.id}`);
			}
		},
		applyAction: false,
		invalidateAll: false,
		resetForm: true,
		dataType: 'json'
	});

	message.subscribe((message) => {
		if (message) {
			toastStore.trigger({
				message,
				background: 'variant-filled-error'
			});
		}
	});
	const validateForm = async () => {
		try {
			const superForm = await superValidate($form, zod(teamSchema));
			errors.set(superForm.errors);
			if (!$errors.name && !$errors.description && !$errors.start_date) pageForm.set($pageForm + 1);
		} catch (error) {
			console.log(error);
		}
	};
	// const validateForm = () => {
	// 	try {
	// 		// Parse form data using the schema
	// 		teamSchema.parse($form);
	// 		// Clear errors if validation is successful
	// 		// errors.set([]);
	// 		// You can perform further actions here if needed
	// 		console.log('Validation successful', $form);
	// 	} catch (err: any) {
	// 		// Set errors if validation fails
	// 		console.log(err.errors)
	// 		errors.set(err.errors);
	// 	}
	// };
</script>

<!-- <Toast /> -->
<!-- <SuperDebug data={$form} /> -->

<div class="container h-full mx-auto flex justify-center items-center py-5">
	<form method="POST" action="?/addTeam" use:enhance>
		<div class="space-y-5 text-center flex flex-col items-center">
			{#if $pageForm === 1}
				<h2 class="h2">New Team</h2>
				<TeamForm {form} {errors} />
			{:else if $pageForm === 2}
				<h2 class="h2">Agenda</h2>
				<AgendaForm {form} {errors} />
			{:else if $pageForm === 3}
				<h2 class="h2">Add Members</h2>
				<AddMembersForm {form} {errors} {data} />
			{/if}

			<div class="flex w-full gap-4 transition-all">
				<div class={`w-full  h-3 ${$pageForm === 1 ? 'bg-yellow-500' : 'variant-soft-surface'}`} />
				<div class={`w-full  h-3 ${$pageForm === 2 ? 'bg-yellow-500' : 'variant-soft-surface'}`} />
				<div class={`w-full  h-3 ${$pageForm === 3 ? 'bg-yellow-500' : 'variant-soft-surface'}`} />
			</div>
			<div class="flex gap-2 w-full">
				{#if $pageForm > 1}
					<button
						on:click={() => {
							pageForm.set($pageForm - 1);
						}}
						type="button"
						class="btn variant-soft-surface rounded-md w-[200px] font-medium"
						>Back
					</button>
				{/if}

				{#if $pageForm < 3}
					<button
						on:click={() => {
							validateForm();
							// pageForm.set($pageForm + 1);
						}}
						type="button"
						class="btn variant-filled-surface rounded-md w-full font-medium"
						>Next
					</button>
				{:else}
					<button type="submit" class="btn variant-filled-surface rounded-md w-full font-mediumy"
						>Save</button
					>
				{/if}
			</div>
		</div>
	</form>
</div>
