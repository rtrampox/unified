<script lang="ts">
	import * as Dialog from "@/components/ui/dialog";
	import { toast } from "svelte-sonner";
	import Scopes from "@/components/Scopes.svelte";
	import Button from "@/components/ui/button/button.svelte";
	import { enhance } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { ChevronLeft } from "lucide-svelte";
	import { enhanceConfig, loadingStore } from "$lib";

	let { data, form } = $props();

	let open = $state(false);
	let message = $derived(data.message);

	$effect(() => {
		if (form && form.ok) {
			open = false;
			toast.success("App revoked successfully");
			invalidateAll();
		}
		if (form && form.message && !form.ok) {
			toast.error(form.message);
		}
		if (message) {
			toast.error(message);
		}
	});
</script>

<svelte:head>
	<title>Allowed apps and services - Unified Account</title>
</svelte:head>

<main class="mb-10 flex h-full flex-col items-center justify-center gap-5 pt-5">
	{#if data.apps?.length}
		{#each data.apps as app}
			<div
				class="flex w-[90vw] flex-row items-center justify-between rounded-xl bg-neutral-900 p-5 ring-0 ring-neutral-600 transition-all hover:ring-2 md:w-[70vw] xl:w-[50vw]">
				<div class="flex w-full flex-row justify-between">
					<div class="flex flex-col gap-1">
						<h1 class="text-xl">{app.client.name}</h1>
						<p>Permissions:</p>
						<h2 class="break-words text-sm text-muted-foreground">
							<Scopes scopes={app.scopes} />
						</h2>
					</div>
					<Dialog.Dialog
						{open}
						onOpenChange={() => {
							open = !open;
						}}>
						<Dialog.DialogTrigger>
							<Button variant="ringHoverDestructive">Revoke</Button>
						</Dialog.DialogTrigger>
						<Dialog.DialogContent>
							<Dialog.DialogHeader>
								<Dialog.DialogTitle>Are you sure?</Dialog.DialogTitle>
								<Dialog.DialogDescription
									>By revoking {app.client.name}'s access, you will have to authorize it again
									later.</Dialog.DialogDescription>
							</Dialog.DialogHeader>
							<Dialog.DialogFooter>
								<Dialog.DialogClose>
									<Button variant="ringHoverSecondary">Cancel</Button>
								</Dialog.DialogClose>
								<form
									method="POST"
									action="?/revoke&client_id={app.clientId}"
									use:enhance={enhanceConfig(loadingStore)}>
									<Button isLoading={$loadingStore} variant="ringHoverDestructive" type="submit"
										>Revoke</Button>
								</form>
							</Dialog.DialogFooter>
						</Dialog.DialogContent>
					</Dialog.Dialog>
				</div>
			</div>
		{/each}
	{:else}
		<div class="flex flex-col items-center gap-5">
			<h1 class="text-center text-2xl">
				Seems empty here. <br /> Apps and services that you allow access to your account will appear
				here.
			</h1>
			<Button variant="ringHoverSecondary" onclick={() => history.back()}
				><ChevronLeft class="mr-1 size-5" /> Go back</Button>
		</div>
	{/if}
</main>
