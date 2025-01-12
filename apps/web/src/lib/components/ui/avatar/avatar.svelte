<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let loadingStatus = $state<AvatarPrimitive.RootProps["loadingStatus"]>("loading");

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.RootProps = $props();
</script>

<AvatarPrimitive.Root
	bind:ref
	bind:loadingStatus
	class={cn(
		"relative flex size-10 shrink-0 overflow-hidden rounded-full border-2",
		loadingStatus === "loaded" ? "border-foreground" : "border-transparent",
		className,
	)}
	{...restProps} />
