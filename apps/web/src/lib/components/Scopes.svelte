<script lang="ts">
	import { getScopes, type Scopes } from "@/auth/get-scopes";
	import {
		AtSignIcon,
		IdCardIcon,
		MapPinIcon,
		PhoneIcon,
		RefreshCcw,
		UserIcon,
		UserRoundIcon,
	} from "lucide-svelte";

	type Props = {
		scopes: string[];
	};

	let { scopes }: Props = $props();

	const resolvedScopes = getScopes(scopes as Scopes[]);
</script>

<div class="flex flex-col gap-2">
	{#each resolvedScopes as scope, i}
		<span class="text-md items-base flex flex-row justify-start gap-1 break-words text-base">
			{#if scopes[i] === "openid"}
				<IdCardIcon class="size-5" />
			{:else if scopes[i] === "profile"}
				<UserIcon class="size-5" />
			{:else if scopes[i] === "email"}
				<AtSignIcon class="size-5" />
			{:else if scopes[i] === "address"}
				<MapPinIcon class="size-5" />
			{:else if scopes[i] === "phone"}
				<PhoneIcon class="size-5" />
			{:else if scopes[i] === "account"}
				<UserRoundIcon class="size-5" />
			{:else if scopes[i] === "offline_access"}
				<RefreshCcw class="size-5" />
			{/if}
			{scope}
		</span>
	{/each}
</div>
