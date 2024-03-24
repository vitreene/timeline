<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/style.css';
</script>

<div class="app">
	<slot />
</div>

<style>
	.app {
		/* position: absolute; */
		background-color: beige;
		width: 100%;
		height: 100vh;
		min-height: 100vh;
		max-height: 100vh;
		padding: 2rem;
		overflow-y: scroll;
	}
</style>
