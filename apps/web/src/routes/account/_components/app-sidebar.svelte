<script lang="ts" module>
	import BookOpen from "lucide-svelte/icons/book-open";

	// This is sample data.
	const data = {
		items: [
			// Personal Info
			{
				title: "Personal Info",
				url: "/account/personal",
				icon: UserRoundIcon,
				isActive: true,
			},
			// Security
			{
				title: "Security",
				url: "/account/security",
				icon: LockIcon,
				isCollapsible: true,
				items: [
					{
						title: "Multifactor Authentication",
						url: "/account/security#",
					},
					{
						title: "Password Settings",
						url: "/account/security#",
					},
					{
						title: "Sessions",
						url: "/account/security/#",
					},
				],
			},
			// Allowed Apps
			{
				title: "Allowed Apps",
				url: "/account/apps",
				icon: BookOpen,
			},
			// Developer Settings
			{
				title: "Developer Settings",
				url: "#",
				icon: LayoutGridIcon,
				isCollapsible: true,
				items: [
					{
						title: "Clients",
						url: "#",
					},
					{
						title: "API Keys",
						url: "#",
					},
				],
			},
		],
	} satisfies NavMainProps;
</script>

<script lang="ts">
	import NavMain from "./nav-main.svelte";
	import NavUser from "./nav-user.svelte";
	import SidebarLogo from "./sidebar-logo.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import type { ComponentProps } from "svelte";
	import type { SessionResponseUser } from "@/api";
	import { LayoutGridIcon, LockIcon, UserRoundIcon } from "lucide-svelte";

	let {
		ref = $bindable(null),
		collapsible = "icon",
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: SessionResponseUser } = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Header>
		<a href="/account">
			<SidebarLogo />
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.items} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
