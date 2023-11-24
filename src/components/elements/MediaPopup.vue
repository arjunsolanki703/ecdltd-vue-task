<template>
	<!-- Media Popup component -->
	<div
		v-if="props.modelValue"
		class="fixed inset-0 z-[9999] w-full min-h-screen overflow-y-auto md:p-6 bg-black bg-opacity-20"
	>
		<div
			class="max-w-screen-lg min-h-full bg-white mx-auto rounded-md border p-3"
		>
			<!-- Popup header -->
			<div
				class="flex justify-end md:justify-between items-center px-4 border-b"
			>
				<!-- Media type selection buttons -->
				<div class="space-x-4 hidden md:block">
					<template v-for="media in mediaType">
						<Button
							class="border-b-2 px-0 capitalize"
							:class="{
								'border-yellow-500': activeMediaType === media,
								'hover:border-yellow-500 border-transparent':
									activeMediaType !== media,
							}"
							@click="goToType(media)"
							variant="text"
							fontSize="sm"
							>{{ media }}</Button
						>
					</template>
				</div>
				<!-- Close button -->
				<Button @click="closePopup" variant="text">
					<XMarkIcon class="w-5 h-5" />
				</Button>
			</div>

			<!-- Media content section -->
			<div class="md:grid grid-cols-12 gap-4">
				<!-- Media display area -->
				<div
					class="col-span-8 px-8 py-12 overflow-hidden"
					@mousedown="startDrag"
					@mousemove="handleDrag"
					@mouseup="stopDrag"
					@dblclick="toggleZoom"
				>
					<!-- Media Type (IMAGE) -->
					<template v-if="activeMediaType === 'image'">
						<div
							ref="zoomContainer"
							class="w-full h-full object-cover"
							:style="{
								transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
							}"
						>
							<img
								title="Double click to zoom in/out"
								:src="
									showAllMedia
										? getMedia[activeIndex].src
										: images[activeIndex].src
								"
								:style="{ transform: `scale(${zoomLevel})` }"
								@dragstart.prevent="preventDefaultDrag"
								class="max-h-[70vh] h-full mx-auto transition-all"
								:class="zoomLevel === 2 ? 'cursor-zoom-out' : 'cursor-zoom-in'"
							/>
						</div>
					</template>

					<!-- Media Type (VIDEO) -->
					<template v-if="activeMediaType === 'video'">
						<video
							:src="
								showAllMedia
									? getMedia[activeIndex].src
									: videos[activeIndex].src
							"
							ref="video"
							class="max-h-[70vh] h-full mx-auto"
							controls
						>
							Your browser does not support the video tag.
						</video>
					</template>
				</div>

				<!-- Thumbnail and media controls area -->
				<div
					class="col-span-4 p-4 space-y-6 absolute md:relative bottom-0 left-0 w-full bg-white"
				>
					<h4 class="hidden md:block text-lg font-medium">{{ props.title }}</h4>
					<Divider class="hidden md:block" />
					<!-- Thumbnail component for media navigation -->
					<Thumbnail
						:active="activeIndex"
						class="overflow-x-auto md:flex-wrap gap-2 space-x-0"
						:media="getMedia"
						@image="goToImage"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import Button from "./Button.vue";
import Thumbnail from "./Thumbnail.vue";
import Divider from "./Divider.vue";

// Define props for the component
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
	},
	index: {
		type: Boolean,
	},
	media: {
		type: Array,
		default: () => [],
	},
	title: {
		type: String,
		default: "",
	},
});

// Define refs and reactive variables
const showAllMedia = ref(false);

// Function to handle resizing and set showAllMedia
const onResize = () => {
	showAllMedia.value = window.innerWidth <= 768;
};

// Watch for changes in showAllMedia and reset activeMediaType and activeIndex
watch(showAllMedia, (value) => {
	activeMediaType.value = value ? "image" : "video";
	activeIndex.value = 0;
});

// Watch [props.type, props.index, props.modelValue] and reset zoomLevel, activeMediaType and activeIndex
watch(
	() => [props.type, props.index, props.modelValue],
	() => {
		activeMediaType.value = props.type;
		let index = -1;
		for (let i = 0; i < props.media.length; i++) {
			if (props.media[i].type === props.type) {
				index++;
				if (index === props.index) {
					break;
				}
			}
		}
		activeIndex.value = index;
		zoomLevel.value = 1;
	}
);

// Handle onMounted lifecycle hook
onMounted(() => {
	// Initialize showAllMedia based on initial window width
	onResize();

	// Add event listener for resize
	window.addEventListener("resize", onResize);
});

// Computed properties for images and videos
const images = computed(() => {
	return props.media.filter((item) => item.type === "image");
});

const videos = computed(() => {
	return props.media.filter((item) => item.type === "video");
});

// Computed property to determine the current media to display
const getMedia = computed(() => {
	return activeMediaType.value === "image" || showAllMedia.value
		? images.value
		: videos.value;
});

// Define emits for the component
const emit = defineEmits(["update:modelValue"]);

// Array of media types
const mediaType = ["image", "video"];

// Define refs for active media type, active index, and video element
const activeMediaType = ref("image");
const activeIndex = ref(0);
const video = ref(null);

// Function to close the popup
const closePopup = () => {
	emit("update:modelValue", false);
};

// Function to switch to a specific media type
const goToType = (media) => {
	activeMediaType.value = media;
	activeIndex.value = 0;
	zoomLevel.value = 1;
};

// Function to switch to a specific image in the media
const goToImage = (index) => {
	activeIndex.value = index;
	zoomLevel.value = 1;
};

// Panning and zooming functionality
const zoomLevel = ref(1);
const zoomContainer = ref(null);

// Function to toggle zoom in/out
const toggleZoom = async (event) => {
	if (zoomLevel.value === 2) {
		translateX.value = 0; // Reset translateX to the original position
		translateY.value = 0; // Reset translateY to the original position
	} else {
		// Calculate the click position relative to the zoom container
		const containerRect = zoomContainer.value.getBoundingClientRect();
		const clickX = event.clientX - containerRect.left;
		const clickY = event.clientY - containerRect.top;

		// Calculate the new translation to center the zoom at the clicked position
		await nextTick();
		translateX.value = -(clickX / scale.value - containerRect.width / 2);
		translateY.value = -(clickY / scale.value - containerRect.height / 2);
	}

	zoomLevel.value = zoomLevel.value === 2 ? 1 : 2;
};

// Variables and functions for handling dragging events
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
let isDragging = false;
let startX = 0;
let startY = 0;
let startTranslateX = 0;
let startTranslateY = 0;

// Function to start dragging
const startDrag = (event) => {
	if (zoomLevel.value === 1) return;
	isDragging = true;
	startX = event.clientX;
	startY = event.clientY;
	startTranslateX = translateX.value;
	startTranslateY = translateY.value;
};

// Function to handle dragging
const handleDrag = (event) => {
	event.preventDefault();
	if (!isDragging) return;

	const deltaX = event.clientX - startX;
	const deltaY = event.clientY - startY;

	translateX.value = startTranslateX + deltaX / scale.value;
	translateY.value = startTranslateY + deltaY / scale.value;
};

// Function to stop dragging
const stopDrag = () => {
	isDragging = false;
};

// Function to prevent default dragging behavior
const preventDefaultDrag = (event) => {
	event.preventDefault();
};
</script>
