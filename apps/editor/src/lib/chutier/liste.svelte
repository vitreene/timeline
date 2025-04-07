<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SceneComp } from '$lib/server/db';
	export let sources: SceneComp['sources'];

	const uploadFile = (e: any) => {
		e.target.form.submit();
	};
</script>

<div class="chutier">
	<h4>Sources</h4>
	<form id="import-files" method="POST" action="?/upload" enctype="multipart/form-data">
		<label class="file-upload">
			<input
				on:change={uploadFile}
				form="import-files"
				name="file"
				type="file"
				accept=".jpg, .jpeg, .png, .webp,.mp3"
			/>
			Ajouter...
		</label>
	</form>
	<ul>
		{#each sources as media}
			<li class="chutier-media-list-item">{media.type} {media.id}</li>
		{/each}
	</ul>
</div>

<style>
	input[type='file'] {
		display: none;
	}

	.file-upload {
		border: 1px solid #ccc;
		display: inline-block;
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		cursor: pointer;
	}
</style>
