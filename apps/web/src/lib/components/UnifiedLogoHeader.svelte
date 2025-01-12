<script lang="ts">
	import UnifiedImage from "./UnifiedImage.svelte";
	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex flex-row items-center justify-center gap-1 p-1">
	<UnifiedImage />
	<div class="text-center text-sm text-muted-foreground">
		{@render children?.()}
	</div>
</div>
<div class="h-[1px] w-full bg-muted-foreground/30 px-0"></div>
