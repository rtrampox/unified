<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import { EyeIcon, EyeOffIcon } from "lucide-svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		type,
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();

	let isVisible = $state(false);
</script>

<div class="relative">
	<input
		bind:this={ref}
		class={cn(
			type === "password" ? "pe-10" : "",
			"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
			className,
		)}
		type={type === "password" ? (isVisible ? "text" : "password") : type}
		bind:value
		{...restProps}
	/>
	{#if type === "password"}
		<button
			class="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 transform"
			type="button"
			onclick={() => (isVisible = !isVisible)}
		>
			{#if isVisible}
				<EyeIcon className="size-3" />
			{:else}
				<EyeOffIcon className="size-3" />
			{/if}
		</button>
	{/if}
</div>
