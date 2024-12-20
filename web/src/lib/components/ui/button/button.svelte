<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Events, type Props, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";

	type $$Props = Props;
	type $$Events = Events;

	let className: $$Props["class"] = undefined;
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];

	export let isLoading = false;
	export let disabled = false;

	export { className as class };
</script>

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	disabled={disabled || isLoading}
	{...$$restProps}
	on:click
	on:keydown>
	{#if isLoading}
		<div class="flex w-full flex-row items-center justify-center gap-1 transition-all">
			<LoadingSpinner
				class="mr-1 size-4"
				variant={variant?.toLowerCase().endsWith("secondary") ? "default" : "whitebg"} />
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</ButtonPrimitive.Root>
