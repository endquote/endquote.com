<script setup lang="ts">
const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/").first())).data.value!;

useSiteHead(page);
const dev = useDev();
const runtime = useRuntimeConfig();
// console.log("dev", dev);
// console.log("runtime", runtime);
</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" class="prose-custom prose-2xl" />
  </div>
</template>
