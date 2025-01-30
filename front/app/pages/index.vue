<script setup lang="ts">
const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/").first())).data.value!;

useSiteHead(page);

import { onMounted, ref } from "vue";

const data = ref([]);
const loading = ref(true);
const error = ref<Error | null>(null);

onMounted(async () => {
  try {
    data.value = await $fetch("/api/checkin");
  } catch (err) {
    error.value = err as Error;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" class="prose-custom prose-2xl" />
    <div class="hidden">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else>{{ JSON.stringify(data) }}</div>
    </div>
  </div>
</template>
