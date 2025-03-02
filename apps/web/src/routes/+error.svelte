<script lang="ts">
	import { page } from "$app/state";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import UnifiedLogoHeader from "$lib/components/UnifiedLogoHeader.svelte";
</script>

<svelte:head>
	<title>Error {page.status}: {page.error?.message} - Unified</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center">
	<div class="w-full shadow-xl md:w-[800px]">
		<div
			class="flex h-screen flex-col bg-neutral-900 md:h-full md:rounded-3xl md:border md:border-red-950"
		>
			<UnifiedLogoHeader>
				<h1 class="text-muted-foreground text-center text-sm">Unified Account</h1>
			</UnifiedLogoHeader>
			<div class="flex h-full flex-col justify-center p-5 py-7">
				<div class="mb-3 flex w-full flex-col items-start">
					<Badge variant="destructive">{page.status}</Badge>
					<h1 class="text-start text-2xl font-bold">
						{page.error?.message}
					</h1>

					<h1 class="text-muted-foreground mb-1 text-center">
						We couldn't process your request. Please check the information and try
						again.
					</h1>
				</div>
			</div>
		</div>
	</div>
</main>
