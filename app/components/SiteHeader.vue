<script setup lang="ts">
const route = useRoute();

const items = computed(() => [
  { label: "About", to: "/about", active: route.path.startsWith("/about") },
  // { label: "Blog", to: "/blog", active: route.path.startsWith("/blog") },
  { label: "Projects", to: "/projects", active: route.path.startsWith("/projects") },
]);
</script>

<template>
  <div class="flex items-center justify-between">
    <NuxtLink to="/" class="text-xl no-underline">Josh Santangelo</NuxtLink>
    <UNavigationMenu :items="items" class="w-auto" :ui="{ link: 'text-base no-underline' }" />
  </div>
</template>
