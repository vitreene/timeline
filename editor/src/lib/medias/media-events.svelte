<script lang="ts">
	import type { TextTime } from '$lib/server/db';

	export let events: Array<TextTime>;
</script>

<ul class="text-in-time">
	{#each events as event}
		<li class="text-in-time-item">
			<input form="text-time" type="radio" id={event.id} name="text-in-time" value={event.id} />
			<label for={event.id}>
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
		background-color: aliceblue;
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
</style>
