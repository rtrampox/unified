<script lang="ts">
	import { Sparkles } from "lucide-svelte";

	let { children } = $props();
</script>

<svelte:head>
	<title>Logout - Unified Account</title>
	<meta name="description" content="Logout of your Unified account." />
</svelte:head>

<div class="relative min-h-screen">
	<div class="flex min-h-screen flex-col items-center justify-center p-4">
		<a href="#/" class="mb-8 flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
				<Sparkles class="h-5 w-5 text-white dark:text-black" />
			</div>
			<span class="text-xl font-bold text-zinc-900 dark:text-white">Unified Account</span>
		</a>

		<div class="w-full max-w-md">
			<div
				class="rounded-2xl border border-zinc-200/50 bg-white shadow-xl dark:border-zinc-800/50 dark:bg-zinc-900">
				{@render children()}
			</div>
		</div>
	</div>
</div>
