<script lang="ts">
	import { LogOut, Settings } from "lucide-svelte";
	import { AvatarFallback, AvatarImage } from "./ui/avatar";
	import Avatar from "./ui/avatar/avatar.svelte";
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
	} from "./ui/dropdown-menu";
	import type { SessionResponse } from "@/api";
	import { page } from "$app/stores";
	import { requestLogout } from "@/redirect";

	interface Props {
		sessionData: SessionResponse;
	}

	let { sessionData }: Props = $props();
</script>

<svelte:head>
	<link rel="preload" href={sessionData.user.picture} as="image" />
</svelte:head>

<div>
	<div
		class="flex flex-row items-center justify-between gap-2 rounded-xl bg-neutral-500/20 p-2 px-5 transition-all hover:ring-2 hover:ring-black dark:hover:ring-white">
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div class="flex flex-row items-center gap-2">
					<Avatar class="size-12">
						<AvatarImage draggable={false} src={sessionData.user.picture} class="object-contain" />
						<AvatarFallback>
							{sessionData.user.firstName[0].toUpperCase() +
								sessionData.user.lastName[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div class="flex flex-col text-start text-sm">
						<h1 class="dark:text-zinc-100">
							{`${sessionData.user.firstName} ${sessionData.user.lastName}`}
						</h1>
						<p class="text-muted-foreground">
							@{sessionData.user.username}
						</p>
						<p class="text-muted-foreground">{sessionData.user.email}</p>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<a href="/account" target="_blank">
					<DropdownMenuItem>
						<Settings class="mr-2 h-4 w-4" />
						Account settings
					</DropdownMenuItem>
				</a>
				<DropdownMenuSeparator />
				<button type="submit" class="w-full" onclick={() => requestLogout($page.url)}>
					<DropdownMenuItem>
						<LogOut class="mr-2 h-4 w-4" />
						Logout
					</DropdownMenuItem>
				</button>
			</DropdownMenuContent>
		</DropdownMenu>

		<button onclick={() => requestLogout($page.url)}>
			<LogOut class="size-5" />
		</button>
	</div>
</div>
