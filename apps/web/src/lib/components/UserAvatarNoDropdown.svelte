<script lang="ts">
	import { AvatarFallback, AvatarImage } from "./ui/avatar";
	import Avatar from "./ui/avatar/avatar.svelte";
	import { cn } from "$lib/utils";
	import type { SessionResponse } from "@/api";

	interface Props {
		sessionData: SessionResponse;
		class?: string;
	}

	let { sessionData, class: className = "" }: Props = $props();
</script>

<div
	class={cn(
		"flex flex-row items-center justify-between gap-2 rounded-xl bg-neutral-500/20 p-2 px-5 transition-all hover:ring-2 hover:ring-black dark:hover:ring-white",
		className,
	)}>
	<div class="flex flex-row items-center gap-2">
		<Avatar class="size-12">
			<AvatarImage
				draggable={false}
				src={sessionData.user.picture}
				class="[image-rendering: -webkit-optimize-contrast] [image-rendering: crisp-edges]" />
			<AvatarFallback>
				{sessionData.user.firstName[0].toUpperCase() + sessionData.user.lastName[0].toUpperCase()}
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
</div>

<style>
	.avatar {
		image-rendering: -webkit-optimize-contrast;
		image-rendering: crisp-edges;
	}
</style>
