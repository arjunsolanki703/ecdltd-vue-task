<template>
	<!-- Button component with dynamic classes based on props -->
	<button
		:class="`py-3 px-4 text-${props.fontSize} ${getVariantClass} font-medium`"
	>
		<!-- Slot for button content -->
		<slot />
	</button>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
	variant: {
		type: String,
		required: false,
		default: "contained",
	},
	fontSize: {
		type: String,
		required: false,
		default: "lg",
	},
});

// Compute the dynamic variant class based on the 'variant' prop
const getVariantClass = computed(() => {
	if (props.variant === "outlined") {
		return "bg-transparent border border-gray-500";
	} else if (props.variant === "contained") {
		return "bg-yellow-400 border border-yellow-400";
	} else if (props.variant === "text") {
		return "bg-transparent";
	} else {
		return ""; // Default case
	}
});
</script>
