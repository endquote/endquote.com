<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value, { image: page.value?.image });
const { data: projects } = await useAsyncData(() => queryCollection("projects").order("date", "DESC").all());
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
  <ProjectGrid :projects="projects" />
</template>
