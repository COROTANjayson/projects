<script lang="ts">
	import { AppBar, Toast, Modal, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import type { PopupSettings, ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import type { PageData, ActionData } from './$types';

	import SignOutForm from '$lib/components/SignOut.svelte';
	import { sideBarStore, sideBarRight } from '$lib/stores/sideBar';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import RightSidebar from '../../dashboard/RightSidebar.svelte';
	import LeftSideBarMeeting from './LeftSideBarMeeting.svelte';
	export let data: PageData;
	import { selectedAgenda } from '$lib/stores/meetingStore';

	// let sideBar = false;
	// const toastStore = getToastStore();
	// const modalStore = getModalStore();

	// const popupFeatured: PopupSettings = {
	// 	event: 'click',
	// 	target: 'popupFeatured',
	// 	placement: 'bottom'
	// };

	// sideBarStore.subscribe((value) => {
	// 	sideBar = value;
	// });
	// function sideBarToggle() {
	// 	sideBar = !sideBar;
	// 	sideBarStore.set(sideBar);
	// }
</script>

<Toast />
<Modal />

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<div class="ml-60">
					<p class="uppercase text-xl w-36">
						{$selectedAgenda}
					</p>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="px-5">
					<LightSwitch />
				</div>

				<div>
					<div class="w-14"></div>
					{#if $sideBarRight}
						<div
							transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
							class={` w-[471px]`}
						/>
					{/if}
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<div class=" w-60">
			<LeftSideBarMeeting {data} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="sidebarRight">
		<div>
			<div class="w-14"></div>
			{#if $sideBarRight}
				<div
					transition:slide={{ duration: 300, easing: quintOut, axis: 'x' }}
					class={` w-[471px]`}
				/>
			{/if}
		</div>
		<RightSidebar {data} />
	</svelte:fragment>
	<div class="relative">
		<slot></slot>
	</div>
</AppShell>

<style>
	.page {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
</style>
