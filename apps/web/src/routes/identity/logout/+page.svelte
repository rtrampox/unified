<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
	import { enhance } from "$app/forms";
	import { writable } from "svelte/store";
	import { enhanceConfig } from "@/index";
	import { toCallback } from "@/redirect";
	import { page } from "$app/stores";
	import UserAvatarNoDropdown from "@/components/UserAvatarNoDropdown.svelte";

	const loading = writable(false);

	let { data, form } = $props();
</script>

{#if data.isLoggedIn}
	<main>
		<div class="space-y-6 p-8">
			<div class="space-y-2 text-center">
				<h1 class="flex flex-col text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
					Already going, {data.session?.user.firstName}?
				</h1>
				<UserAvatarNoDropdown sessionData={data.session} />
				<p class="text-zinc-500 dark:text-zinc-300">
					This will end your current session and log you out.
				</p>
			</div>
			<div class="flex flex-col space-y-4">
				<form action="?/logout" class="w-full" method="post" use:enhance={enhanceConfig(loading)}>
					<input
						hidden
						name="callback"
						value={new URLSearchParams(data.searchParams).get("callback")} />
					<Button variant="ringHoverDestructive" class="w-full" type="submit">Logout</Button>
				</form>
				<Button isLoading={$loading} class="w-full" onclick={() => toCallback($page.url)}>
					Go back
				</Button>
			</div>
		</div>
	</main>
{/if}
