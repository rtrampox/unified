<script lang="ts">
	import { slide } from "svelte/transition";
	import type { PageData } from "./$types";
	import { ChevronDown } from "lucide-svelte";
	import Scopes from "@/components/Scopes.svelte";

	let { data }: { data: PageData } = $props();

	let expanded = $state<{ willGrant: boolean; alreadyHas: boolean }>({
		alreadyHas: false,
		willGrant: true,
	});
</script>

{#if !data.params || !data.client}
	Invalid Request
{:else}
	<div class="mb-5 space-y-1 text-start text-sm">
		{#if !data.client.isAuthorized}
			<!-- Not Authorized -->
			<div
				class="flex flex-col gap-2 rounded-xl bg-zinc-800 p-3 text-white shadow-xl transition-all hover:ring-2 hover:ring-white">
				<h1 class="text-lg">By continuing, you will allow:</h1>
				<div class="list-inside list-disc text-base">
					<Scopes scopes={data.params.scope.split(" ")} />
				</div>
			</div>
		{:else if data.scopeDetails.scopesGranted}
			<!-- All scopes are granted -->
			<div
				class="flex flex-col gap-2 rounded-xl bg-zinc-800 p-3 shadow-xl transition-all hover:ring-2 hover:ring-white">
				<h1 class="text-lg text-white">You have already granted access to:</h1>
				<div class="list-inside list-disc text-base text-white">
					<Scopes scopes={data.params.scope.split(" ")} />
				</div>
			</div>
		{:else}
			<!-- Already has some of the scopes requested -->
			<div class="flex flex-col gap-3">
				<button
					onclick={() => (expanded.alreadyHas = !expanded.alreadyHas)}
					class="relative flex flex-col gap-2 rounded-xl bg-zinc-700 p-3 text-start text-white shadow-xl transition-all hover:ring-2 hover:ring-white">
					<span class="flex w-full flex-row items-center justify-between">
						<h1 class="mb-0 w-full text-lg">
							{data.client.name} already has some access
						</h1>
						<ChevronDown
							class="size-5 {expanded.alreadyHas
								? 'rotate-180'
								: ''} absolute right-2 transition-all" />
					</span>
					{#if expanded.alreadyHas}
						<div transition:slide>
							<Scopes scopes={data.scopeDetails.grantedScopes} />
						</div>
					{/if}
				</button>
				<button
					onclick={() => (expanded.willGrant = !expanded.willGrant)}
					class="relative flex flex-col gap-2 rounded-xl bg-zinc-800 p-3 text-start text-white shadow-xl transition-all hover:ring-2 hover:ring-white">
					<span class="flex w-full flex-row items-center justify-between">
						<h1 class="w-full text-xl">You will also grant:</h1>
						<ChevronDown
							class="size-5 {expanded.willGrant
								? 'rotate-180'
								: ''} absolute right-2 transition-all" />
					</span>
					{#if expanded.willGrant}
						<div class="list-inside list-disc text-base" transition:slide>
							<Scopes scopes={data.scopeDetails.extraScopes} />
						</div>
					{/if}
				</button>
			</div>
		{/if}
	</div>
{/if}
