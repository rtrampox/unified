<script lang="ts">
	import { onMount } from "svelte";
	import Buttons from "./Buttons.svelte";
	import { activeTab } from "./store";

	let { data } = $props();

	onMount(() => {
		$activeTab = "home";
	});
</script>

<main class="mb-10 flex h-full flex-col items-center justify-center gap-7 pt-5">
	<div class="flex flex-col items-center justify-between gap-2 text-2xl font-normal">
		<h2>
			Welcome back, {data.user?.user.firstName}
			{data.user?.user.lastName}
		</h2>
	</div>
	<div
		class="flex w-[90vw] flex-col items-center justify-between gap-3 px-5 text-xl font-semibold md:w-[70vw] xl:w-[50vw]">
		<!-- Personal Info -->
		<Buttons
			href="/account/personal"
			name="Personal Info"
			description="Manage the info that is shared with authorized apps." />
		<!-- -->
		<!-- Authorized Apps -->
		<Buttons
			href="/account/apps"
			name="Allowed apps and third-party services"
			description="Manage apps and services that have access to your account." />
		<!-- -->
		<!-- Security -->
		<Buttons
			href="/account/security"
			name="Account Security"
			description="Manage your account security settings." />
		<!-- -->
		<!-- Developer Settings -->
		<Buttons
			href="/account/developer"
			name="Developer Settings"
			description="Manage your clients and API keys." />
		<!-- -->
	</div>
</main>
