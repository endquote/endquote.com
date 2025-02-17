<script setup lang="ts">
import type { ProjectsCollectionItem } from "@nuxt/content";
import Image from "./Image.vue";

const props = defineProps<{
  project: ProjectsCollectionItem;
}>();
</script>

<template>
  <NuxtLink :to="`/${project.stem}`" class="group relative block overflow-hidden rounded-lg">
    <div>
      <Image :src="`/do/${project.stem}/project.jpg`" width="640" height="426"
        sizes="640px sm:560px md:330px lg:296px xl:381px 2xl:467px" :alt="project.title" class="w-full" />
    </div>
    <div class="absolute inset-0 bg-white/90 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
      <div
        class="pointer-events-none flex h-full w-full translate-y-1/3 flex-col items-center justify-center px-4 transition-all duration-300 ease-out group-hover:translate-y-0 text-[var(--ui-color-neutral-700)]">
        <div class="mb-1 text-center text-2xl font-bold">{{ project.title }}</div>
        <div class="text-center">{{ project.subtitle }}</div>
      </div>
    </div>
  </NuxtLink>
</template>
