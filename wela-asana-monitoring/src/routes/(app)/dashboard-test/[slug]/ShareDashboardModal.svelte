<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { dashboard_details, isShareOpen } from '$lib/store/reportingStore';
	import axios from 'axios';
	import { PUBLIC_URL } from '$env/static/public';
	import { clickOutside } from '$lib/utils/clickOutside';
	import _ from 'lodash';
	// import { getInitials } from '$lib/utils/stringUtils';

	export let data: PageData;
	let details: { name: any; description?: any } = {
		name: '',
		description: ''
	};
	onMount(() => {
		details = {
			name: $dashboard_details.name,
			description: $dashboard_details.description ? $dashboard_details.description : ''
		};
	});
	const handleClickOutside = (event: any) => {
		const modal: any = document.getElementById('share-dashboard');
		const outside = document.getElementById('share-outside');

		if (
			$isShareOpen &&
			!modal.contains(event.target) &&
			outside &&
			outside.contains(event.target)
		) {
			isShareOpen.set(false);
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		// Listen for clicks outside the dropdown to close it
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	let isSaving = false;
	let searchInput: string = '';

	let isFocused: boolean;
	let isDropdown: boolean;
	function handleFocus() {
		isFocused = true;
		isDropdown = true;
	}
	function handleBlur() {
		isFocused = false;
		isDropdown = false;
	}
	const handleClick = () => {
		const elem: any = document.activeElement;
		if (elem) {
			elem?.blur();
		}
	};
	let memberFilterArray: string | any[] = [];
	let membersList: any[] = [];
	let memberInput: any = {};

	onMount(() => {
		memberFilterArray = data.allUsers;
		let owner = _.find(data.allUsers, { gid: $dashboard_details.owner.toString() });
		if (owner) {
			owner.is_owner = true;
			// membersList = [owner, ...membersList];
		}
		membersList = $dashboard_details.members ? $dashboard_details.members : [owner];
	});
	let isAdding = false;
	const fetchDashboard = async () => {
		const response: any = await axios.get(PUBLIC_URL + `/reports/${$dashboard_details.id}`);
		let res = response.data;
		if (res.success) {
			dashboard_details.set(res.data);
		}
	};
	const addMember = async () => {
		isAdding = true;
		let removeOwner;
		let members = [...membersList, memberInput];
		let members_ids = members.map((val: any) => val.gid);
		let data = {
			...$dashboard_details,
			members,
			members_ids
		};
		const response: any = await axios.put(PUBLIC_URL + `/reports/${data.id}`, {
			...data
		});
		const result = response.data;

		if (result.success) {
			await fetchDashboard();
			membersList = members;
			memberInput = {};
		}

		isAdding = false;
	};
	let isRemoving = false;
	const removeMember = async (value: any) => {
		isRemoving = true;
		let members = membersList.filter((val: any) => val.gid !== value.gid);
		let members_ids = members.map((val: any) => val.gid);
		let data = {
			...$dashboard_details,
			members,
			members_ids
		};
		const response: any = await axios.put(PUBLIC_URL + `/reports/${data.id}`, {
			...data
		});
		const result = response.data;
		if (result.success) {
			await fetchDashboard();
			membersList = members;
			// memberInput = {};
		}
		isRemoving = false;
	};
	export const searchMember = (searchInput: string) => {
		if (memberInput.name === '' || !memberInput.name) {
			memberFilterArray = data.allUsers;
		} else {
			const filteredArray = data.allUsers.filter((item: { name: string }) =>
				item.name.toLowerCase().includes(memberInput.name.toLowerCase())
			);
			memberFilterArray = filteredArray;
		}
	};
	const initials = (name: string) => {
		// Remove leading and trailing whitespaces and split the string into words
		const words = name.trim().split(' ');

		// Retrieve the first letter of the first word
		const firstLetterFirstWord = words[0][0];

		// Retrieve the first letter of the last word
		const lastWordIndex = words.length - 1;
		const firstLetterLastWord = words[lastWordIndex][0];

		return firstLetterFirstWord + firstLetterLastWord;
	};
</script>

<div
	id="share-outside"
	class="fixed z-40 top-0 left-0 w-full h-full flex justify-center items-center sm:bg-black sm:bg-opacity-50 sm:backdrop-blur-sm"
>
	<div
		id="share-dashboard"
		class="flex flex-col rounded-md overflow-y-auto relative h-[500px] w-[50%] bg-white sm:shadow-md"
	>
		<div class="flex justify-between items-center px-6 py-4">
			<h1 class="text-xl font-semibold">Share {$dashboard_details.name}</h1>
			<button
				on:click={() => {
					isShareOpen.set(false);
				}}
				class=" right-0 mx-3 my-2"
			>
				<img src="/x.svg" alt="" />
			</button>
		</div>
		<div class="w-full border-b-2" />
		<div class="px-6 py-6 grow space-y-2">
			<div class="flex items-center gap-2">
				<div class="relative w-full">
					<input
						on:focus={handleFocus}
						on:blur={() => {
							isFocused = false;
						}}
						bind:value={memberInput.name}
						on:input={() => {
							searchMember(memberInput.name);
						}}
						type="text"
						class=" border border-gray-500 text-md w-full rounded p-2"
					/>
					{#if isDropdown}
						<div
							use:clickOutside={() => {
								if (!isFocused && isDropdown) {
									handleBlur();
								}
							}}
							class={`absolute rounded left-0 border bg-white p-2 flex flex-col  overflow-y-auto z-30 w-full
						${memberFilterArray.length <= 4 ? '' : 'h-[250px]'}
						`}
						>
							{#if memberFilterArray.length > 0}
								{#each memberFilterArray as assignee}
									<button
										on:click={() => {
											// addToAssignees(assignee);

											memberInput = assignee;
											handleBlur();
										}}
										class="flex justify-start hover:bg-gray-50 px-2 py-2 text-left"
									>
										<div class="flex items-center gap-2">
											{#if assignee.photo && assignee.photo.image_36x36 !== null}
												<img
													src={assignee.photo.image_36x36}
													width="30"
													alt=""
													class="rounded-full"
												/>
											{:else}
												<div
													class="rounded-full w-[30px] h-[30px] bg-gray-400 flex items-center justify-center"
												>
													<p class="text-white text-sm font-medium">{initials(assignee.name)}</p>
												</div>
											{/if}
											<div class="flex flex-col justify-start items-start">
												<p class="text-sm">{assignee.name}</p>
												<p class="text-xs text-gray-600">{assignee.email}</p>
											</div>
										</div>
									</button>
								{/each}
							{:else}
								<div class="w-full">No matches found</div>
							{/if}
						</div>
					{/if}
				</div>
				<button
					disabled={isAdding}
					on:click={() => {
						addMember();
					}}
					class="btn btn-sm border-none rounded-md bg-blue-400 hover:bg-blue-500"
				>
					<p class="text-white text-sm">Add</p>
				</button>
			</div>

			<div class="">
				<h3 class="font-semibold text-xl">Members ({membersList.length})</h3>
				{#each membersList as member}
					<div class="flex justify-start px-2 py-2 text-left w-full">
						<div class="flex items-center justify-between gap-2 w-full">
							<div class="flex items-center gap-2">
								{#if member.photo && member.photo.image_36x36 !== null}
									<img src={member.photo.image_36x36} width="30" alt="" class="rounded-full" />
								{:else}
									<div
										class="rounded-full w-[30px] h-[30px] bg-gray-400 flex items-center justify-center"
									>
										<p class="text-white text-sm font-medium">{initials(member.name)}</p>
									</div>
								{/if}
								<div class="flex flex-col justify-start items-start">
									<p class="text-sm">{member.name}</p>
									<p class="text-xs text-gray-600">{member.email}</p>
								</div>
							</div>
							<div class={`dropdown dropdown-end`}>
								<div tabindex="0" role="button" class="  hover: flex items-end">
									{#if member.is_owner}
										<p class="text-base">Owner</p>
									{:else}
										<p class="text-base">Member</p>
									{/if}
									<img src="/arrow-down.svg" alt="" width="20" />
								</div>
								<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
								<div
									tabindex="0"
									class="dropdown-content z-[1] menu py-2 px-3 shadow w-36 border text-red-600 bg-white rounded"
								>
									{#if !member.is_owner}
										<button
											class=" flex"
											on:click={() => {
												removeMember(member);
												handleClick();
											}}><p>Remove member</p></button
										>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="w-full border-b-2" />

		<div class="flex justify-end items-center px-6 py-4 gap-3">
			<button
				on:click={() => {
					isShareOpen.set(false);
				}}
				class="text-sm right-0 px-3 py-2 border border-slate-700 rounded-md"
			>
				Cancel
			</button>
			<!-- <button
				disabled={isSaving}
				on:click={saveChange}
				class="text-sm text-white right-0 px-3 py-2 border bg-blue-500 rounded-md"
			>
				{isSaving ? '...Saving' : 'Save Changes'}
			</button> -->
		</div>
	</div>
</div>
