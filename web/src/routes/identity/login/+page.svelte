<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
	import Form from "./Form.svelte";
	import { writable } from "svelte/store";
	import { requestLogout, toCallback } from "@/redirect";
	import { page } from "$app/stores";

	const loading = writable(false);

	let { data, form } = $props();
</script>

{#if data.isLoggedIn}
	<main>
		<div class="space-y-6 p-8">
			<div class="space-y-2 text-center">
				<h1 class="flex flex-col text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
					Welcome back, {data.session?.user.firstName}
					<span class="text-sm font-normal text-muted-foreground">{data.session?.user.email}</span>
				</h1>
				<p class="text-zinc-500 dark:text-zinc-300">
					It looks like that you&apos;re already logged in
				</p>
				<p class="text-zinc-500 dark:text-zinc-300">
					You can continue with this account, or sign in with a different one
				</p>
			</div>
			<div class="flex flex-col space-y-4">
				<Button
					class="w-full"
					type="submit"
					isLoading={$loading}
					onclick={() => toCallback($page.url)}>Continue with this account</Button>
				<form method="POST" action="?/logout">
					<Button
						variant="ringHoverDestructive"
						onclick={() => requestLogout($page.url)}
						class="w-full">Logout</Button>
				</form>
			</div>
		</div>
	</main>
{:else}
	<main>
		<div class="space-y-6 p-8">
			<div class="space-y-2 text-center">
				<h1 class="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
					Welcome back
				</h1>
				<p class="text-zinc-500 dark:text-zinc-400">Sign in to your account to continue</p>
			</div>
			<div class="space-y-4">
				<div class="space-y-2">
					<Form {data} {form} />
				</div>
			</div>
		</div>

		<footer class="p-8 pt-0 text-center">
			<p class="text-sm text-zinc-500 dark:text-zinc-400">
				This page is protected by reCAPTCHA and Google's
				<a href="https://policies.google.com/privacy">Privacy Policy</a>
				and
				<a href="https://policies.google.com/terms">Terms of Service</a>
				apply.
			</p>
		</footer>
	</main>
{/if}
