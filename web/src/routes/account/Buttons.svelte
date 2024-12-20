<script lang="ts">
	import { ChevronRight } from "lucide-svelte";

	type Props = {
		name: string;
		description: string;
		href: string;
	};

	let { name, description, href }: Props = $props();
</script>

<a
	class="flex w-full cursor-pointer flex-row items-center justify-between gap-2 rounded-xl bg-neutral-900 p-5 shadow-xl ring-0 ring-white transition-all hover:ring-2"
	{href}>
	<div>
		<div class="flex flex-row items-center gap-1">
			<p>{name}</p>
		</div>
		<p class="text-sm font-normal text-muted-foreground">
			{description}
		</p>
	</div>
	<ChevronRight class="h-6 w-6" />
</a>
