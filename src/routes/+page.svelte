<script lang="ts">
	import welcome from "$lib/images/svelte-welcome.webp";
	import welcome_fallback from "$lib/images/svelte-welcome.png";
	import type { SongEntry } from "$lib/types";
	import data_all from "$lib/songs.json";
	import SvelteFuse from 'svelte-fuse';
	import type { ResultType } from 'svelte-fuse';

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
		// threshold: 0.6,
		// distance: 100,
		// useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ["id", "title", "artist"],
	};


	let result: ResultType<SongEntry> = [];
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

	<button
		on:click={() => {
		}}
	/>

	<SvelteFuse list={data} {options} query={searchPattern} bind:result />

	{JSON.stringify(result)}
	<!--
	{#each fuse.search(searchPattern) as _data}
		{JSON.stringify(_data)}
	{/each}
	-->
	<!--
	{#each { length: 3 } as _, i}
		{JSON.stringify(data_all[i])}
	{/each}
	-->
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
