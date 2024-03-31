<script lang="ts">
	import type { TextTime } from '$lib/server/db';

	export let events: Array<TextTime>;
	console.log(events);
</script>

<ul class="text-in-time">
	{#each events as event}
		<li class="text-in-time-item">
			<input form="text-time" type="radio" id={event.id} name="text-in-time" value={event.id} />
			<label class={event.count ? `color-${event.count > 3 ? 3 : event.count}` : 'color-0'} for={event.id}>
				{event.text}
			</label>
		</li>
	{/each}
</ul>

<style>
	.text-in-time {
		margin: 0;
		padding: 0;
	}

	.text-in-time-item {
		font-size: 0.8rem;
		margin: 0.5em 0.25em;
		display: inline-block;
	}
	.text-in-time-item label {
		border-radius: 1em;
		padding: 0.25em 0.5em;
	}
	.text-in-time-item label:hover {
		background-color: coral;
	}
	.text-in-time-item input:checked + label {
		background-color: brown;
		color: aliceblue;
	}
	.text-in-time-item input {
		visibility: hidden;
		position: absolute;
	}
	.color-0 {
		background-color: aliceblue;
	}
	.color-1 {
		background-color: hsl(0, 100%, 90%);
	}
	.color-2 {
		background-color: hsl(0, 100%, 80%);
	}
	.color-3 {
		background-color: hsl(0, 100%, 70%);
	}
</style>
