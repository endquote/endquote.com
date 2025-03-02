<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const route = useRoute();

const { data: page } = await useAsyncData(() => {
  if (useDev()) {
    return queryCollection("blog").path(route.path).first();
  }

  return queryCollection("blog")
    .path(route.path)
    .where("robots", "=", true)
    .where("date", "<", new Date().toISOString())
    .first();
});

if (!page.value) {
  throw createError({ statusCode: 404 });
}

useSiteHead(page.value, { image: page.value?.image });
</script>

<template>
  <div v-if="page" class="prose-custom">
    <div class="mb-2 flex flex-col md:flex-row">
      <div class="flex-1">
        {{ useDateFormat(page.date, "MMM D, YYYY, h:mma") }}
      </div>
      <div class="flex-shrink-0">
        {{ page.location }}
      </div>
    </div>

    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
