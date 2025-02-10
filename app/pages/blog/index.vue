<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
const route = useRoute();
const { data: page } = await useAsyncData(() => queryCollection("content").path(route.path).first());
useSiteHead(page.value);

const now = ref(new Date().toISOString());

const { data: posts } = await useAsyncData(() => {
  if (useDev()) {
    return queryCollection("blog").order("date", "DESC").all();
  }
  return queryCollection("blog").where("draft", "=", false).where("date", "<", now.value).order("date", "DESC").all();
});
</script>

<template>
  <div class="prose-custom">
    <ContentRenderer v-if="page" :value="page" />
    <div
      v-for="post in posts"
      class="table-row w-full"
      :key="post.slug"
      :class="{ 'bg-amber-400': post.draft || post.date > now }"
    >
      <div class="table-cell text-nowrap pr-7">{{ useDateFormat(post.date, "MMM D, YYYY") }}</div>
      <div class="table-cell w-full">
        <a :href="`/blog/${post.slug}`">
          <strong>{{ post.title }}</strong> - {{ post.subtitle }}
        </a>
      </div>
    </div>
  </div>
</template>
