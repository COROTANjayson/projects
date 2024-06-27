<script lang="ts">
	import {
		AppBar,
		AppRail,
		AppRailTile,
		Avatar,
		getToastStore,
		getModalStore,
		Toast,
		popup,
		Modal,
		AppShell,
		LightSwitch,
		AppRailAnchor
	} from '@skeletonlabs/skeleton';
	import { slide } from 'svelte/transition';
	import type {
		ToastSettings,
		PopupSettings,
		ModalSettings,
		ModalComponent
	} from '@skeletonlabs/skeleton';
	import {
		IconMenu2,
		IconX,
		IconDashboard,
		IconUsersGroup,
		IconChartDots2,
		IconTarget,
		IconNews,
		IconListCheck,
		IconExclamationCircle,
		IconBlob
	} from '@tabler/icons-svelte';

	import { page } from '$app/stores';
	import type { PageData, ActionData } from './$types';

	import SignOutForm from '$lib/components/SignOut.svelte';
	import LoadingSkeleton from '$lib/components/LoadingSkeleton.svelte';

	import { sideBarStore, sideBarRight, sideBarMenu } from '$lib/stores/sideBar';
	import { quintOut } from 'svelte/easing';
	import RightSidebar from './RightSidebar.svelte';
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { toast } from '$lib/stores/ItemListstore';
	import { teamsStore } from '$lib/stores/forms';
	import { navigating } from '$app/stores';
	import FullPageLoading from '$lib/components/FullPageLoading.svelte';

	export let data: PageData;
	export let form: ActionData;

	let sideBar = false;

	const toastStore = getToastStore();
	const modalStore = getModalStore();

	onMount(async () => {
		// let resp = await axios.get(`/api/pulse`);
		toast.set(toastStore);
		teamsStore.set(data.teams);
	});
	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'bottom'
	};

	$: if (form?.message) {
		const t: ToastSettings = {
			message: form.message
		};
		toastStore.trigger(t);
	}
	sideBarStore.subscribe((value) => {
		sideBar = value;
	});
	function sideBarToggle() {
		sideBar = !sideBar;
		sideBarStore.set(sideBar);
	}

	function onSignOut() {
		const c: ModalComponent = { ref: SignOutForm };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			body: 'Are you sure you want to sign out?',
			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
	let teamExist = data.teams.length > 0;

	$: navigateTo = $navigating ? $navigating.to?.route.id : null;
</script>

<Toast />
<Modal />
<div class="card p-4 w-72 shadow-xl z-50" data-popup="popupFeatured">
	<div><h1>{data.user.name}</h1></div>
	<div><h6>{data.user.email}</h6></div>
	<div class="pt-4">
		<button class="btn variant-ghost-primary">Settings</button>
	</div>
	<div class="pt-2">
		<button class="btn variant-ghost-tertiary" on:click={onSignOut}>Sign out</button>
	</div>
	<div class="arrow bg-surface-100-800-token" />
</div>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				{#if $sideBarMenu}
					<button on:click={sideBarToggle}>
						{#if sideBar}
							<IconX size={30} />
						{:else}
							<IconMenu2 size={30} />
						{/if}
					</button>
				{/if}
			</svelte:fragment>
			<h3>Pulong v.1</h3>
			<svelte:fragment slot="trail">
				<div class="px-5">
					<LightSwitch />
				</div>
				<button use:popup={popupFeatured}>
					<Avatar initials={data.user.name || ''} background="bg-primary-500" />
				</button>
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
		{#if sideBar}
			<AppRail>
				<AppRailAnchor
					href="/dashboard/analytics"
					selected={$page.url.pathname === '/dashboard/analytics'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconDashboard size={35} />
					</svelte:fragment>
					<span>Analytics</span>
				</AppRailAnchor>
				<AppRailAnchor
					href="/dashboard/teams"
					selected={$page.url.pathname === '/dashboard/teams'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconUsersGroup size={35} />
					</svelte:fragment>
					<span>Teams</span>
				</AppRailAnchor>

				<AppRailAnchor
					href="/dashboard/kpi"
					selected={$page.url.pathname === '/dashboard/kpi'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconChartDots2 size={35} />
					</svelte:fragment>
					<span>KPI</span>
				</AppRailAnchor>

				<AppRailAnchor
					href="/dashboard/goals"
					selected={$page.url.pathname === '/dashboard/goals'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconTarget size={35} />
					</svelte:fragment>
					<span>Goals</span>
				</AppRailAnchor>

				<AppRailAnchor
					href="/dashboard/headlines"
					selected={$page.url.pathname === '/dashboard/headlines'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconNews size={35} />
					</svelte:fragment>
					<span>Headlines</span>
				</AppRailAnchor>

				<AppRailAnchor
					href="/dashboard/todos"
					selected={$page.url.pathname === '/dashboard/todos'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconListCheck size={35} />
					</svelte:fragment>
					<span>To-Dos</span>
				</AppRailAnchor>

				<AppRailAnchor
					href="/dashboard/issues"
					selected={$page.url.pathname === '/dashboard/issues'}
					title="Teams"
				>
					<svelte:fragment slot="lead">
						<IconExclamationCircle size={35} />
					</svelte:fragment>
					<span>Issues</span>
				</AppRailAnchor>
			</AppRail>
		{/if}
	</svelte:fragment>

	<svelte:fragment slot="sidebarRight">
		<!-- {#if teamExist} -->
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
		<!-- {/if} -->
	</svelte:fragment>
	<div class="relative">
		{#if $navigating && navigateTo === '/dashboard/teams'}
			<LoadingSkeleton />
		{:else if $navigating &&( navigateTo === '/dashboard/teams/details/[id]' || navigateTo === '/meeting/[id]')}
			<FullPageLoading />
		{:else}
			<slot />
		{/if}
		<!-- {#if $navigating}
			<div class=" flex justify-center align-middle items-center w-7/10 py-44">
				<ProgressRadial stroke={40} meter="stroke-primary-500" track="stroke-primary-100" />
			</div>
		{:else}
			<slot />
		{/if} -->
		<!-- <slot></slot> -->
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
