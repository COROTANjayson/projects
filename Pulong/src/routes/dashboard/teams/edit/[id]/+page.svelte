<script lang="ts">
	import { getToastStore, Toast } from '@skeletonlabs/skeleton';
	import { superForm, superValidate } from 'sveltekit-superforms';
	import SuperDebug from 'sveltekit-superforms';

	import TeamForm from '../../components/TeamForm.svelte';

	import type { PageData } from './$types';
	import { pageForm } from '$lib/stores/team';
	import AgendaForm from '../../components/AgendaForm.svelte';
	import AddMembersForm from '../../components/AddMembersForm.svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { teamSchema } from '$lib/schema/team';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const toastStore = getToastStore();

	let selectedRemoveMember: string;
	$: members = data.members || [];
	// @ts-expect-error - We're going to remove the members from the team object
	const { form, errors, enhance, message } = superForm(data.form, {
		onResult({ result }) {
			if (result.status === 200) {
				pageForm.set(1);
				goto('/dashboard/teams');
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

	function onRemoveMember(email: string) {
		selectedRemoveMember = email;
	}
	const validateForm = async () => {
		try {
			const superForm = await superValidate($form, zod(teamSchema));
			errors.set(superForm.errors);
			if (!$errors.name && !$errors.description && !$errors.start_date) pageForm.set($pageForm + 1);
		} catch (error) {
			console.log(error);
		}
	};
</script>

<!-- <Toast /> -->
<!-- <SuperDebug data={$form} /> -->

<div class="container h-full mx-auto flex justify-center items-center py-5">
	<form method="POST" action="?/editTeam" use:enhance>
		<div class="space-y-5 text-center flex flex-col items-center">
			{#if $pageForm === 1}
				<h2 class="h2">Edit Team</h2>
				<TeamForm {form} {errors} />
			{:else if $pageForm === 2}
				<h2 class="h2">Agenda</h2>
				<AgendaForm {form} {errors} />
			{:else if $pageForm === 3}
				<h2 class="h2">Add Members</h2>
				<AddMembersForm {form} {errors} {data} />
			{/if}
			<!-- <button type="submit" class="btn variant-filled-primary">Update Team</button> -->
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
						>Update Team</button
					>
				{/if}
			</div>
		</div>
	</form>
	<!-- <form action="?/removeMember" method="POST" use:enhance>
		<div class="space-y-5 text-center flex flex-col items-center">
			<input type="hidden" name="selectedRemoveMember" value={selectedRemoveMember} />
			<h2 class="h4">Members</h2>
			{#each members as member}
				<div class="flex items-center justify-between">
					<p>{member.email}</p>
					<p>{member.name}</p>
					<p>{member.isAccepted}</p>

					<button
						name="removeMember"
						value="true"
						class="btn variant-filled-error"
						on:click={() => {
							onRemoveMember(member.email);
						}}>Remove</button
					>
				</div>
			{/each}
		</div>
	</form> -->
</div>
