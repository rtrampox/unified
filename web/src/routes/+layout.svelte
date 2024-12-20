<script lang="ts">
	import { Toaster } from "svelte-sonner";

	import { ModeWatcher } from "mode-watcher";
	import "../app.css";
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
<Toaster theme="dark" richColors={true} />
