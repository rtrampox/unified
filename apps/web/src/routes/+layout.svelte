<script lang="ts">
	import { Toaster } from "svelte-sonner";
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();

	import "../app.css";
</script>

<!-- svelte-ignore -->
<ModeWatcher />
{@render children()}
<Toaster theme="system" richColors={true} closeButton={true} />
