<script lang="ts">
	import { enhance } from "$app/forms";
	import Cropper, { type CropArea } from "@rtrampox/svelte-easy-crop";

	let { form, data } = $props();

	let files = $state<FileList | null>(null);
	let image = $state<string>(data.session.user.picture ?? "");
	let pixelArea = $state<CropArea>();
	let pPixelArea = $derived(JSON.stringify(pixelArea));

	const onchange = () => {
		if (files) {
			let file = files[0];
			let reader = new FileReader();
			reader.onload = (e) => {
				image = (e.target?.result as string) ?? "";
			};
			reader.readAsDataURL(file);
		}
	};

	let src = $state<string | undefined>();

	$effect(() => {
		console.log(form);
	});
</script>

<div class="flex flex-col items-center justify-center gap-2">
	<form method="post" use:enhance enctype="multipart/form-data">
		<input type="file" accept=".jpg, .jpeg, .png, .webp" {onchange} bind:files name="file" />
		<input type="hidden" name="crop" value={pPixelArea} />
		<button type="submit">Form Test</button>
	</form>

	<div class="relative size-[300px]">
		<Cropper
			{image}
			zoom={1}
			aspect={1}
			zoomSpeed={0.3}
			crop={{ x: 0, y: 0 }}
			cropShape="rect"
			restrictPosition={true}
			oncropcomplete={(e) => {
				pixelArea = e.pixels;
			}} />
	</div>
</div>
<img {src} alt="Profile" />
