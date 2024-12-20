<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import UnifiedImage from "$lib/components/UnifiedImage.svelte";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let {
		children,
		type: textType = "login",
		class: className = "",
	}: {
		children: Snippet;
		type?: "login" | "oauth";
		class?: string;
	} = $props();
</script>

<div class="relative min-h-screen w-full bg-white dark:bg-black/50">
	<div class="absolute inset-0">
		<div
			class="absolute top-0 z-[-2] h-full w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
		</div>
	</div>

	<div class="relative flex min-h-screen flex-col items-center justify-center p-4">
		<Button variant="ghost" href="/account" class="mb-8 flex items-center gap-2">
			<div class="flex size-7 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
				<UnifiedImage class="size-5 text-white dark:text-black dark:invert" />
			</div>
			<span class="text-xl font-semibold text-zinc-900 dark:text-white">
				{#if textType === "login"}
					Unified Account
				{:else if textType === "oauth"}
					Continue with Unified
				{/if}
			</span>
		</Button>

		<div class={cn("w-full max-w-md", className)}>
			<div
				class="rounded-2xl border border-zinc-200/50 bg-white shadow-xl dark:border-zinc-800/50 dark:bg-zinc-900">
				{@render children()}
			</div>
		</div>
	</div>
</div>
