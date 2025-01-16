<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
			<div
				class="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-700"
			>
				<img src="/favicon.png" alt="Unified Account" class="size-5" />
			</div>
			<div class="grid flex-1 text-left text-sm leading-tight">
				<span class="truncate font-semibold">Unified Account</span>
			</div>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
