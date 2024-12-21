<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";
	import type { HTMLAnchorAttributes } from "svelte/elements";
	interface Props {
		class?: string;
		href: string;
		children?: Snippet;
	}

	let {
		class: className = "",
		href,
		children,
		...restProps
	}: Props & HTMLAnchorAttributes = $props();
</script>

<a
	class={cn(
		"rounded-md p-[1px] underline decoration-zinc-500 underline-offset-2 transition-all duration-300 hover:bg-zinc-800",
		className,
	)}
	{href}
	{...restProps}
>
	{@render children?.()}
</a>
