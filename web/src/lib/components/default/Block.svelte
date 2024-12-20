<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="relative h-screen w-full bg-white dark:bg-black/5">
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute inset-0 bg-zinc-50/50 dark:bg-zinc-900/50"></div>
	</div>
	{@render children()}
</div>
