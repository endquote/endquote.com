<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value, { image: page.value?.image });
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" class="prose-custom prose-2xl" />
  </div>
</template>
