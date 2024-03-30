<script lang="ts">
	import type { TextTime } from '$lib/server/db';

	export let line: {
		action: string;
		label: string;
		textTime: TextTime;
	};
	export let id: number | string;

	const eventid = `${line.action}/${id}`;
	const deleteId = `${eventid}-delete`;
</script>

<div class="action-line">
	<input form="text-time" type="submit" id={eventid} name="action" value={eventid} />
	<input
		form="text-time"
		type="submit"
		id={deleteId}
		name="action"
		value={eventid}
		formaction="?/delete-transition"
	/>
	<label class="line-action" for={eventid}>{line.label}</label>
	<label class="line-delete" for={deleteId}>{line.textTime.text}</label>
</div>

<style>
	.action-line {
		display: flex;
		align-content: space-between;
		justify-items: baseline;
		padding: 0.25em 0;
	}

	.line-action {
		display: block;
		margin: auto 0.25rem;
		padding: 0.25em 0.5em;
		font-size: 0.71rem;
		font-variant: small-caps;
		background-color: aquamarine;
	}

	.line-action:hover {
		background-color: chartreuse;
	}
	input {
		visibility: hidden;
		position: absolute;
	}

	.line-delete {
		margin: auto 0.25rem auto auto;

		padding: 0.25em 0.5em;
		font-size: 0.71rem;
		background-color: aliceblue;
		border-radius: 1em;
	}

	.line-delete:empty {
		display: none;
	}
</style>
