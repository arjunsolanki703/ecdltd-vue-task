<template>
	<Header />
	<main class="container">
		<RouterView />
	</main>
</template>

<script setup>
import { RouterView } from "vue-router";
import Header from "@/components/layouts/Header.vue";
</script>
