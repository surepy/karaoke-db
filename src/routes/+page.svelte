<script lang="ts">
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcome_fallback from "$lib/images/svelte-welcome.png";
	import type { SongEntry } from "$lib/types";
	import data_all from "$lib/songs.json";
	import SvelteFuse from '$lib/svelte-fuse/SvelteFuse.svelte';
    import type { FuseResult } from "fuse.js";

	$: data = <SongEntry[]>data_all;

	// Change the pattern
	let searchPattern = "ss";

	const options = {
		// isCaseSensitive: false,
		// includeScore: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 1,
		// location: 0,
		threshold: 0.4,
		distance: 10,
		// useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ["id", "title", "artist"],
		limit: 10
	};


	let result: FuseResult<SongEntry>[] = [];
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>
	<input type="text" bind:value={searchPattern} />

	<SvelteFuse list={data} {options} query={searchPattern} bind:result let:search> 
		<button
			on:click={() => {
				search();
			}}
		>
			ligma 
		</button>
	</SvelteFuse>

	{#each result as _data}
		{_data.item.title}
		<br>
	{/each}

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
