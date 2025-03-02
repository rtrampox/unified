<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();

	import "../app.css";
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />

	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
	/>
</svelte:head>

<!-- svelte-ignore -->
<ModeWatcher />
{@render children()}
<Toaster theme="system" richColors={true} closeButton={true} />
