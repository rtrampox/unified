<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	interface Props {
		class?: string;
		href: string;
		children?: Snippet;
	}

	let { class: className = "", href, children }: Props = $props();
</script>

<a
	class={cn(
		"rounded-md p-[1px] underline decoration-zinc-500 underline-offset-2 transition-all duration-300 hover:bg-zinc-800",
		className,
	)}
	{href}>
	{@render children?.()}
</a>
