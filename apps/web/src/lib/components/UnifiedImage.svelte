<script lang="ts">
	import { cn } from "$lib/utils";

	interface Props {
		size?: number;
		class?: string;
	}

	let { size = 15, class: className = "" }: Props = $props();
</script>

<img
	src="/assets/unified.png"
	alt="Unified logo"
	width={size}
	height={size}
	draggable={false}
	class={cn("object-contain antialiased opacity-95", className)} />
