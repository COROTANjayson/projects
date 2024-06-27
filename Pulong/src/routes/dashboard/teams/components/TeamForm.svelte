<script lang="ts">
	import DropdownForm from '$lib/components/DropdownForm.svelte';
	import { generateTimeIntervals, getDaysOfWeek } from '$lib/utils/formatDate';
	import { InputChip } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let form: any;
	export let errors;

	const toastStore = getToastStore();

	function isValidEmail(value: string): boolean {
		return value.includes('@') && value.includes('.');
	}

	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	function onInvalidHandler(event: any): void {
		toastStore.trigger({
			message: `"${event.detail.input}" is an invalid email or already a member. Please try again!`,
			background: 'variant-filled-error'
		});
	}

	let start_time_list = generateTimeIntervals();
	let days_of_week = getDaysOfWeek();


</script>

<div class="w-[430px] h-[450px]">
	<label class="label text-left w-full">
		<span class=" font-semibold">Team Name<span class="text-red-400">*</span></span>
		<input
			type="text"
			name="name"
			placeholder="Team Payaman"
			bind:value={$form.name}
			aria-invalid={$errors.name ? 'true' : 'false'}
			class="rounded-lg input w-full px-3 py-2 sm:leading-5 {$errors.name ? 'input-error' : ''}"
		/>
		{#if $errors.name}<span class="text-error-500 text-xs">{$errors.name}</span>{/if}
	</label>
	<div class="w-full flex justify-between">
		<label class="label text-left w-[200px]">
			<span class=" font-semibold">Start Date<span class="text-red-400">*</span></span>
			<input
				bind:value={$form.start_date}
				aria-invalid={$errors.start_date ? 'true' : 'false'}
				required
				class="input rounded-md {$errors.start_date ? 'input-error' : ''}"
				type="date"
				name="start_date"
			/>
		{#if $errors.name}<span class="text-error-500 text-xs">{$errors.start_date}</span>{/if}

		</label>
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label text-left w-[200px]">
			<span class=" font-semibold">Start time<span class="text-red-400">*</span></span>
			<DropdownForm list={start_time_list} bind:form name="start_time" target_name="start_time" />
		</label>
	</div>
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label class="label text-left w-full">
		<span class=" font-semibold"
			>Measurable Weekly Start Day<span class="text-red-400">*</span></span
		>
		<DropdownForm
			list={days_of_week}
			bind:form
			name="weekly_start_day"
			target_name="weekly_start_day"
			className="w-full"
			cardClassName="bg-blue-100 w-[400px]"
		/>
	</label>
	<label class="label text-left w-full">
		<span>Description</span>
		<textarea
			rows="4"
			name="description"
			bind:value={$form.description}
			aria-invalid={$errors.description ? 'true' : 'false'}
			class="textarea w-full px-3 py-2 sm:text-sm sm:leading-5 {$errors.description
				? 'input-error'
				: ''}"
			placeholder="A team of incredibly talented individuals who has unwavering commitment to achieving success, making them the most awesome team in the entire universe."
		/>
		{#if $errors.description}<span class="text-error-500 text-xs">{$errors.description}</span>{/if}
	</label>
	<!-- <div class="label text-left w-full">
		<span>Invite Members</span>
		<InputChip
			name="members"
			validation={isValidEmail}
			on:invalid={onInvalidHandler}
			bind:value={$form.members}
			placeholder="juan@sample.com"
			aria-invalid={$errors.members ? 'true' : 'false'}
			class="w-full px-3 py-2 sm:text-sm sm:leading-5 {$errors.description ? 'input-error' : ''}"
		/>
		{#if $errors.members?._errors}<span class="text-error-500">{$errors?.members?._errors[0]}</span
			>{/if}
	</div> -->
</div>
