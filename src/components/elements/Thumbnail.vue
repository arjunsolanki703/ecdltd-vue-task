<template>
	<!-- Container for thumbnails -->
	<div class="flex overflow-hidden gap-2 mb-4">
		<!-- Thumbnail List -->
		<div
			v-for="(item, index) in props.media"
			:key="index"
			@click="() => click(index, item)"
			class="w-20 h-20 rounded-md overflow-hidden cursor-pointer p-2 border-2"
			:style="{ flex: '0 0 80px' }"
			:class="index === props.active ? 'border-blue-500' : 'hover:border-yellow-500'"
		>
			<!-- Thumbnail image -->
			<img :src="item.thumbnail" class="w-full h-full object-cover" />
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
	active: {
		type: Number,
		default: -1,
	},
	media: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["image"]);

// Handle thumbnail click event
const click = (index, item) => {
	emit("image", index, item);
};
</script>
