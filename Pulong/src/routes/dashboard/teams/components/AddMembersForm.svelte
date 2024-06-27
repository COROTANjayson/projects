<script lang="ts">
	import { enhance } from '$app/forms';
	import { Avatar, InputChip } from '@skeletonlabs/skeleton';
	import { getToastStore } from '@skeletonlabs/skeleton';

	export let form: any;
	export let errors;
	export let data: any;
	const toastStore = getToastStore();
	function isValidEmail(value: string): boolean {
		return value.includes('@') && value.includes('.');
	}
	let selectedRemoveMember: string;

	// eslint-disable-next-line  @typescript-eslint/no-explicit-any
	function onInvalidHandler(event: any): void {
		toastStore.trigger({
			message: `"${event.detail.input}" is an invalid email or already a member. Please try again!`,
			background: 'variant-filled-error'
		});
	}

	function onRemoveMember(email: string) {
		selectedRemoveMember = email;
	}
	$: members = data.members || [];
</script>

<div class="w-[430px] h-[450px]">
	<div class="label text-left w-full">
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
	</div>
	{#if data.members}
		<form action="?/removeMember" method="POST" use:enhance>
			<div class="space-y-5 text-center flex flex-col items-center">
				<input type="hidden" name="selectedRemoveMember" value={selectedRemoveMember} />
				<h2 class="h4">Members</h2>
				{#each members as member}
					<div class="card p-2 flex items-center justify-between gap-1 w-full">
						<div class="flex gap-3">
							<Avatar width="w-10" initials={member.name || ''} background="bg-primary-500" />
							<div class="flex flex-col items-start">
								<p>{member.name}</p>

								<p class="text-xs">{member.email}</p>
							</div>
						</div>

						<p class="text-sm">{member.isAccepted ? 'Accepted' : 'Not Accepted'}</p>

						<button
							name="removeMember"
							value="true"
							class="btn btn-sm variant-filled-error"
							on:click={() => {
								onRemoveMember(member.email);
							}}>Remove</button
						>
					</div>
				{/each}
			</div>
		</form>
	{/if}
</div>
