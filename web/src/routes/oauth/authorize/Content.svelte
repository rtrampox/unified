<script lang="ts">
	import { enhance } from "$app/forms";
	import Link from "$lib/components/Link.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import type { PageData, ActionData } from "./$types";
	import ErrorScreen from "./ErrorScreen.svelte";
	import ScopeInfo from "./ScopeInfo.svelte";
	import { InfoIcon } from "lucide-svelte";
	import UserAvatar from "$lib/components/UserAvatar.svelte";
	import type { SubmitFunction } from "@sveltejs/kit";
	import type { SessionResponse } from "@/api";

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data }: Props = $props();

	let loading: boolean = $state(false);

	const onSubmit: SubmitFunction = () => {
		loading = true;

		return ({ update }) => {
			update({ invalidateAll: false }).catch(() => {
				loading = false;
			});
		};
	};
</script>

<svelte:head>
	{#if !data.error}
		<title>Authorize {data.client.name} - Unified</title>
		<meta
			name="description"
			content="Authorize {data.client.name} to access your Unified account."
		/>
	{/if}
</svelte:head>
{#if data.error}
	<ErrorScreen {data} />
{:else}
	<div class="space-y-2">
		<div class="space-y-6 p-4 md:p-8">
			<div class="space-y-2 text-center">
				<h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
					Authorize {data.client.name}
				</h1>
				<p class="text-zinc-500 dark:text-zinc-400">
					{data.client.name} is requesting access to your account.
				</p>
			</div>

			<div class="w-full">
				{#if !data.user.isHinted}
					<div
						class="my-3 flex flex-row items-center justify-center gap-1 rounded-xl border border-orange-500/70 bg-orange-600/5 p-3 text-neutral-400 dark:text-white"
					>
						<InfoIcon class="size-4 text-orange-500" />
						<p class="ml-2">
							{data.client.name} has recommended that you continue as {data.user.login_hint}.
						</p>
					</div>
				{/if}
				<UserAvatar sessionData={data.session as SessionResponse} />
			</div>

			<div>
				<ScopeInfo {data} />
				<div class="space-y-3">
					<form method="POST" class="w-full" use:enhance={onSubmit}>
						<Button
							variant="ringHover"
							type="submit"
							class="h-11 w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
							isLoading={loading}>Authorize</Button
						>
					</form>
					<Button
						variant="ringHoverSecondary"
						type="button"
						disabled={loading}
						onclick={() => {
							window.location.href = `${data.params.redirect_uri}?error=access_denied`;
						}}
						class="h-11 w-full">Cancel</Button
					>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-1 p-8 px-2 pt-0 text-center">
			<p class="text-sm text-zinc-500 dark:text-zinc-400">
				You will be sent back to: <strong>{new URL(data.params?.redirect_uri).origin}</strong>.
			</p>
			<div class="text-sm text-zinc-500 dark:text-zinc-400">
				<p>You can always manage apps that you allowed access to at</p>
				<Link href="/account" target="_blank">your account</Link>.
			</div>
		</div>
	</div>
{/if}
