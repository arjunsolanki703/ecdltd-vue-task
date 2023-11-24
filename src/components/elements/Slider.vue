<template>
	<!-- Main component container -->
	<div
		v-if="getSlides.length"
		class="relative"
		@touchstart="handleTouchStart"
		@touchmove="handleTouchMove"
		@touchend="handleTouchEnd"
	>
		<div class="w-full flex items-start relative">
			<!-- Thumbnails container -->
			<div class="hidden md:block p-4 w-24" :style="{ flex: '0 0 120px' }">
				<!-- Thumbnails component -->
				<Thumbnail
					class="flex-col"
					:media="getSlides"
					:active="currentSlide"
					@image="goToSlide"
				/>
			</div>

			<!-- Slider container -->
			<div class="w-full relative overflow-x-hidden">
				<!-- Slide items -->
				<div
					class="w-full flex transition-transform ease-in-out duration-300"
					:style="{ transform: `translateX(-${currentSlide * 100}%)` }"
				>
					<template v-for="(slide, index) in getSlides" :key="slide">
						<div class="w-full flex-shrink-0 p-8 select-none relative">
							<!-- Individual slide content (image or video) -->
							<template v-if="slide.type === 'image'">
								<img
									@click="imageClick(slide, index)"
									@mousemove="handleMouseOver($event, slide, index)"
									@mouseleave="zoomImage = ''"
									class="max-h-[65vh] h-full mx-auto object-center"
									:src="slide.src"
								/>
								<!-- Zoom magnifier for images -->
								<div
									v-if="zoomImage && !showAllImages"
									class="absolute w-[100px] h-[100px] top-0 left-0 bg-blue-500/20 pointer-events-none"
									:style="{ top: cursorTop + 'px', left: cursorLeft + 'px' }"
								></div>
							</template>
							<template v-else-if="slide.type === 'video'">
								<video
									class="w-full max-h-[65vh] h-full mx-auto object-center"
									controls
								>
									<source :src="slide.src" type="video/mp4" />
									Your browser does not support the video tag.
								</video>
							</template>
						</div>
					</template>
				</div>

				<!-- Left arrow button -->
				<button
					@click="prevSlide"
					class="absolute left-0 top-1/2 transform -translate-y-1/2"
				>
					<ChevronLeftIcon class="w-5 h-5" />
				</button>
				<!-- Right arrow button -->
				<button
					@click="nextSlide"
					class="absolute right-0 top-1/2 transform -translate-y-1/2"
				>
					<ChevronRightIcon class="w-5 h-5" />
				</button>

				<!-- Slider dots for navigation -->
				<div class="flex justify-center space-x-2 py-2">
					<span
						v-for="(_, index) in imageCount"
						:key="index"
						@click="goToSlide(index)"
						:class="{
							'bg-orange-500': index === currentSlide,
							'bg-transparent border border-gray-500': index !== currentSlide,
						}"
						class="block w-3 h-3 rounded-full cursor-pointer"
					></span>
				</div>
			</div>

			<!-- Zoomed image container -->
			<div
				v-if="zoomImage && !showAllImages"
				class="absolute w-[500px] h-[500px] top-8 left-[calc(100%+16px)] border rounded-md shadow overflow-hidden bg-white p-8"
			>
				<!-- Zoomed image -->
				<img
					:src="zoomImage"
					:style="{
						transform: `scale(${zoomFactor})`,
						transformOrigin: `${(magnifiedX * 100) / 2}px ${
							(magnifiedY * 100) / 2
						}px`,
					}"
					class="w-full h-full object-contain"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import Thumbnail from "./Thumbnail.vue";

const props = defineProps({
	slides: { type: Array, required: false, default: () => [] },
});
const emit = defineEmits(["imageClick"]);

const showAllImages = ref(false);
const onResize = () => {
	showAllImages.value = window.innerWidth <= 768;
};

// Watch for changes in showAllMedia and reset activeMediaType and activeIndex
watch(() => props.slides, onResize);

// Handle onMounted lifecycle hook
onMounted(() => {
	// Initialize showAllMedia based on initial window width
	onResize();

	// Add event listener for resize
	window.addEventListener("resize", onResize);

	currentSlide.value = 0;
});

// State variables
const currentSlide = ref(0);
const getSlides = computed(() => {
	if (showAllImages.value) {
		return props.slides.filter((slide) => slide.type === "image");
	}
	return props.slides;
});
const imageCount = computed(() => getSlides.value.length);

// Slide transition methods
const nextSlide = () => {
	currentSlide.value = (currentSlide.value + 1) % imageCount.value;
};
const prevSlide = () => {
	currentSlide.value =
		(currentSlide.value - 1 + imageCount.value) % imageCount.value;
};
const goToSlide = (index) => {
	currentSlide.value = index;
};
const imageClick = (media, index) => {
	emit("imageClick", media, index);
};

// Zoomed image variables and methods
const zoomImage = ref("");
const zoomFactor = ref(1);
const magnifiedX = ref(0);
const magnifiedY = ref(0);
const cursorTop = ref(0);
const cursorLeft = ref(0);

const handleMouseOver = (event, media) => {
	const rect = event.target.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;
	const offsetX = mouseX / event.target.width;
	const offsetY = mouseY / event.target.height;
	const scale = 5;
	zoomFactor.value = scale;
	cursorTop.value = event.offsetY;
	cursorLeft.value = event.offsetX;
	magnifiedX.value = offsetX * 10;
	magnifiedY.value = offsetY * 10;
	zoomImage.value = media.src;
};

// Touch/drag/swipe slide methods
let startX = 0;
let endX = 0;

const handleTouchStart = (event) => {
	startX = event.touches[0].clientX;
};
const handleTouchMove = (event) => {
	endX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
	const deltaX = endX - startX;
	if (deltaX > 50) {
		prevSlide();
	} else if (deltaX < -50) {
		nextSlide();
	}
	startX = 0;
	endX = 0;
};
</script>
