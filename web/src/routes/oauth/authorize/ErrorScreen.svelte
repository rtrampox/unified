<script lang="ts">
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import type { PageData } from "./$types";

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.error?.name || "Error"} - Unified</title>
</svelte:head>

<div class="flex h-screen flex-col border border-red-950 bg-neutral-900 md:h-full md:rounded-xl">
	<div class="flex h-full flex-col rounded-3xl bg-neutral-900">
		<div class="flex h-full flex-col justify-center">
			<div class="p-5 py-7">
				<div class="flex w-full flex-col items-center">
					<div class="mb-32flex w-full flex-col items-start gap-3">
						<Badge variant="destructive">400</Badge>
						<h1 class="text-start text-2xl font-bold">Bad Request</h1>

						<h1 class="mb-1 text-start text-muted-foreground">
							We couldn't process your request. Please check the input and try again.
						</h1>
						<h1 class="mb-1 text-start text-muted-foreground">
							{data.error?.name}
						</h1>
					</div>
					<h1 class="text-center">{data.error?.message}</h1>
				</div>
			</div>
		</div>
	</div>
</div>
