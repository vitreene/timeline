<script lang="ts">
	import MediaEvents from './media-events.svelte';
	import type { SceneMedia } from '$lib/server/db';

	export let media: SceneMedia;
</script>

<div>
	<h4>{media.mediaId}</h4>
	<sound src={media.path} />
	<MediaEvents events={media.events} />
</div>
