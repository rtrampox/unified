<script lang="ts">
	import * as Avatar from "@/components/ui/avatar";
	import { Input } from "@/components/ui/input";
	import { Label } from "@/components/ui/label";

	let { data } = $props();
</script>

{#if data.isLoggedIn}
	<main
		class="mb-10 flex h-full w-[90vw] flex-col items-center justify-center gap-5 pt-5 sm:w-[80vw] xl:w-[50vw]">
		<div class="flex w-full flex-row items-center justify-between rounded-lg bg-neutral-900 p-5">
			<p class="text-lg">Profile Picture</p>
			<div>
				<Avatar.Avatar class="size-16">
					<Avatar.AvatarImage
						draggable={false}
						src={data.session.user.picture}
						class="[image-rendering: -webkit-optimize-contrast] [image-rendering: crisp-edges]" />
					<Avatar.AvatarFallback>
						{data.session.user.firstName[0].toUpperCase() +
							data.session.user.lastName[0].toUpperCase()}
					</Avatar.AvatarFallback>
				</Avatar.Avatar>
			</div>
		</div>
		<div class="flex w-full flex-col gap-3 rounded-lg bg-neutral-900 p-5">
			<p class="text-lg font-semibold">Basic Information</p>
			<div>
				<Label for="name">Name</Label>
				<Input id="name" />
			</div>
			<div>
				<label for="last-name">Last Name</label>
				<Input id="last-name" />
			</div>
			<div>
				<label for="email">Email</label>
				<Input id="email" class="pointer-events-none" />
			</div>
		</div>
	</main>
{/if}
