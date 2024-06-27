<script lang="ts">
	import { kpiData } from '$lib/stores/forms';
	import axios from 'axios';
	import { Avatar, popup } from '@skeletonlabs/skeleton';
	import {
		IconDotsVertical,
		IconEdit,
		IconExclamationCircle,
		IconListCheck,
		IconSquareRoundedPlusFilled,
		IconTrash
	} from '@tabler/icons-svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import { enhance } from '$app/forms';
	import { getDatesByDay } from '$lib/utils/formatDate';
	import { onMount } from 'svelte';
	import _ from 'lodash';
	import { page } from '$app/stores';
	import { isDeleteModalOpen, deleteItem, endpointStore } from '$lib/stores/sideBar';
	import DeleteModal from '$lib/components/DeleteModal.svelte';

	// import { APP_URL } from '$env/static/private';
	interface Props {
		onHandleUpdate?: () => void;
		onHandleRelatedNewIssueForm?: () => void;
		onHandleRelatedNewTodoForm?: () => void;
		item: any;
		teamId: any;
		index: number;
		endpoint?: string;
	}
	export let endpoint: Props['endpoint'];
	export let item: Props['item'];
	export let teamId: Props['teamId'];
	export let index: Props['index'];
	export let onHandleUpdate: Props['onHandleUpdate'] = () => {};
	export let onHandleRelatedNewIssueForm: Props['onHandleRelatedNewIssueForm'] = () => {};
	export let onHandleRelatedNewTodoForm: Props['onHandleRelatedNewTodoForm'] = () => {};
	const popupClick: any = {
		event: 'click',
		target: 'popupClick',
		placement: 'left',
		middleware: {
			offset: 0,
			shift: {
				crossAxis: true
			}
		}
	};
	let dates = getDatesByDay(item.team.weekly_start_day.toLowerCase(), 3, 0) as any[];
	let isHideMenu = false;
	onMount(() => {
		if ($page.url.pathname.includes('meeting')) {
			isHideMenu = true;
		}
	});

	$: {
		if (!$kpiData && item) {
			fillScores();
		}
	}
	const fillScores = () => {
		if (item.scores.length > 0) {
			dates = dates.map((val: any) => {
				// if(value.date === )\
				let score = _.find(item.scores, { date: val.date });
				if (score) {
					val.value = score.value;
				}

				return val;
			});
			checkGoal();
		}
	};
	onMount(() => {
		fillScores();
	});
	const handleInputChange = async (event: any, date: any) => {
		let score = {
			id: item.id + date.date,
			date: date.date,
			value: date.value,
			kpiId: item.id
		};
		let resp = await axios.post(`/api/kpi/score`, {
			...score
		});
		// let resp = await axios.post(`/api/kpi/score`,

		// );
		checkGoal();
	};
	const checkGoal = () => {
		dates = dates.map((val: any) => {
			if (val.value) {
				if (item.operator === '≥') {
					val.pass = val.value >= item.goal;
					return val;
				} else if (item.operator === '≤') {
					val.pass = val.value <= item.goal;
					return val;
				} else if (item.operator === '>') {
					val.pass = val.value > item.goal;
					return val;
				} else if (item.operator === '<') {
					val.pass = val.value < item.goal;
					return val;
				} else if (item.operator === '=') {
					val.pass = val.value === item.goal;
				}
			} else {
				return val;
			}
		});
	};
</script>

<!-- Row  -->

{#each dates as date, i}
	{#if dates.length === i + 1}
		<div class={`bg-white flex  `}>
			<div
				class={`w-[80px] flex justify-center 
					${date.pass === false ? 'bg-red-100 border-red-100 ' : 'border-white '}
					
					`}
			>
				<input
					class={`no-spinners w-[80px]  border-x-2  border-y-none   border-black   h-[50px] text-center   bg-transparent`}
					type="number"
					bind:value={date.value}
					on:change={(event) => {
						handleInputChange(event, date);
					}}
					name=""
					id=""
				/>
			</div>
			<div class=" bg-white flex-col items-center w-[150px]">
				<div class="flex items-center gap-2 px-2">
					<IconButton onClick={onHandleRelatedNewIssueForm}>
						<div class="relative">
							<IconExclamationCircle size={35} />
							<IconSquareRoundedPlusFilled
								class="rounded-full text-primary-500 absolute -bottom-1 -right-1 bg-white"
								size={20}
							/>
						</div>
					</IconButton>
					<IconButton onClick={onHandleRelatedNewTodoForm}>
						<div class="relative">
							<IconListCheck size={30} />
							<IconSquareRoundedPlusFilled
								class="rounded-full text-primary-500 absolute -bottom-1 -right-1 bg-white"
								size={20}
							/>
						</div>
					</IconButton>
					{#if !isHideMenu}
						<button
							use:popup={{
								...popupClick,
								target: `popupClick-${teamId}-${index}`
							}}
							class="hover:bg-surface-50 rounded-full w-[40px] h-[40px] flex items-center justify-center"
						>
							<button
								class="hover:bg-surface-50 rounded-full w-[40px] h-[40px] flex items-center justify-center"
							>
								<IconDotsVertical size={30} />
							</button>
							<div
								class="card py-4 variant-secondary w-[150px] z-[1000]"
								data-popup={`popupClick-${teamId}-${index}`}
							>
								<div class="flex flex-col dark:text-white">
									<button
										on:click={onHandleUpdate}
										id="will-close"
										class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left"
									>
										<div class="flex gap-3">
											<IconEdit size={20} />
											<p>Edit</p>
										</div>
									</button>

									<button
										on:click={() => {
											if (endpoint) endpointStore.set(endpoint);
											isDeleteModalOpen.set(true);
											deleteItem.set(item);
										}}
										id="will-close"
										class="py-2 px-5 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-left w-full"
									>
										<div class="flex gap-3">
											<IconTrash size={20} />
											<p>Delete</p>
										</div>
									</button>
								</div>
							</div>
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/each}

<!-- Row  -->
<style>
	/* Apply styles specifically to the input with the class "no-spinners" */

	/* For Chrome, Safari, Edge, and Opera */
	.no-spinners::-webkit-outer-spin-button,
	.no-spinners::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* For Firefox */
	/* .no-spinners {
			  -moz-appearance: textfield;
			} */
</style>
