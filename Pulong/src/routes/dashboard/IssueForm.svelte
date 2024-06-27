<script lang="ts">
	import { slide } from 'svelte/transition';
	import {
		IconX,
		IconPlus,
		IconExclamationCircle,
		IconTarget,
		IconNews,
		IconListCheck,
		IconChartDots2,
		IconLoader2
	} from '@tabler/icons-svelte';
	import type { PageData } from './$types';
	import { quintOut } from 'svelte/easing';
	import { sideBarRight } from '$lib/stores/sideBar';
	import { superForm } from 'sveltekit-superforms';
	import {
		editForm,
		formName,
		issueData,
		creatorName,
		relatedFrom,
		onClosForm,
		members,
		getMembers
	} from '$lib/stores/forms';
	import _ from 'lodash';
	import { onMount } from 'svelte';
	import InputDropdownForm from '$lib/components/InputDropdownForm.svelte';
	import { getIssueList, triggerToast } from '$lib/stores/ItemListstore';
	import { page } from '$app/stores';

	export let data: PageData;
	let isFormLoading = false;
	let super_form = superForm(data.issueForm, {
		onSubmit() {
			isFormLoading = true;
		},
		async onResult({ result }) {
			if (result.status === 200) {
				let res: any = result;
				let { add, update } = res.data;

				let filters: any = {
					isComplete: false
				};
				if ($page.params && $page.params.id) {
					filters.teamId = $page.params.id;
				}
				await getIssueList(filters);

				if (add) {
					triggerToast('add', 'Added new issue');
				} else if (update) {
					triggerToast('update', 'Updated a issue item');
				}

				isFormLoading = false;
				sideBarRight.set(false);
				formName.set('');
				editForm.set(false);
				issueData.set(undefined);
			}
		},
		applyAction: false,
		invalidateAll: true,
		resetForm: true,
		dataType: 'json'
	});
	const { form, enhance, reset } = super_form;

	$: {
		if ($issueData && $editForm) {
			form.set($issueData);
		} else if ($relatedFrom) {
			let relateFrom = { ...$relatedFrom };
			delete relateFrom.name;
			form.set({
				...data.issueForm.data,
				...relateFrom
			});
		} else {
			form.set(data.issueForm.data);
		}
	}
	$: {
		if ($form.teamId) {
			getMembers($form.teamId);
		}
	}
	let teams = data.teams ? data.teams : [];
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
		onClosForm();
		reset();
	}
</script>

<div class="fixed inset-y-0 top-0 right-0 z-20 flex h-full">
	{#if $sideBarRight && $formName === 'Issue'}
		<div
			transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
			class={` h-full transition-all   bg-white  ${$sideBarRight ? 'w-[415px]' : 'w-0'} `}
		>
			<form
				use:enhance
				method="POST"
				class="h-full relative flex flex-col"
				action={$editForm ? '/dashboard/issues?/edit' : '/dashboard/issues?/add'}
			>
				<div class="sticky inset-x-0 top-0 border-b flex justify-between px-6 py-7 text-gray-900">
					<div class="space-y-1">
						{#if $editForm}
							<p class="text-sm text-gray-700 font-medium">{$formName}</p>
							<h1 class="text-gray-900 text-xl">{$issueData.name}</h1>
						{:else}
							<h1 class="text-gray-900">{'New'} {$formName}</h1>
						{/if}
						{#if $relatedFrom}
							<div class="text-gray-500 flex items-center gap-1">
								{#if $relatedFrom.goalId}
									<IconTarget size={20} />
								{:else if $relatedFrom.headlineId}
									<IconNews size={20} />
								{:else if $relatedFrom.issueId}
									<IconExclamationCircle size={20} />
								{:else if $relatedFrom.todoId}
									<IconListCheck size={20} />
								{:else if $relatedFrom.kpiId}
									<IconChartDots2 size={20} />
								{/if}
								<p class="text-sm font-medium">From {$relatedFrom.name}</p>
							</div>
						{:else if $creatorName}
							<p class="text-xs text-gray-700">Created by {$creatorName}</p>
						{/if}
					</div>
					<div></div>

					<button type="button" on:click={close}>
						<IconX size={25} />
					</button>
				</div>

				<div class="px-6 py-7 flex-1 overflow-y-auto">
					<div class="space-y-7">
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
							<InputDropdownForm list={teams} bind:super_form name="teamId" target_name="issue" />
						</label>
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label class="label flex flex-col">
							<span class="text-gray-700 font-semibold"
								>Owner <span class="text-red-400">*</span>
							</span>
							<InputDropdownForm
								list={$members}
								bind:super_form
								name="ownerId"
								target_name="issue"
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
