<script setup lang="ts">
const page = (await useAsyncData(() => queryCollection("content").where("path", "=", "/").first())).data.value!;

useSiteHead(page);

</script>

<template>
  <div>
    <ContentRenderer v-if="page" :value="page" class="prose-custom prose-2xl" />
  </div>
</template>
