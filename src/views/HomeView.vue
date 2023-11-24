<template>
	<!-- Main product container using a 2-column grid layout for responsiveness -->
	<div class="md:grid md:grid-cols-2 gap-6">
		<!-- Product Image slider -->
		<div class="bg-white shadow">
			<!-- Reusable Slider component -->
			<Slider :slides="productMedia" @imageClick="imageClick" />
		</div>

		<!-- Product information section -->
		<div class="p-6 space-y-6">
			<div class="space-y-3">
				<!-- Category and Stocks information -->
				<div class="flex justify-between items-center">
					<h3 class="uppercase text-lg text-gray-600">
						{{ productInfo.category }}
					</h3>

					<p class="text-green-600">
						{{
							productInfo.stocks > 5
								? productInfo.stocks
								: "Hurry Limited Stock"
						}}
					</p>
				</div>

				<!-- Product Title -->
				<h1 class="text-2xl font-medium">{{ productInfo.title }}</h1>
				<!-- Product Price -->
				<h2 class="text-2xl font-medium">
					{{ formattedPrice(productInfo.price) }}
				</h2>
			</div>

			<Divider />

			<!-- Product Details list -->
			<ul class="space-y-6">
				<template v-for="(detail, key) in productInfo.details">
					<!-- Individual product detail item -->
					<li class="flex gap-2">
						<p class="w-32 font-semibold">{{ key }}</p>
						<span>:</span>
						<p class="uppercase">{{ detail }}</p>
					</li>
				</template>
			</ul>

			<Divider />

			<!-- Product quantity control  -->
			<QuantityControl v-model="quantity" />

			<!-- Button component for adding to basket -->
			<Button @click="click" class="w-full">Add To Basket</Button>
		</div>

		<!-- Popup for displaying media in a larger view -->
		<MediaPopup
			v-model="openMediaPopup"
			:index="mediaPopupIndex"
			:type="mediaPopupType"
			:media="productMedia"
			:title="productInfo.title"
		/>
	</div>
</template>

<script setup>
// Import necessary components and data
import Slider from "@/components/elements/Slider.vue";
import Divider from "@/components/elements/Divider.vue";
import Button from "@/components/elements/Button.vue";
import MediaPopup from "@/components/elements/MediaPopup.vue";
import QuantityControl from "@/components/elements/QuantityControl.vue";
import { productInfo, productMedia } from "@/config/data";
import { ref } from "vue";
import { formattedPrice } from "../utils/helpers";

// Product quantity variable
const quantity = ref(1);

// Reactive variables for managing the media popup
const openMediaPopup = ref(false);
const mediaPopupIndex = ref(0);
const mediaPopupType = ref("");

// Function to handle image click in the Slider component
const imageClick = (media, index) => {
	mediaPopupType.value = media.type;
	mediaPopupIndex.value = index;
	openMediaPopup.value = true;
};
</script>
