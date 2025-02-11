<script setup lang="ts">
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

useSiteHead(page.value);
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
  </div>
</template>
