<script lang="ts">
	import type { TextTime } from '$lib/server/db';

	export let events: Array<TextTime>;
</script>

<ul>
	{#each events as event}
		<li class="text-in-time-item">
			<input type="radio" id={event.id} name="text-in-time" value={event.id} />
			<label for={event.id}>
				{event.text}
			</label>
		</li>
	{/each}
</ul>

<style>
	.text-in-time-item {
		margin: 0.4rem 0.2rem;
		display: inline-block;
	}
	.text-in-time-item label {
		background-color: aliceblue;
		border-radius: 1rem;
		padding: 0.25rem 0.5rem;
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
