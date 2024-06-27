<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import _ from 'lodash';

	interface Props {
		data?: any;
	}
	export let data: Props['data'];

	let attendace =
		data.teamMeeting && data.teamMeeting.teamMeetingAttendance
			? data.teamMeeting.teamMeetingAttendance
			: [];
	let present = _.filter(attendace, { isJoined: true });
</script>

<div class="flex items-center justify-center flex-wrap gap-10 w-full h-[500px]">
	{#each present as user}
		<div class="flex flex-col justify-center items-center">
			<Avatar width=" w-48" initials={user.user.name || ''} background="bg-primary-500" />
			<p class="text-xl">
				{user.user.name}

				{#if user.role === 'scribe'}
					<span class=" opacity-65">(Scribe)</span>
				{/if}
			</p>
		</div>
	{/each}
</div>
