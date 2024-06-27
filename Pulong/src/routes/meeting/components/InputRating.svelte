<script lang="ts">

	import { Avatar, popup } from '@skeletonlabs/skeleton';
	
	import _ from 'lodash';
	// import { APP_URL } from '$env/static/private';
	interface Props {
		onChange?: () => void;

		item: any;
	}

	export let item: Props['item'];

	export let onChange: Props['onChange'] = () => {};

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
</script>

<div class="  w-[140px] space-y-2">
	<p class="text-sm">{item.name}</p>
	<div class="flex justify-between bg-white p-2 w-full rounded">
		<Avatar initials={item.name} width="w-10" background="bg-primary-500  " />
		<input
			on:change={onChange}
            bind:value={item.rating}
			type="number"
			placeholder="Rating"
			class="no-spinners w-20 border-none focus:!border-none focus:ring-0"
		/>
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
