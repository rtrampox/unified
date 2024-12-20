<script lang="ts">
	import { cn } from "$lib/utils";
	import { tv, type VariantProps } from "tailwind-variants";

	const variants = tv({
		base: "inline-block rounded-full animate-rotation size-5",
		variants: {
			variant: {
				default: "border-t-2 border-r-2 border-white border-r-transparent box-border",
				whitebg: "border-t-2 border-r-2 border-black border-r-transparent box-border",
			},
		},
	});
	interface Props {
		variant?: VariantProps<typeof variants>["variant"];
		class?: string;
	}

	let { variant = "default", class: className = "" }: Props = $props();
</script>

<span class={cn(variants({ variant, className }))}></span>
