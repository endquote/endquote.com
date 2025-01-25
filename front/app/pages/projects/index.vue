<script setup lang="ts">
const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/projects").first())).data.value!;
const projects = (await useAsyncData(() => queryCollection("projects").order("date", "DESC").all())).data.value!;
useSiteHead(page);
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
  <ProjectGrid :projects="projects" />
</template>
