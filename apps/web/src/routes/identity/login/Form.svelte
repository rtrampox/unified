<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as InputOTP from "$lib/components/ui/input-otp";

	import { Turnstile } from "svelte-turnstile";
	import { superForm } from "sveltekit-superforms";
	import { Input } from "@/components/ui/input";
	import type { ActionData, PageData } from "./$types";
	import Button from "@/components/ui/button/button.svelte";
	import { zod } from "sveltekit-superforms/adapters";
	import { loginSchema } from "./schema";
	import { Checkbox } from "@/components/ui/checkbox";
	import { toast } from "svelte-sonner";
	import { cn } from "@/utils";
	import { slide } from "svelte/transition";
	import { env } from "$env/dynamic/public";

	type Props = {
		data: PageData;
		form: ActionData;
	};

	let { data, form }: Props = $props();

	const forms = superForm(data.form, {
		validators: zod(loginSchema),
		resetForm: false,
	});
	const { enhance, form: formSF, submitting, message } = forms;

	let otp = $state(form?.otp);

	let lastEmailInput = $state($formSF.email);

	let formMessage = $derived(form?.message);

	let isChecking = $state(true);

	let reset = $state(() => {
		otp = false;
		isChecking = true;
	});

	$effect(() => {
		if (form?.otp) {
			otp = form.otp;
		}
	});

	$effect(() => {
		if ($formSF.email !== lastEmailInput) {
			lastEmailInput = $formSF.email;
			otp = false;
		}
	});

	$effect(() => {
		if ($message) {
			toast($message);
		}

		if (formMessage) {
			toast.error(formMessage);
		}

		return () => {
			reset?.();
		};
	});
</script>

<div class="space-y-4">
	<div class="space-y-2">
		<form
			method="POST"
			action={form?.otp ? "?/loginOtp" : "?/login"}
			use:enhance
			class="flex w-full flex-col gap-1"
		>
			<Form.Field form={forms} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>email</Form.Label>
						<Input
							{...props}
							class="h-12 w-full border-zinc-200 bg-zinc-50 transition-all dark:border-zinc-700 dark:bg-zinc-950/50"
							bind:value={$formSF.email}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field form={forms} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>password</Form.Label>
						<Input
							{...props}
							type="password"
							class="h-12 w-full border-zinc-200 bg-zinc-50 transition-all dark:border-zinc-700 dark:bg-zinc-950/50"
							bind:value={$formSF.password}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			{#if otp}
				<div transition:slide>
					<Form.Field form={forms} name="code">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Confirm it's you</Form.Label>
								<InputOTP.Root
									maxlength={6}
									{...props}
									bind:value={$formSF.code}
									class={cn(
										"flex h-12 w-full items-center justify-center bg-zinc-50 ",
										"border-input rounded-lg border p-7 transition-all dark:border-zinc-700 dark:bg-zinc-950/50",
									)}
								>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells.slice(0, 3) as cell}
												<InputOTP.Slot {cell} />
											{/each}
										</InputOTP.Group>
										<InputOTP.Separator />
										<InputOTP.Group>
											{#each cells.slice(3, 6) as cell}
												<InputOTP.Slot {cell} />
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>
			{/if}

			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<Form.Field form={forms} name="trust">
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex items-center justify-between space-x-2">
										<Checkbox {...props} bind:checked={$formSF.trust} />
										<Form.Label>Trust this device</Form.Label>
									</div>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
					</div>

					<a
						href="/identity/forgot"
						class="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
					>
						Forgot password?
					</a>
				</div>

				<Turnstile
					class="w-full"
					size="flexible"
					siteKey={env.PUBLIC_SITE_KEY}
					theme="dark"
					language="en"
					action="user-non_otp-login"
					bind:reset
					on:callback={() => (isChecking = false)}
				/>

				<input
					hidden
					name="callback"
					value={new URLSearchParams(data.searchParams).get("callback")}
				/>

				<Button type="submit" class="w-full" isLoading={$submitting || isChecking}>Continue</Button>
			</div>
		</form>
	</div>
</div>
