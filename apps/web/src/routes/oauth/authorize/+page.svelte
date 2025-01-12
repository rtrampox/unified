<script lang="ts">
	import Block from "@/components/default/Block.svelte";
	import Content from "./Content.svelte";
	import Body from "@/components/default/Body.svelte";

	let { data, form } = $props();
</script>

<Block>
	<Body type="oauth" class="max-w-lg">
		<Content {data} {form} />
	</Body>
</Block>
