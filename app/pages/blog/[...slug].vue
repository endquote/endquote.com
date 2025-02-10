<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData(() => {
  if (useDev()) {
    return queryCollection("blog").where("slug", "=", route.path.split("/")[2]).first();
  }

  return queryCollection("blog")
    .where("slug", "=", route.path.split("/")[2])
    .where("draft", "=", false)
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
