<script lang="ts">
	import { slide } from 'svelte/transition';
	import { IconX, IconPlus, IconLoader2 } from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import { quintOut } from 'svelte/easing';
	import { sideBarRight } from '$lib/stores/sideBar';
	import { superForm } from 'sveltekit-superforms';
	import {
		creatorName,
		editForm,
		formName,
		getMembers,
		goalsData,
		members
	} from '$lib/stores/forms';
	import _ from 'lodash';
	import InputDropdownForm from '$lib/components/InputDropdownForm.svelte';
	import { getGoalList, triggerToast } from '$lib/stores/ItemListstore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data: PageData;
	let isFormLoading = false;
	let teams = data.teams ? data.teams : [];

	let super_form = superForm(data.goalForm, {
		onSubmit() {
			isFormLoading = true;
		},
		async onResult({ result }) {
			if (result.status === 200) {
				let res: any = result;
				let { add, update } = res.data;

				if ($page.params && $page.params.id) {
					let filters = {
						teamId: $page.params.id
					};
					await getGoalList(filters);
				} else {
					await getGoalList();
				}

				if (add) {
					triggerToast('add', 'Added new goal');
				} else if (update) {
					triggerToast('update', 'Updated a goal item');
				}

				isFormLoading = false;
				sideBarRight.set(false);
				formName.set('');
				editForm.set(false);
				goalsData.set(undefined);
			}
		},
		applyAction: false,
		invalidateAll: true,
		resetForm: true,
		dataType: 'json'
	});
	const { form, enhance, reset } = super_form;

	$: {
		if ($goalsData && $editForm) {
			form.set($goalsData);
		} else {
			goalsData.set(undefined);
			reset();
			form.set(data.goalForm.data);
		}
	}
	$: {
		if ($form.teamId) {
			getMembers($form.teamId);
		}
	}

	onMount(() => {
		setTeamIdInTeamDetail();
	});
	const setTeamIdInTeamDetail = () => {
		if ($page.params && $page.params.id) {
			form.set({
				...$form,
				teamId: $page.params.id
			});
		}
	};
	function close() {
		formName.set('');
		sideBarRight.set(false);
		editForm.set(false);
		goalsData.set(undefined);
		reset();
	}
</script>

<div class="fixed inset-y-0 top-0 right-0 z-20 flex h-full">
	{#if $sideBarRight && $formName === 'Goal'}
		<div
			transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
			class={` h-full transition-all   bg-white  ${$sideBarRight ? 'w-[415px]' : 'w-0'} `}
		>
			<form
				use:enhance
				method="POST"
				class="h-full relative flex flex-col"
				action={$editForm ? '/dashboard/goals?/edit' : '/dashboard/goals?/add'}
			>
				<div
					class=" sticky inset-x-0 top-0 border-b flex justify-between px-6 py-7 dark:text-black"
				>
					{#if $editForm}
						<div class="space-y-1">
							<p class="text-sm text-gray-700 font-medium">{$formName}</p>
							<h1 class="text-gray-900 text-xl">{$goalsData.name}</h1>
							<p class="text-xs text-gray-700">Created by {$creatorName}</p>
						</div>
					{:else}
						<h1>{$editForm ? 'Edit ' : 'New'} {$formName}</h1>
					{/if}

					<button type="button" on:click={close}>
						<IconX size={25} />
					</button>
				</div>

				<div class="px-6 py-7 flex-1 overflow-y-auto">
					<div class="space-y-7">
						<!-- <input
							bind:value={$form.id}
							required
							class="hidden"
							type="text"
							name="id"
							placeholder={'Enter Name'}
						/> -->
						<label class="label">
							<span class="text-gray-700 font-semibold"
								>Name<span class="text-red-400">*</span></span
							>
							<input
								bind:value={$form.name}
								required
								class="input bg-white dark:bg-white rounded-md dark:text-black"
								type="text"
								name="name"
								placeholder={'Enter Name'}
							/>
						</label>

						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="label flex flex-col">
							<span class="text-gray-700 font-semibold"
								>Team <span class="text-red-400">*</span>
							</span>
							<InputDropdownForm list={teams} bind:super_form name="teamId" target_name="goal" />
						</label>
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="label flex flex-col">
							<span class="text-gray-700 font-semibold"
								>Owner <span class="text-red-400">*</span>
							</span>
							<InputDropdownForm
								bind:list={$members}
								bind:super_form
								name="ownerId"
								target_name="goal"
							/>
						</label>
						<label class="label">
							<span class="text-gray-700 font-semibold"
								>Due Date<span class="text-red-400">*</span></span
							>
							<input
								bind:value={$form.dueDate}
								required
								class="input bg-white dark:bg-white rounded-md dark:text-black"
								type="date"
								name="due_date"
							/>
						</label>
						<label class="label">
							<span class="text-gray-700 font-semibold">Notes </span>
							<textarea
								bind:value={$form.notes}
								name="notes"
								class="textarea dark:bg-white bg-white rounded-md dark:text-black"
								rows="4"
								placeholder="Notes"
							/>
						</label>
					</div>
				</div>
				{#if $editForm}
					<div
						class="text-gray-700 sticky inset-x-0 bottom-0 right-0 border-b flex justify-center px-6 py-7"
					>
						<button
							disabled={isFormLoading}
							type="submit"
							class="btn bg-primary-500 text-white w-full"
						>
							{#if isFormLoading}
								<span><IconLoader2 class="animate-spin" size={20} /></span>
							{/if}
							<span class="text-xl">Save</span>
						</button>
					</div>
				{:else}
					<div
						class="text-gray-700 sticky inset-x-0 bottom-0 right-0 border-b flex justify-center px-6 py-7"
					>
						<button
							disabled={isFormLoading}
							type="submit"
							class="btn bg-primary-500 text-white w-full"
						>
							{#if isFormLoading}
								<span><IconLoader2 class="animate-spin" size={20} /></span>
							{/if}
							<span class="text-xl">Add</span>
							<span><IconPlus size={25} /></span>
						</button>
					</div>
				{/if}
			</form>
		</div>
	{/if}
</div>
