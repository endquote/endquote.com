<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value);

const { data: posts } = await useAsyncData(() =>
  queryCollection("blog")
    .where("draft", "=", false)
    .where("date", "<", new Date().toISOString())
    .order("date", "DESC")
    .all(),
);
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <div v-for="post in posts" :key="post.slug" class="flex">
      <div class="mr-4 text-nowrap">{{ useDateFormat(post.date, "MMM D, YYYY") }}</div>
      <div>
        <a :href="`/blog/${post.slug}`"
          ><strong>{{ post.title }}</strong> - {{ post.subtitle }}</a
        >
      </div>
    </div>
  </div>
</template>
