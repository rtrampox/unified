<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar";
	import * as Breadcrumb from "@/components/ui/breadcrumb";
	import { activeTab, tabs, type Tabs } from "./store";
	import { page } from "$app/state";
	import Separator from "@/components/ui/separator/separator.svelte";
	import { fly } from "svelte/transition";
	import AppSidebar from "./_components/app-sidebar.svelte";

	let { children, data } = $props();

	$effect(() => {
		$activeTab = page.route.id!;
	});
</script>

<svelte:head>
	<title>My Account - Unified</title>
</svelte:head>

<Sidebar.Provider>
	{#if data.user}
		<AppSidebar user={data.user} />
	{/if}
	<Sidebar.Inset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="/account">Account</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>{tabs[$activeTab as Tabs]}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		{#key data.url}
			<div
				in:fly={{ x: -200, delay: 200, duration: 200 }}
				out:fly={{ duration: 200 }}
				class="flex flex-col items-center justify-center gap-5 pt-5"
			>
				{@render children()}
			</div>
		{/key}
	</Sidebar.Inset>
</Sidebar.Provider>
