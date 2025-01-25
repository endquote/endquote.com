<script setup lang="ts">
import type { ProjectsCollectionItem } from "@nuxt/content";

defineProps<{
  projects?: ProjectsCollectionItem[] | null;
}>();
</script>

<template>
  <div v-if="projects" class="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
    <div v-for="project in projects" :key="project.id">
      <ProjectThumb :project="project" />
    </div>
  </div>
</template>
