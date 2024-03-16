<div class="grid">
	<div class="chutier">1</div>
	<div class="scene">2</div>
	<div class="capsule">3</div>
	<div class="controle">4</div>
	<div class="media">5</div>
</div>

<style>
	.grid {
		border: 5px solid rgb(111, 41, 97);
		display: grid;
		grid-template-areas:
			'chutier scene capsule'
			'chutier controle capsule'
			'media media capsule';
		gap: 10px;
		grid-template-columns: 1fr 4fr 2fr;
		grid-template-rows: 4fr 1fr 2fr;
		inline-size: 500px;
	}

	.grid > * {
		background-color: rgba(111, 41, 97, 0.4);
		border-radius: 5px;
		padding: 10px;
	}

	.chutier {
		grid-area: chutier;
	}

	.scene {
		grid-area: scene;
	}

	.capsule {
		grid-area: capsule;
	}

	.controle {
		grid-area: controle;
	}

	.media {
		grid-area: media;
	}
</style>
