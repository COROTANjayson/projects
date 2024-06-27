<script lang="ts">
	import axios from 'axios';
	import InputRating from './InputRating.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	interface Props {
		data?: any;
	}
	const slug = $page.params.id;
	export let data: Props['data'];
	$: teamRatings = data.teamMembers;
	const onChangeRating =async(item: any) => {
		let teamId = slug
		let meetingId = data.teamMeeting.id
		let body = {
			teamId,
			meetingId,
			rating: item.rating
		};
		let resp = await axios.post(`/api/meeting/rate/${item.userId}`, {
			...body
		});
	};
</script>

<div class="py-2 px-4">
	<p class="text-xl uppercase tracking-wider">Ratings</p>
	<div class="flex gap-3">
		{#each teamRatings as team}
			<InputRating
				bind:item={team}
				onChange={() => {
					onChangeRating(team);
				}}
			/>
		{/each}
	</div>
</div>

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
