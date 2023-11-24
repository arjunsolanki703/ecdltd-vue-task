<template>
	<!-- Quantity Selector component -->
	<div class="flex items-center">
		<!-- Button to decrease quantity -->
		<button
			@click="updateQuantity('remove')"
			class="w-10 h-10 text-center leading-10 text-xl"
		>
			-
		</button>

		<!-- Input field to display and edit quantity -->
		<input
			class="w-10 h-10 text-center leading-10"
			readonly
			:value="props.modelValue"
		/>

		<!-- Button to increase quantity -->
		<button
			@click="updateQuantity('add')"
			class="w-10 h-10 text-center leading-10 text-xl"
		>
			+
		</button>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
	modelValue: {
		type: Number,
	},
});

const emit = defineEmits(["update:modelValue"]);

// Function to update quantity based on the action type (add/remove)
const updateQuantity = (type) => {
	// If the action type is 'add', emit an event to increase the quantity
	if (type === "add") {
		emit("update:modelValue", props.modelValue + 1);
	}

	// If the action type is 'remove' and the current quantity is greater than 1,
	// emit an event to decrease the quantity
	if (type === "remove" && props.modelValue > 1) {
		emit("update:modelValue", props.modelValue - 1);
	}
};
</script>
