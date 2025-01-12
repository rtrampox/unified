<script lang="ts">
	import { SlashIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import { activeTab, tabs, type Tabs } from "./store";
	import { page } from "$app/stores";

	let { children, data } = $props();

	$effect(() => {
		$activeTab = $page.route.id!;
	});
</script>

<svelte:head>
	<title>My Account - Unified</title>
</svelte:head>

<div>
	<div
		class="mt-5 flex flex-col items-center justify-between gap-2 text-2xl font-semibold transition-all">
		<div class="flex flex-row items-center justify-center gap-1 text-center font-normal">
			<a data-sveltekit-replacestate href="/account" class="font-semibold">My Account</a>
			<div class="flex flex-row items-center justify-center gap-1">
				<SlashIcon class="size-3 -rotate-12 text-neutral-500" />
				<span>{tabs[$activeTab as Tabs]}</span>
			</div>
		</div>
	</div>
	<div class="w-full items-center justify-center">
		{#key data.url}
			<div
				in:fly={{ x: -200, delay: 200, duration: 200 }}
				out:fly={{ duration: 200 }}
				class="flex flex-col items-center justify-center gap-5 pt-5">
				{@render children()}
			</div>
		{/key}
	</div>
</div>
