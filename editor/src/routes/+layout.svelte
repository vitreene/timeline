<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/style.css';
</script>

<div class="app">
	<slot />
</div>

<style>
	.app {
		background-color: beige;
		min-height: 100%;
		min-width: 100%;
		height: auto !important;
		height: 100%;
		width: 100%;
		display: grid;
		grid-area: 1 /1;
		padding: 2rem;
	}
</style>
