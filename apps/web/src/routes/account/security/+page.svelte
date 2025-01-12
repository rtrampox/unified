<script lang="ts">
	import Button from "@/components/ui/button/button.svelte";
	import Buttons from "./Buttons.svelte";
	import { SlashIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { activeTab } from "../store";

	let { data } = $props();

	onMount(() => {
		$activeTab = "security";
	});
</script>

<svelte:head>
	<title>Security Settings - Unified Account</title>
</svelte:head>

<main class="mb-10 flex h-full flex-col items-center justify-center gap-5 pt-5">
	<Buttons
		title="Multifactor Authentication"
		description="Multifactor authentication adds an extra layer of security to your account. <br /> You will be asked to enter a code when you sign in."
		>{#if data.session.user.otp}
			<Button variant="ringHoverDestructive">Disable</Button>
		{:else}
			<Button>Enable</Button>
		{/if}</Buttons>

	<Buttons
		title="Password"
		description="Change your password to keep your account secure. <br /> Last updated: <strong>{new Date().toLocaleString()}</strong>">
		<Button>Update</Button>
	</Buttons>

	<Buttons
		title="Sessions"
		description="Manage your active sessions and view where your account is connected.">
		<Button>Manage</Button>
	</Buttons>
</main>
