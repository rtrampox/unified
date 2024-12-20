<script lang="ts">
	import type { Snippet } from "svelte";

	type Props = {
		title: string;
		description: string;
		children: Snippet;
	};

	let { children, title, description }: Props = $props();
</script>

<div
	class="flex w-[90vw] flex-row items-center justify-between rounded-xl bg-neutral-900 p-5 ring-0 ring-neutral-600 transition-all hover:ring-2 md:w-[70vw] xl:w-[50vw]">
	<div class="flex flex-col gap-1">
		<h1 class="text-lg">{title}</h1>
		<h2 class="break-words text-sm text-muted-foreground">
			{@html description}
		</h2>
	</div>
	{@render children()}
</div>
